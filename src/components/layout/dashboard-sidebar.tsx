"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Settings,
  Users,
  Wallet,
  DollarSign,
  ArrowDownToLine,
  Shield,
} from "lucide-react"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config/site"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"

const mainNav = [
  { href: ROUTES.dashboard.tipster, label: "Overview", icon: LayoutDashboard },
  { href: ROUTES.dashboard.create, label: "New prediction", icon: PlusCircle },
  { href: ROUTES.dashboard.analytics, label: "Analytics", icon: BarChart3 },
  { href: ROUTES.dashboard.subscribers, label: "Subscribers", icon: Users },
  { href: ROUTES.dashboard.earnings, label: "Earnings", icon: DollarSign },
  { href: ROUTES.dashboard.withdrawals, label: "Withdrawals", icon: ArrowDownToLine },
]

const secondaryNav = [
  { href: ROUTES.wallet, label: "Wallet", icon: Wallet },
  { href: ROUTES.messages, label: "Messages", icon: MessageSquare },
  { href: ROUTES.notifications, label: "Notifications", icon: Bell },
  { href: ROUTES.settings, label: "Settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen } =
    useUIStore()

  const NavLink = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }) => {
    const active =
      pathname === href ||
      (href !== ROUTES.dashboard.tipster && pathname.startsWith(href))

    return (
      <Link
        href={href}
        onClick={() => setSidebarOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-primary/20 text-primary-foreground"
            : "text-teal-100/80 hover:bg-white/10 hover:text-white"
        )}
      >
        <Icon className="size-4 shrink-0" />
        {!sidebarCollapsed && <span>{label}</span>}
      </Link>
    )
  }

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0d3d38] text-white transition-all duration-300 lg:static lg:z-auto",
          sidebarCollapsed ? "w-[72px]" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          {!sidebarCollapsed ? (
            <Logo className="text-white [&_span:last-child]:text-white" />
          ) : (
            <span className="mx-auto flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold">
              W
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-teal-100 hover:bg-white/10 hover:text-white lg:flex"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p
            className={cn(
              "mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-teal-200/50",
              sidebarCollapsed && "sr-only"
            )}
          >
            Creator
          </p>
          {mainNav.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}

          <div className="my-4 border-t border-white/10" />

          <p
            className={cn(
              "mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-teal-200/50",
              sidebarCollapsed && "sr-only"
            )}
          >
            Account
          </p>
          {secondaryNav.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href={ROUTES.admin.root}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-teal-100/70 hover:bg-white/10 hover:text-white"
          >
            <Shield className="size-4" />
            {!sidebarCollapsed && <span>Admin</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}

export function DashboardMobileHeader() {
  const { setSidebarOpen } = useUIStore()

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <LayoutDashboard className="size-5" />
      </Button>
      <Logo showText={false} />
      <span className="font-semibold">Dashboard</span>
    </header>
  )
}
