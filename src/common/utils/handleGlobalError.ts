import { getApiErrorMessage } from "./api/error/getApiErrorMessage"
import { isApiServerError, type ServerErrorCode } from "./api/error/serverError"
import { showErrorToast } from "./toast/showToast"

/**
 * Rule that describes which API error should be handled silently.
 *
 * If the current error matches this rule, the global toast will not be shown.
 *
 * Example:
 * `{ status: 404, code: "NOT_FOUND" }`
 */
export type SilentErrorRule = {
  /**
   * HTTP status code returned by the server.
   *
   * If omitted, any status will match.
   */
  status?: number

  /**
   * Backend error code from `error.data.error`.
   *
   * If omitted, any backend error code will match.
   */
  code?: ServerErrorCode
}

/**
 * Additional options for global error handling.
 *
 * Can be passed through TanStack Query `meta`.
 */
export type GlobalErrorMeta = {
  /**
   * List of errors that should not trigger the global toast.
   *
   * Useful for form errors that are handled locally through `setError`.
   */
  silentErrors?: SilentErrorRule[]
}

/**
 * Checks whether the current error should be silent.
 *
 * Silent errors do not show a global toast, but they are still available
 * in local `onError` handlers of `useQuery` / `useMutation`.
 */
const isSilentError = (error: unknown, silentErrors?: SilentErrorRule[]): boolean => {
  if (!silentErrors?.length || !isApiServerError(error)) {
    return false
  }

  return silentErrors.some((rule) => {
    const statusMatch = rule.status === undefined || rule.status === error.status
    const codeMatch = rule.code === undefined || rule.code === error.data.error

    return statusMatch && codeMatch
  })
}

/**
 * Global error handler for TanStack Query.
 *
 * Intended to be used inside `QueryCache.onError` and `MutationCache.onError`.
 *
 * Responsibilities:
 * - skips errors listed in `meta.silentErrors`;
 * - converts known API errors to user-friendly messages;
 * - handles regular JavaScript errors;
 * - falls back to a common error message for unknown errors.
 *
 * Local component `onError` handlers will still receive the same error.
 */
export const handleGlobalError = (error: unknown, meta?: GlobalErrorMeta) => {
  if (isSilentError(error, meta?.silentErrors)) {
    return
  }

  if (isApiServerError(error)) {
    showErrorToast(getApiErrorMessage(error))

    return
  }

  if (error instanceof Error) {
    showErrorToast(error.message || "Something went wrong")

    return
  }

  showErrorToast("Something went wrong")
}
