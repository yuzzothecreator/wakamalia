"use client"

import { useCountdown } from "@/hooks/use-countdown"

export function CountdownDisplay({
  kickoff,
}: {
  kickoff: string | Date
}) {
  const { formatted, isExpired } = useCountdown(kickoff)

  if (isExpired) {
    return <span className="font-medium text-foreground">Started</span>
  }

  return (
    <span className="font-mono font-medium text-primary">{formatted}</span>
  )
}
