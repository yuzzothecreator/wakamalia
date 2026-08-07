import {
  DashboardSidebar,
  DashboardMobileHeader,
} from "@/components/layout/dashboard-sidebar"
import { getSession, getDbUserRole } from "@/lib/session"
import type { Role } from "@/types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const role: Role = session?.user
    ? await getDbUserRole(session.user.id)
    : "GUEST"

  return (
    <div className="flex min-h-screen bg-[#ecf8f5] dark:bg-background">
      <DashboardSidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardMobileHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
