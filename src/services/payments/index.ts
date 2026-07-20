export type PaymentProvider =
  | "STRIPE"
  | "FLUTTERWAVE"
  | "PAYSTACK"
  | "AZAMPAY"
  | "MPESA"
  | "BANK_TRANSFER"
  | "WALLET"

export interface CheckoutInput {
  amount: number
  currency?: string
  userId: string
  reference: string
  description?: string
  metadata?: Record<string, string>
  callbackUrl?: string
}

export interface CheckoutResult {
  provider: PaymentProvider
  reference: string
  checkoutUrl?: string
  clientSecret?: string
  instructions?: string
}

export interface VerifyPaymentInput {
  provider: PaymentProvider
  reference: string
  transactionId?: string
}

export interface VerifyPaymentResult {
  success: boolean
  reference: string
  amount?: number
  currency?: string
  status: "PENDING" | "COMPLETED" | "FAILED"
  raw?: unknown
}

export interface PaymentAdapter {
  provider: PaymentProvider
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>
}

function stubCheckout(
  provider: PaymentProvider,
  input: CheckoutInput
): CheckoutResult {
  return {
    provider,
    reference: input.reference,
    checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/wallet?ref=${input.reference}`,
    instructions:
      provider === "BANK_TRANSFER"
        ? "Transfer to Wakamalia Ltd — use reference on your payment."
        : undefined,
  }
}

function stubVerify(
  provider: PaymentProvider,
  input: VerifyPaymentInput
): Promise<VerifyPaymentResult> {
  return Promise.resolve({
    success: true,
    reference: input.reference,
    status: "COMPLETED",
    raw: { provider, stub: true },
  })
}

export const stripeAdapter: PaymentAdapter = {
  provider: "STRIPE",
  createCheckout: (input) =>
    Promise.resolve({
      ...stubCheckout("STRIPE", input),
      clientSecret: `pi_stub_${input.reference}`,
    }),
  verifyPayment: (input) => stubVerify("STRIPE", input),
}

export const flutterwaveAdapter: PaymentAdapter = {
  provider: "FLUTTERWAVE",
  createCheckout: (input) => Promise.resolve(stubCheckout("FLUTTERWAVE", input)),
  verifyPayment: (input) => stubVerify("FLUTTERWAVE", input),
}

export const paystackAdapter: PaymentAdapter = {
  provider: "PAYSTACK",
  createCheckout: (input) => Promise.resolve(stubCheckout("PAYSTACK", input)),
  verifyPayment: (input) => stubVerify("PAYSTACK", input),
}

export const azampayAdapter: PaymentAdapter = {
  provider: "AZAMPAY",
  createCheckout: (input) => Promise.resolve(stubCheckout("AZAMPAY", input)),
  verifyPayment: (input) => stubVerify("AZAMPAY", input),
}

export const mpesaAdapter: PaymentAdapter = {
  provider: "MPESA",
  createCheckout: (input) =>
    Promise.resolve({
      ...stubCheckout("MPESA", input),
      instructions: "Complete STK push on your phone when prompted.",
    }),
  verifyPayment: (input) => stubVerify("MPESA", input),
}

export const bankTransferAdapter: PaymentAdapter = {
  provider: "BANK_TRANSFER",
  createCheckout: (input) => Promise.resolve(stubCheckout("BANK_TRANSFER", input)),
  verifyPayment: async (input) => {
    const base = await stubVerify("BANK_TRANSFER", input)
    return { ...base, status: "PENDING" as const, success: false }
  },
}

const adapters: Record<PaymentProvider, PaymentAdapter> = {
  STRIPE: stripeAdapter,
  FLUTTERWAVE: flutterwaveAdapter,
  PAYSTACK: paystackAdapter,
  AZAMPAY: azampayAdapter,
  MPESA: mpesaAdapter,
  BANK_TRANSFER: bankTransferAdapter,
  WALLET: {
    provider: "WALLET",
    createCheckout: (input) =>
      Promise.resolve({
        provider: "WALLET",
        reference: input.reference,
      }),
    verifyPayment: (input) => stubVerify("WALLET", input),
  },
}

export function getPaymentAdapter(provider: PaymentProvider): PaymentAdapter {
  return adapters[provider]
}

export async function createCheckout(
  provider: PaymentProvider,
  input: CheckoutInput
): Promise<CheckoutResult> {
  return getPaymentAdapter(provider).createCheckout(input)
}

export async function verifyPayment(
  provider: PaymentProvider,
  input: VerifyPaymentInput
): Promise<VerifyPaymentResult> {
  return getPaymentAdapter(provider).verifyPayment(input)
}

export { adapters as paymentAdapters }
