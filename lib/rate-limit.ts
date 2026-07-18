// Simple client-side rate limiter for login attempts
// Stores attempts in localStorage to prevent abuse

const STORAGE_KEY = "hasanlib_login_attempts"
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

type AttemptRecord = {
  count: number
  firstAttempt: number
}

export function checkRateLimit(): { allowed: boolean; remaining: number; resetInMs: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const now = Date.now()

    let record: AttemptRecord = raw
      ? JSON.parse(raw)
      : { count: 0, firstAttempt: now }

    // Reset if window has expired
    if (now - record.firstAttempt > WINDOW_MS) {
      record = { count: 0, firstAttempt: now }
    }

    const remaining = Math.max(0, MAX_ATTEMPTS - record.count)
    const resetInMs = Math.max(0, WINDOW_MS - (now - record.firstAttempt))

    return {
      allowed: record.count < MAX_ATTEMPTS,
      remaining,
      resetInMs,
    }
  } catch {
    return { allowed: true, remaining: MAX_ATTEMPTS, resetInMs: 0 }
  }
}

export function recordAttempt(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const now = Date.now()

    let record: AttemptRecord = raw
      ? JSON.parse(raw)
      : { count: 0, firstAttempt: now }

    if (now - record.firstAttempt > WINDOW_MS) {
      record = { count: 1, firstAttempt: now }
    } else {
      record.count++
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // localStorage not available
  }
}

export function resetRateLimit(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage not available
  }
}

export function getRateLimitTimeRemaining(): string {
  const { allowed, resetInMs } = checkRateLimit()
  if (allowed) return ""

  const minutes = Math.ceil(resetInMs / 60000)
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m`
  }
  return `${minutes}m`
}
