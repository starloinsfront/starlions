"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { Area, Point } from "react-easy-crop"
import { toast } from "sonner"
import { useFileInput } from "@/common/hooks/useFileInput"
import { getAvatarFileValidationError } from "../../model/avatarFile"
import { loadImage, renderCropToFile } from "./cropUtils"

type Step = "upload" | "crop"

export const useAvatarUpload = (onSave: (file: File) => Promise<boolean>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>("upload")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cropPosition, setCropPosition] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const croppedAreaRef = useRef<Area | null>(null)
  const [isCropReady, setIsCropReady] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const validateFile = useCallback((file: File): boolean => {
    const validationError = getAvatarFileValidationError(file)

    if (validationError) {
      toast.error(validationError)
      return false
    }
    return true
  }, [])

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      const file = files[0]
      if (!file || !validateFile(file)) return

      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setStep("crop")
      setCropPosition({ x: 0, y: 0 })
      setZoom(1)
      croppedAreaRef.current = null
      setIsCropReady(false)
    },
    [validateFile],
  )

  const { fileInputRef, triggerFileInput, handleFileChange } = useFileInput({
    onFilesSelected: handleFilesSelected,
  })

  const handleCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    croppedAreaRef.current = croppedAreaPixels
    setIsCropReady(true)
  }, [])

  const cleanup = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setStep("upload")
    setCropPosition({ x: 0, y: 0 })
    setZoom(1)
    croppedAreaRef.current = null
    setIsCropReady(false)
  }, [previewUrl])

  const handleSave = useCallback(async () => {
    if (!previewUrl || !croppedAreaRef.current) return

    setIsSaving(true)
    try {
      const img = await loadImage(previewUrl)
      const croppedFile = await renderCropToFile(img, croppedAreaRef.current)
      const validationError = getAvatarFileValidationError(croppedFile)

      if (validationError) {
        toast.error(validationError)
        return
      }

      const wasSaved = await onSave(croppedFile)

      if (wasSaved) {
        cleanup()
        setIsOpen(false)
      }
    } catch {
      toast.error("Failed to process the image")
    } finally {
      setIsSaving(false)
    }
  }, [cleanup, onSave, previewUrl])

  const requestClose = useCallback(() => {
    if (isSaving) {
      return
    }

    if (step === "crop") {
      setShowCloseConfirm(true)
    } else {
      cleanup()
      setIsOpen(false)
    }
  }, [cleanup, isSaving, step])

  const confirmClose = useCallback(() => {
    setShowCloseConfirm(false)
    cleanup()
    setIsOpen(false)
  }, [cleanup])

  const cancelClose = useCallback(() => {
    setShowCloseConfirm(false)
  }, [])

  const handleBack = useCallback(() => {
    cleanup()
    setStep("upload")
  }, [cleanup])

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return {
    isOpen,
    step,
    previewUrl,
    cropPosition,
    zoom,
    isSaving,
    isCropReady,
    showCloseConfirm,
    fileInputRef,
    setZoom,
    setCropPosition,
    openModal,
    requestClose,
    confirmClose,
    cancelClose,
    handleBack,
    handleSave,
    handleCropComplete,
    triggerFileInput,
    handleFileChange,
  }
}
