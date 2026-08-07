import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/config/site"
import { prisma } from "@/server/db"
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

export async function getDbUserRole(userId: string): Promise<Role> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  return (user?.role as Role | undefined) ?? "SUBSCRIBER"
}

export async function requireRole(roles: Role[]) {
  const session = await requireSession()
  // Prefer DB role so upgrades are not blocked by session cookie cache
  const role = await getDbUserRole(session.user.id)
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
