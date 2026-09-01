import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  presignAvatar,
  uploadAvatarToPresignedUrl,
  confirmAvatarUpload,
  removeAvatar,
} from "./apiProfileSettings"
import { PROFILE_SETTINGS_QUERY_KEY } from "./useProfileSettingsQuery"
import type { ProfileSettingsDto } from "./apiProfileSettings"

export const useAvatarUploadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const { imageId, uploadUrl } = await presignAvatar(file)
      await uploadAvatarToPresignedUrl(uploadUrl, file)
      return confirmAvatarUpload(imageId)
    },

    onSuccess: (avatarUrl) => {
      queryClient.setQueryData(PROFILE_SETTINGS_QUERY_KEY, (old: ProfileSettingsDto | undefined) =>
        old ? { ...old, avatarUrl } : old,
      )
      toast.success("Avatar updated")
    },

    onError: () => {
      toast.error("Failed to upload avatar")
    },
  })
}

export const useAvatarRemoveMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => removeAvatar(),

    onSuccess: () => {
      queryClient.setQueryData(PROFILE_SETTINGS_QUERY_KEY, (old: ProfileSettingsDto | undefined) =>
        old ? { ...old, avatarUrl: null } : old,
      )
      toast.success("Avatar removed")
    },

    onError: () => {
      toast.error("Failed to remove avatar")
    },
  })
}
