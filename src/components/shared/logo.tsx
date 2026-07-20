import Link from "next/link"
import { APP_NAME } from "@/config/site"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
        W
      </span>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          {APP_NAME}
        </span>
      )}
    </Link>
  )
}
