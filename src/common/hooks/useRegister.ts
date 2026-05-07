import { useMutation } from "@tanstack/react-query"
import { RegisterRequest } from "@/features/auth/api/authApi.types"
import { authService } from "@/features/auth/api/authApi"

export function useRegister() {
  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data, variables) => {
      // Р—РґРµСЃСЊ РјРѕР¶РЅРѕ РґРѕР±Р°РІРёС‚СЊ Р»РѕРіРёСЂРѕРІР°РЅРёРµ РёР»Рё РґСЂСѓРіРёРµ РРµР№СЃС‚РІРёСЏ РїСЂРё СѓСЃРїРµС…Рµ
      console.log("Registration successful for:", variables.email)
    },
    onError: (error: any) => {
      // Р¦РµРЅС‚СЂР°Р»РёР·РѕРІР°РЅРЅР°СЏ РѕР±СЂР°Р±РѕС‚РєР° РѕС€РёР±РѕРє
      console.error("Registration error:", error)
    },
  })

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  }
}
