import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showSuccessToast, showErrorToast } from "@/common/utils/toast/showToast"
import { updateProfileSettings } from "./apiProfileSettings"
import { PROFILE_SETTINGS_QUERY_KEY } from "./useProfileSettingsQuery"
import type { ProfileSettingsFormData } from "../model/profile-settings.schema"

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProfileSettingsFormData) => updateProfileSettings(data),

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(PROFILE_SETTINGS_QUERY_KEY, updatedProfile)
      showSuccessToast("Your settings are saved!")
    },

    onError: () => {
      showErrorToast("Server is not available!")
    },
  })
}
