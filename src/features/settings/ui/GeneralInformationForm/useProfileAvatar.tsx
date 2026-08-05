"use client"

import { useState, useCallback } from "react"
import type { UseFormSetValue, UseFormWatch } from "react-hook-form"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"
import { AvatarUploadModal, useAvatarUpload } from "../AvatarUploadModal"

type Props = {
  setValueAction: UseFormSetValue<ProfileSettingsFormData>
  watch: UseFormWatch<ProfileSettingsFormData>
  initialAvatarUrl: string | null
}

export const useProfileAvatar = ({ setValueAction, watch, initialAvatarUrl }: Props) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleAvatarSave = useCallback(
    (blobUrl: string) => {
      setValueAction("avatarUrl", blobUrl, { shouldValidate: true })
    },
    [setValueAction],
  )

  const handleDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false)
    setValueAction("avatarUrl", null, { shouldValidate: true })
  }, [setValueAction])

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
