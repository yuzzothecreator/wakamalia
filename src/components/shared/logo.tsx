import Link from "next/link"
import { APP_NAME } from "@/config/site"
import { cn } from "@/lib/utils"

/** Stadium-arch W with gold winning-strike bolt */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={cn("size-full", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="wk-teal" x1="8" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14967f" />
          <stop offset="1" stopColor="#0b5f58" />
        </linearGradient>
        <linearGradient id="wk-gold" x1="28" y1="12" x2="50" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5d06a" />
          <stop offset="1" stopColor="#d4a017" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="16" fill="url(#wk-teal)" />

      {/* Soft inner stadium glow */}
      <ellipse cx="32" cy="38" rx="22" ry="14" fill="#062e2b" opacity="0.28" />

      {/* Twin stadium arches forming W */}
      <path
        d="M11 46
           C11 28 18 14 25.5 14
           C29.5 14 31.5 20 32 26
           C32.5 20 34.5 14 38.5 14
           C46 14 53 28 53 46"
        stroke="#f7fbf8"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner arch echo */}
      <path
        d="M17 44
           C17 31 22 20 25.8 20
           C28.8 20 30.8 25 32 30
           C33.2 25 35.2 20 38.2 20
           C42 20 47 31 47 44"
        stroke="#f7fbf8"
        strokeWidth="2"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />

      {/* Gold winning lightning slash */}
      <path
        d="M38 12 L30 30 L35.5 30 L27 50 L42 26 L35.5 26 Z"
        fill="url(#wk-gold)"
      />

      {/* Spark at tip */}
      <g fill="#f5d06a">
        <path d="M43.5 14.5 L45.2 18.8 L49.5 20.5 L45.2 22.2 L43.5 26.5 L41.8 22.2 L37.5 20.5 L41.8 18.8 Z" />
        <circle cx="48.5" cy="12" r="1.4" />
        <circle cx="51" cy="17.5" r="1" />
      </g>
    </svg>
  )
}

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
          "inline-flex shrink-0 overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105",
          mark
        )}
      >
        <LogoMark />
      </span>
      {showText && (
        <span className={cn("font-bold tracking-tight text-current", text)}>
          {APP_NAME}
        </span>
      )}
    </Link>
  )
}
