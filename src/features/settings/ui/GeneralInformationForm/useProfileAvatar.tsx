"use client"

import { useState, useCallback } from "react"
import type { UseFormSetValue, UseFormWatch } from "react-hook-form"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"
import { AvatarUploadModal, useAvatarUpload } from "../AvatarUploadModal"
import { useAvatarUploadMutation, useAvatarRemoveMutation } from "../../api/useAvatarUploadApi"

type Props = {
  setValueAction: UseFormSetValue<ProfileSettingsFormData>
  watch: UseFormWatch<ProfileSettingsFormData>
  initialAvatarUrl: string | null
}

export const useProfileAvatar = ({ setValueAction, watch, initialAvatarUrl }: Props) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const uploadMutation = useAvatarUploadMutation()
  const removeMutation = useAvatarRemoveMutation()

  const handleAvatarSave = useCallback(
    (file: File) => {
      uploadMutation.mutate(file, {
        onSuccess: (avatarUrl) => {
          setValueAction("avatarUrl", avatarUrl, { shouldValidate: true })
        },
      })
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
  const displayAvatarUrl = currentAvatarUrl ?? initialAvatarUrl
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
