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
  const { isPending: isUploading, mutateAsync: uploadAvatar } = useAvatarUploadMutation()
  const { isPending: isRemoving, mutate: removeAvatar } = useAvatarRemoveMutation()
  const isAvatarBusy = isUploading || isRemoving

  const handleAvatarSave = useCallback(
    async (file: File) => {
      try {
        const avatarUrl = await uploadAvatar(file)
        setValueAction("avatarUrl", avatarUrl, { shouldValidate: true })

        return true
      } catch {
        return false
      }
    },
    [setValueAction, uploadAvatar],
  )

  const handleDeleteConfirm = useCallback(() => {
    if (isAvatarBusy) {
      return
    }

    setShowDeleteConfirm(false)
    removeAvatar(undefined, {
      onSuccess: () => {
        setValueAction("avatarUrl", null, { shouldValidate: true })
      },
    })
  }, [isAvatarBusy, removeAvatar, setValueAction])

  const avatarHook = useAvatarUpload(handleAvatarSave)

  const currentAvatarUrl = watch("avatarUrl")
  const displayAvatarUrl = currentAvatarUrl
  const hasAvatar = Boolean(displayAvatarUrl?.trim())
  const { openModal } = avatarHook

  const openUploadModal = useCallback(() => {
    if (!isAvatarBusy) {
      openModal()
    }
  }, [isAvatarBusy, openModal])

  const requestDelete = useCallback(() => {
    if (hasAvatar && !isAvatarBusy) {
      setShowDeleteConfirm(true)
    }
  }, [hasAvatar, isAvatarBusy])

  return {
    displayAvatarUrl,
    isAvatarBusy,
    avatarUploadModal: <AvatarUploadModal hook={avatarHook} />,
    openUploadModal,
    requestDelete: hasAvatar ? requestDelete : undefined,
    deleteConfirmProps: {
      isOpen: showDeleteConfirm,
      onClose: () => setShowDeleteConfirm(false),
      onConfirm: () => setShowDeleteConfirm(false),
      onDiscard: handleDeleteConfirm,
    },
  }
}
