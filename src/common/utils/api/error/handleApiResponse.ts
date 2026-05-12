import { ApiError } from "./apiError"

type ApiResult<TData, TError> = {
  data?: TData
  error?: TError
  response: Response
}

/**
 * Handles a response returned by openapi-fetch.
 *
 * If the response contains an API error, it throws ApiError so TanStack Query
 * can catch it in global and local onError handlers.
 *
 * If the response is successful, it returns response data.
 */
export const handleApiResponse = <TData, TError>(
  result: ApiResult<TData, TError>,
  message?: string,
): TData | undefined => {
  const { data, error, response } = result

  if (error) {
    throw new ApiError(response.status, error, message)
  }

  return data
}
