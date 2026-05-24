import { isApiError, type ApiError } from "./apiError"

export type ServerErrorCode =
  | "BAD_REQUEST"
  | "EMAIL_ALREADY_EXISTS"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "UNAUTHORIZED"
  | "TOO_MANY_REQUESTS"
  | "INVALID_RECOVERY_CODE"
  | (string & {})

export type ServerErrorExtension = {
  field: string
  message: string
}

export type ServerError = {
  statusCode: number
  error: ServerErrorCode
  message?: string
  extensions?: ServerErrorExtension[]
  timestamp?: string
}

/**
 * Checks that unknown error data has the expected backend error shape.
 */
export function isServerError(error: unknown): error is ServerError {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "error" in error &&
    typeof (error as { statusCode: unknown }).statusCode === "number" &&
    typeof (error as { error: unknown }).error === "string"
  )
}

/**
 * Checks that an unknown error is an ApiError with backend error data.
 */
export function isApiServerError(error: unknown): error is ApiError<ServerError> {
  return isApiError(error) && isServerError(error.data)
}

/**
 * Checks that an unknown error matches a specific HTTP status and/or backend error code.
 */
export function isApiErrorMatching<TCode extends ServerErrorCode>(
  error: unknown,
  params: {
    status?: number
    code?: TCode
  },
): error is ApiError<ServerError & { error: TCode }> {
  if (!isApiServerError(error)) {
    return false
  }

  const isStatusMatch = params.status === undefined || error.status === params.status
  const isCodeMatch = params.code === undefined || error.data.error === params.code

  return isStatusMatch && isCodeMatch
}

/**
 * Returns a single user-friendly error message from backend error data.
 */
export function getServerErrorMessage(error: unknown): string {
  if (!isServerError(error)) {
    return "Something went wrong"
  }

  if (error.message) {
    return error.message
  }

  if (error.extensions?.length) {
    return error.extensions[0]?.message ?? "Server error"
  }

  return error.error
}

/**
 * Returns all user-friendly error messages from backend error data.
 */
export function getServerErrorMessages(error: unknown): string[] {
  if (!isServerError(error)) {
    return ["Something went wrong"]
  }

  if (error.extensions?.length) {
    return error.extensions.map(({ message }) => message)
  }

  if (error.message) {
    return [error.message]
  }

  return [error.error]
}
