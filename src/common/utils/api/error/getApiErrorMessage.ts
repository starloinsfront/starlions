import { getServerErrorMessage, getServerErrorMessages, isApiServerError } from "./serverError"
import { type ToastMessage } from "./types"

/**
 * Returns a user-friendly message for an API error.
 *
 * Handles errors by HTTP status and backend error code.
 * For unknown API errors returns a safe fallback message.
 */
export const getApiErrorMessage = (error: unknown): ToastMessage => {
  if (!isApiServerError(error)) {
    return "Something went wrong"
  }

  const status = error.status
  const code = error.data.error

  switch (status) {
    case 400: {
      switch (code) {
        case "VALIDATION_ERROR":
          return "Incorrect data"
        // || getServerErrorMessages(error.data)
        case "BAD_REQUEST":
          return getServerErrorMessage(error.data) || "Bad request"

        default:
          return getServerErrorMessage(error.data) || "Bad request"
      }
    }

    case 401: {
      switch (code) {
        case "INVALID_CREDENTIALS":
          return getServerErrorMessage(error.data) || "Invalid email or password"

        case "UNAUTHORIZED":
          return getServerErrorMessage(error.data) || "Unauthorized"

        default:
          return getServerErrorMessage(error.data) || "Unauthorized"
      }
    }

    case 403: {
      return getServerErrorMessage(error.data) || "Forbidden"
    }

    case 404: {
      switch (code) {
        case "NOT_FOUND":
          return getServerErrorMessage(error.data) || "Not found"

        default:
          return getServerErrorMessage(error.data) || "Resource not found"
      }
    }

    // case 409: {
    //   return getServerErrorMessage(error.data) || "Conflict error"
    // }
    case 422: {
      return getServerErrorMessage(error.data) || "Link expired"
    }
    case 429: {
      return "Too many requests. Please try again later"
      // getServerErrorMessages(error.data) ||
    }

    default: {
      if (status >= 500 && status < 600) {
        return "Server error occurred. Please try again later"
      }

      return getServerErrorMessage(error.data) || "Something went wrong"
    }
  }
}
