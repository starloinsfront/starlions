"use client"

import { useState, useCallback } from "react"
import type { UseFormSetValue, UseFormWatch } from "react-hook-form"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"
import { AvatarUploadModal, useAvatarUpload } from "../AvatarUploadModal"
import { useAvatarUploadMutation, useAvatarRemoveMutation } from "../../api/useAvatarUploadApi"

type Props = {
  setValueAction: UseFormSetValue<ProfileSettingsFormData>
  watch: UseFormWatch<ProfileSettingsFormData>
}

export const useProfileAvatar = ({ setValueAction, watch }: Props) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const uploadMutation = useAvatarUploadMutation()
  const removeMutation = useAvatarRemoveMutation()

  const handleAvatarSave = useCallback(
    async (file: File) => {
      try {
        const avatarUrl = await uploadMutation.mutateAsync(file)
        setValueAction("avatarUrl", avatarUrl, { shouldValidate: true })

        return true
      } catch {
        return false
      }
    },
    [uploadMutation, setValueAction],
  )

  const handleDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false)
    removeMutation.mutate(undefined, {
      onSuccess: () => {
        setValueAction("avatarUrl", null, { shouldValidate: true })
      },
    })
  }, [removeMutation, setValueAction])

  const avatarHook = useAvatarUpload(handleAvatarSave)

  const currentAvatarUrl = watch("avatarUrl")
  const displayAvatarUrl = currentAvatarUrl
  const hasAvatar = Boolean(displayAvatarUrl)

  return {
    displayAvatarUrl,
    isUploading: uploadMutation.isPending,
    avatarUploadModal: <AvatarUploadModal hook={avatarHook} />,
    openUploadModal: avatarHook.openModal,
    requestDelete: hasAvatar ? () => setShowDeleteConfirm(true) : undefined,
    deleteConfirmProps: {
      isOpen: showDeleteConfirm,
      onClose: () => setShowDeleteConfirm(false),
      onConfirm: () => setShowDeleteConfirm(false),
      onDiscard: handleDeleteConfirm,
    },
  }
}
