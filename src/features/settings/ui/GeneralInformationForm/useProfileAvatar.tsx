"use client"

import { useState, useCallback } from "react"
import type { UseFormSetValue, UseFormWatch } from "react-hook-form"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"
import { AvatarUploadModal, useAvatarUpload } from "../AvatarUploadModal"

type Props = {
  setValue: UseFormSetValue<ProfileSettingsFormData>
  watch: UseFormWatch<ProfileSettingsFormData>
  initialAvatarUrl: string | null
}

export const useProfileAvatar = ({ setValue, watch, initialAvatarUrl }: Props) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleAvatarSave = useCallback(
    (blobUrl: string) => {
      setValue("avatarUrl", blobUrl, { shouldValidate: true })
    },
    [setValue],
  )

  const handleDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false)
    setValue("avatarUrl", null, { shouldValidate: true })
  }, [setValue])

  const avatarHook = useAvatarUpload(handleAvatarSave)

  const currentAvatarUrl = watch("avatarUrl")
  const displayAvatarUrl = currentAvatarUrl ?? initialAvatarUrl
  const hasAvatar = Boolean(displayAvatarUrl)

  return {
    displayAvatarUrl,
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
