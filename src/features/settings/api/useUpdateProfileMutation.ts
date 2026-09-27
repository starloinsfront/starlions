import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showSuccessToast, showErrorToast } from "@/common/utils/toast/showToast"
import { updateProfileSettings } from "./apiProfileSettings"
import { setProfileCaches } from "./profileCache"
import type { SchemaUpdateProfileInputDto } from "@/common/api/schema"

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SchemaUpdateProfileInputDto) => updateProfileSettings(data),

    onSuccess: (updatedProfile) => {
      setProfileCaches(queryClient, updatedProfile)
      showSuccessToast("Your settings are saved!")
    },

    onError: () => {
      showErrorToast("Error! Server is not available!")
    },
  })
}
