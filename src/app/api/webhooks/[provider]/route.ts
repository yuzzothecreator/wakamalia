import { NextRequest, NextResponse } from "next/server"
import { verifyPayment, type PaymentProvider } from "@/services/payments"

const PROVIDERS = new Set([
  "stripe",
  "flutterwave",
  "paystack",
  "azampay",
  "mpesa",
])

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider: raw } = await context.params
  if (!PROVIDERS.has(raw)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 })
  }

  const body = await req.json().catch(() => ({}))
  const externalId =
    body.id ??
    body.data?.id ??
    body.reference ??
    body.Body?.stkCallback?.CheckoutRequestID

  if (!externalId) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 })
  }

  const map: Record<string, PaymentProvider> = {
    stripe: "STRIPE",
    flutterwave: "FLUTTERWAVE",
    paystack: "PAYSTACK",
    azampay: "AZAMPAY",
    mpesa: "MPESA",
  }

  const provider = map[raw]
  const result = await verifyPayment(provider, {
    provider,
    reference: String(externalId),
  })

  return NextResponse.json({ received: true, ...result })
}
