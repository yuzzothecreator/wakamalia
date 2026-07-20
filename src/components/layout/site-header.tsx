"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, Bell, X } from "lucide-react"
import { useState } from "react"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { ROUTES } from "@/config/site"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: ROUTES.explore, label: "Explore" },
  { href: ROUTES.leaderboard, label: "Leaderboard" },
  { href: ROUTES.pricing, label: "Pricing" },
  { href: ROUTES.blog, label: "Blog" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
            <Link href={ROUTES.search} aria-label="Search">
              <Search className="size-4" />
            </Link>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
            <Link href={ROUTES.notifications} aria-label="Notifications">
              <Bell className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href={ROUTES.login}>Log in</Link>
          </Button>
          <Button size="sm" asChild className="hidden sm:inline-flex">
            <Link href={ROUTES.register}>Get started</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={ROUTES.login}>Log in</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href={ROUTES.register}>Get started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
