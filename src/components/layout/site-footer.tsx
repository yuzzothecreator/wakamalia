import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { APP_NAME, ROUTES } from "@/config/site"

const footerLinks = {
  Product: [
    { href: ROUTES.explore, label: "Explore" },
    { href: ROUTES.leaderboard, label: "Leaderboard" },
    { href: ROUTES.pricing, label: "Pricing" },
    { href: "/features", label: "Features" },
  ],
  Creators: [
    { href: ROUTES.dashboard.become, label: "Become a Tipster" },
    { href: ROUTES.dashboard.tipster, label: "Creator Dashboard" },
    { href: "/referral", label: "Referral Program" },
    { href: "/affiliates", label: "Affiliates" },
  ],
  Company: [
    { href: ROUTES.blog, label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/responsible-gaming", label: "Responsible Gaming" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
              The trusted marketplace where sports tipsters build audiences,
              prove performance, and monetize predictions with transparency.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold">{title}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Bet responsibly. 18+ only. Predictions are not financial advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
