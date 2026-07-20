import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import type { Role } from "@/types"

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

export async function requireSession() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function requireRole(roles: Role[]) {
  const session = await requireSession()
  const role = (session.user as { role?: Role }).role ?? "SUBSCRIBER"
  if (!roles.includes(role) && role !== "ADMIN") {
    throw new Error("Forbidden")
  }
  return session
}

export function hasRole(
  userRole: Role | string | undefined,
  allowed: Role[]
): boolean {
  if (!userRole) return false
  if (userRole === "ADMIN") return true
  return allowed.includes(userRole as Role)
}
