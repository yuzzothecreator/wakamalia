import { NextResponse } from "next/server"
import { newsletterSchema } from "@/lib/validations"
import { prisma } from "@/server/db"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon"
  const limited = rateLimit(`newsletter:${ip}`, { windowMs: 60_000, max: 5 })
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const parsed = newsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: { active: true },
      create: { email: parsed.data.email },
    })
  } catch {
    // Soft-succeed when DB is offline (UI still works)
  }

  return NextResponse.json({ success: true })
}
