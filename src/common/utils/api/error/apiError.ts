export class ApiError<TData = unknown> extends Error {
  status: number
  data: TData
  response?: Response

  /**
   * Creates a normalized API error.
   *
   * Used to wrap server errors returned by openapi-fetch into a real Error
   * instance, so TanStack Query can catch it in onError handlers.
   *
   * @param status HTTP status code returned by the server.
   * @param data Original error response body.
   * @param message Optional fallback error message.
   * @param response Original fetch Response object.
   */
  constructor(status: number, data: TData, message = "API request failed", response?: Response) {
    super(message)

    this.name = "ApiError"
    this.status = status
    this.data = data
    this.response = response
  }
}

/**
 * Checks whether an unknown error is an ApiError.
 *
 * Useful in TanStack Query onError handlers before reading
 * `status`, `data` or `response`.
 */
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError
}
