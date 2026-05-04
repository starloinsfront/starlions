import { useMutation } from "@tanstack/react-query"
import { authService } from "@/features/auth/api/authApi"
import { ApiError } from "@/features/auth/api/authApi.types"

export function useConfirmRegistration() {
  const mutation = useMutation<void, ApiError, string>({
    mutationFn: (code: string) => authService.confirmRegistration({ code }),
    onSuccess: () => {
      console.log("Email confirmed successfully")
    },
    onError: (error) => {
      console.error("Confirmation failed:", error)

      if (error?.status === 400) {
        console.error("Code expired or invalid")
      } else if (error?.status === 404) {
        console.error("User not found")
      }
    },
  })

  return {
    confirm: mutation.mutate,
    confirmAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  }
}
