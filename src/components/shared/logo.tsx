import Image from "next/image"
import Link from "next/link"
import { APP_NAME } from "@/config/site"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  showText = true,
  size = "md",
}: {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}) {
  const mark = {
    sm: "size-7",
    md: "size-9",
    lg: "size-12",
  }[size]

  const text = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  }[size]

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 text-foreground",
        className
      )}
      aria-label={APP_NAME}
    >
      <span
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden rounded-2xl bg-accent shadow-md ring-1 ring-accent/30 transition-transform duration-300 group-hover:scale-105",
          mark
        )}
      >
        <Image
          src="/icons/logo.png"
          alt=""
          width={128}
          height={128}
          className="size-full object-cover"
          priority
        />
      </span>
      {showText && (
        <span className={cn("font-bold tracking-tight text-current", text)}>
          {APP_NAME}
        </span>
      )}
    </Link>
  )
}
