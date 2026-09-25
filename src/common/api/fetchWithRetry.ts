const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504])
const RETRY_DELAY_MS = 200
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

const requestWithRetry = async (
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  attemptsLeft: number,
): Promise<Response> => {
  try {
    const response = await fetch(input, init)

    if (attemptsLeft > 1 && RETRYABLE_STATUSES.has(response.status)) {
      await response.body?.cancel()
      await wait(RETRY_DELAY_MS)

      return requestWithRetry(input, init, attemptsLeft - 1)
    }

    return response
  } catch (error) {
    if (attemptsLeft <= 1 || isAbortError(error)) {
      throw error
    }

    await wait(RETRY_DELAY_MS)

    return requestWithRetry(input, init, attemptsLeft - 1)
  }
}

export const fetchWithRetry: typeof fetch = (input, init) => {
  const method = getRequestMethod(input, init)
  const attempts = SAFE_METHODS.has(method) ? 2 : 1

  return requestWithRetry(input, init, attempts)
}
