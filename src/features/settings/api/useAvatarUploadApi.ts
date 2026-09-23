import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  presignAvatar,
  uploadAvatarToPresignedUrl,
  confirmAvatarUpload,
  removeAvatar,
} from "./apiProfileSettings"
import { setAvatarInProfileCaches } from "./profileCache"

class AvatarUploadStageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AvatarUploadStageError"
  }
}

const runUploadStage = async <T>(action: () => Promise<T>, errorMessage: string): Promise<T> => {
  try {
    return await action()
  } catch {
    throw new AvatarUploadStageError(errorMessage)
  }
}

export const useAvatarUploadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const { imageId, uploadUrl } = await runUploadStage(
        () => presignAvatar(file),
        "Could not prepare the avatar upload",
      )
      await runUploadStage(
        () => uploadAvatarToPresignedUrl(uploadUrl, file),
        "Could not upload the avatar. Check your connection and try again",
      )

      return runUploadStage(
        () => confirmAvatarUpload(imageId),
        "The avatar was uploaded but could not be saved. Try again",
      )
    },

    onSuccess: (avatarUrl) => {
      setAvatarInProfileCaches(queryClient, avatarUrl)
      toast.success("Avatar updated")
    },

    onError: (error) => {
      toast.error(
        error instanceof AvatarUploadStageError ? error.message : "Failed to upload avatar",
      )
    },
  })
}

export const useAvatarRemoveMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => removeAvatar(),

    onSuccess: () => {
      setAvatarInProfileCaches(queryClient, null)
      toast.success("Avatar removed")
    },

    onError: () => {
      toast.error("Failed to remove avatar")
    },
  })
}
