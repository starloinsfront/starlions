import { useMutation } from "@tanstack/react-query"
import type { UseFormSetError } from "react-hook-form"

import { apiAuth } from "@/features/auth/api/apiAuth"
import { isApiErrorMatching, isApiServerError } from "@/common/utils/api/error/serverError"
import type { RegisterFormData } from "@/features/auth/model/register.schema"

const registrationFieldMap: Record<string, keyof RegisterFormData> = {
  username: "username",
  email: "email",
  password: "password",
  passwordConfirmation: "passwordConfirmation",
  isTermsAccepted: "isTermsAccepted",
}

const applyRegistrationMessageError = (
  message: string | undefined,
  setError?: UseFormSetError<RegisterFormData>,
) => {
  if (!message) {
    return false
  }

  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes("email")) {
    setError?.("email", {
      type: "server",
      message,
    })

    return true
  }

  if (
    normalizedMessage.includes("username") ||
    normalizedMessage.includes("user name") ||
    normalizedMessage.includes("login")
  ) {
    setError?.("username", {
      type: "server",
      message,
    })

    return true
  }

  if (normalizedMessage.includes("password confirmation") || normalizedMessage.includes("confirm")) {
    setError?.("passwordConfirmation", {
      type: "server",
      message,
    })

    return true
  }

  if (normalizedMessage.includes("password")) {
    setError?.("password", {
      type: "server",
      message,
    })

    return true
  }

  if (normalizedMessage.includes("terms") || normalizedMessage.includes("privacy")) {
    setError?.("isTermsAccepted", {
      type: "server",
      message,
    })

    return true
  }

  return false
}

export const useRegistration = (setError?: UseFormSetError<RegisterFormData>) => {
  return useMutation({
    mutationFn: apiAuth.registrationUser,

    meta: {
      silentErrors: [
        {
          status: 400,
          code: "BAD_REQUEST",
        },
        {
          status: 400,
          code: "VALIDATION_ERROR",
        },
      ],
    },

    onError: (error) => {
      if (!isApiServerError(error)) {
        setError?.("root", {
          type: "server",
          message: "Registration failed",
        })

        return
      }

      const extensions = error.data?.extensions

      if (extensions?.length) {
        let hasFieldError = false

        extensions.forEach(({ field, message }) => {
          const formField = registrationFieldMap[field]

          if (!formField) {
            return
          }

          hasFieldError = true
          setError?.(formField, {
            type: "server",
            message,
          })
        })

        if (hasFieldError) {
          return
        }
      }

      if (
        isApiErrorMatching(error, { status: 400, code: "BAD_REQUEST" }) ||
        isApiErrorMatching(error, { status: 400, code: "VALIDATION_ERROR" })
      ) {
        if (applyRegistrationMessageError(error.data.message, setError)) {
          return
        }
      }

      setError?.("root", {
        type: "server",
        message: error.data?.message ?? "Registration failed",
      })
    },
  })
}
