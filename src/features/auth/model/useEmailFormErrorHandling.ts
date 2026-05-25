import { isApiErrorMatching, getServerErrorMessage } from "@/common/utils/api/error"
import { useCallback } from "react"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

type Params<TFormValues extends FieldValues> = {
  setError: UseFormSetError<TFormValues>
  emailFieldName?: Path<TFormValues>
  message?: string
}

export const useEmailFormErrorHandling = <TFormValues extends FieldValues>({
  setError,
  emailFieldName,
  message,
}: Params<TFormValues>) => {
  return useCallback(
    (error: unknown) => {
      if (isApiErrorMatching(error, { status: 404, code: "NOT_FOUND" })) {
        setError(emailFieldName ?? ("email" as Path<TFormValues>), {
          type: "server",
          message: message || getServerErrorMessage(error.data),
        })

        return true
      }

      return false
    },
    [emailFieldName, setError, message],
  )
}
