import { isApiError } from "./apiError"

const RETRY_AFTER_HEADER = "Retry-After"

/**
 * Gets retry delay in seconds from the Retry-After response header.
 *
 * Supports both formats:
 * - seconds: Retry-After: 10
 * - HTTP date: Retry-After: Wed, 21 Oct 2026 07:28:00 GMT
 */
export const getRetryAfterSeconds = (error: unknown): number | undefined => {
  if (!isApiError(error)) {
    return undefined
  }

  const retryAfter = error.response?.headers.get(RETRY_AFTER_HEADER)

  if (!retryAfter) {
    return undefined
  }

  const seconds = Number(retryAfter)

  if (Number.isFinite(seconds)) {
    return Math.max(Math.ceil(seconds), 0)
  }

  const retryDate = Date.parse(retryAfter)

  if (!Number.isNaN(retryDate)) {
    return Math.max(Math.ceil((retryDate - Date.now()) / 1000), 0)
  }

  return undefined
}
