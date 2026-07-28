import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  Target,
  CreditCard,
  ArrowDownToLine,
  BadgeCheck,
  Flag,
  Settings,
} from "lucide-react"
import { Logo } from "@/components/shared/logo"
import { requireAdminPage } from "@/lib/session"
import { ROUTES } from "@/config/site"

const adminNav = [
  { href: ROUTES.admin.root, label: "Overview", icon: LayoutDashboard },
  { href: ROUTES.admin.users, label: "Users", icon: Users },
  { href: ROUTES.admin.predictions, label: "Predictions", icon: Target },
  { href: ROUTES.admin.payments, label: "Payments", icon: CreditCard },
  { href: ROUTES.admin.withdrawals, label: "Withdrawals", icon: ArrowDownToLine },
  { href: ROUTES.admin.verifications, label: "Verifications", icon: BadgeCheck },
  { href: ROUTES.admin.reports, label: "Reports", icon: Flag },
  { href: ROUTES.admin.settings, label: "Settings", icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminPage()

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-sidebar p-4 text-sidebar-foreground lg:block">
        <div className="mb-6 px-2">
          <Logo />
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
            Admin
          </p>
        </div>
        <nav className="space-y-1">
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex gap-2 overflow-x-auto border-b border-border p-3 lg:hidden">
          {adminNav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium"
            >
              {label}
            </Link>
          ))}
        </div>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
