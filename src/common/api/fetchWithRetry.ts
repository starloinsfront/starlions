const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504])
const RETRY_DELAYS_MS = [250, 750] as const
const SAFE_METHODS = new Set(["GET", "HEAD"])

const wait = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

const getRequestMethod = (input: RequestInfo | URL, init?: RequestInit) => {
  if (init?.method) {
    return init.method.toUpperCase()
  }

  return input instanceof Request ? input.method.toUpperCase() : "GET"
}

const isAbortError = (error: unknown) => {
  return error instanceof DOMException && error.name === "AbortError"
}

const getRequestUrlForLog = (input: RequestInfo | URL) => {
  const rawUrl = input instanceof Request ? input.url : input.toString()

  try {
    const url = new URL(rawUrl)

    // Do not put query parameters (which may contain private data) into logs.
    return `${url.origin}${url.pathname}`
  } catch {
    return rawUrl.split("?")[0]
  }
}

const getErrorCode = (error: unknown) => {
  if (!(error instanceof Error) || !("cause" in error)) {
    return undefined
  }

  const cause = error.cause

  if (typeof cause !== "object" || cause === null || !("code" in cause)) {
    return undefined
  }

  return typeof cause.code === "string" ? cause.code : undefined
}

const requestWithRetry = async (
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  attempt: number,
  maxAttempts: number,
): Promise<Response> => {
  try {
    const response = await fetch(input, init)

    if (attempt < maxAttempts && RETRYABLE_STATUSES.has(response.status)) {
      await response.body?.cancel()
      await wait(RETRY_DELAYS_MS[attempt - 1] ?? RETRY_DELAYS_MS.at(-1)!)

      return requestWithRetry(input, init, attempt + 1, maxAttempts)
    }

    return response
  } catch (error) {
    if (attempt >= maxAttempts || isAbortError(error)) {
      console.error("[api-fetch] Request failed", {
        attempt,
        code: getErrorCode(error),
        error,
        method: getRequestMethod(input, init),
        url: getRequestUrlForLog(input),
      })

      throw error
    }

    await wait(RETRY_DELAYS_MS[attempt - 1] ?? RETRY_DELAYS_MS.at(-1)!)

    return requestWithRetry(input, init, attempt + 1, maxAttempts)
  }
}

export const fetchWithRetry: typeof fetch = (input, init) => {
  const method = getRequestMethod(input, init)
  const maxAttempts = SAFE_METHODS.has(method) ? 3 : 1

  return requestWithRetry(input, init, 1, maxAttempts)
}
