type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()

export function rateLimit(
  key: string,
  { windowMs, max }: { windowMs: number; max: number }
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { success: true, remaining: max - 1, resetAt }
  }

  if (entry.count >= max) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count += 1
  store.set(key, entry)
  return { success: true, remaining: max - entry.count, resetAt: entry.resetAt }
}

// Periodic cleanup to avoid unbounded growth in long-lived processes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) store.delete(key)
    }
  }, 60_000).unref?.()
}
