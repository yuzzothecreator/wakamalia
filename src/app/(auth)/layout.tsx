import { Logo } from "@/components/shared/logo"
import { APP_TAGLINE } from "@/config/site"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#ecf8f5] px-4 py-12 dark:bg-[#0a1412]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(13,148,136,0.12),_transparent_55%)]"
      />
      <div className="relative z-10 mb-8 text-center">
        <Logo className="justify-center" />
        <p className="mt-3 max-w-sm text-sm text-muted-foreground text-pretty">
          {APP_TAGLINE}
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  )
}
