"use client"

import { useEffect, useState } from "react"

interface CountdownResult {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
  isExpired: boolean
  formatted: string
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

export function useCountdown(target: string | Date | null | undefined): CountdownResult {
  const targetMs = target ? new Date(target).getTime() : 0

  const compute = (): CountdownResult => {
    const now = Date.now()
    const totalMs = Math.max(0, targetMs - now)
    const isExpired = totalMs <= 0

    const days = Math.floor(totalMs / 86400000)
    const hours = Math.floor((totalMs % 86400000) / 3600000)
    const minutes = Math.floor((totalMs % 3600000) / 60000)
    const seconds = Math.floor((totalMs % 60000) / 1000)

    let formatted = "00:00:00"
    if (days > 0) {
      formatted = `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    } else {
      formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    }

    return { days, hours, minutes, seconds, totalMs, isExpired, formatted }
  }

  const [state, setState] = useState<CountdownResult>(compute)

  useEffect(() => {
    if (!targetMs) return

    setState(compute())
    const id = setInterval(() => setState(compute()), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMs])

  return state
}
