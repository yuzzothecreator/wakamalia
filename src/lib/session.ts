import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/config/site"
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
  if ((session.user as { banned?: boolean }).banned) {
    throw new Error("Account banned")
  }
  return session
}

export async function requireRole(roles: Role[]) {
  const session = await requireSession()
  const role = (session.user as { role?: Role }).role ?? "SUBSCRIBER"
  if (role !== "ADMIN" && !roles.includes(role)) {
    throw new Error("Forbidden")
  }
  return session
}

/** Tipster publishing + admin */
export async function requireTipster() {
  return requireRole(["TIPSTER", "ADMIN"])
}

export function hasRole(
  userRole: Role | string | undefined,
  allowed: Role[]
): boolean {
  if (!userRole) return false
  if (userRole === "ADMIN") return true
  return allowed.includes(userRole as Role)
}

export async function requireAdminPage() {
  const session = await getSession()
  if (!session?.user) {
    redirect(`${ROUTES.login}?callbackUrl=${encodeURIComponent("/admin")}`)
  }
  if ((session.user as { banned?: boolean }).banned) {
    redirect(ROUTES.home)
  }
  const role = (session.user as { role?: Role }).role
  if (role !== "ADMIN") {
    redirect(ROUTES.dashboard.tipster)
  }
  return session
}
