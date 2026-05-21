import { ApiError } from "./apiError"

type ApiResult<TData, TError> = {
  data?: TData
  error?: TError
  response: Response
}

/**
 * Converts an openapi-fetch result into a normal success/error flow.
 *
 * openapi-fetch returns `{ data, error, response }` instead of throwing
 * for HTTP errors. This helper throws ApiError when `error` exists,
 * so TanStack Query treats the request as failed.
 *
 * @param result Result returned from `client.GET`, `client.POST`, etc.
 * @param message Optional fallback message for ApiError.
 * @returns Successful response data, or undefined for endpoints without body.
 * @throws ApiError when the server returns an error response.
 */
export const handleApiResponse = <TData, TError>(
  result: ApiResult<TData, TError>,
  message?: string,
): TData | undefined => {
  const { data, error, response } = result

  if (error) {
    throw new ApiError(response.status, error, message, response)
  }

  return data
}
