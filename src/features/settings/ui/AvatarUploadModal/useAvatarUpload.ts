"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { Area } from "react-easy-crop"
import { toast } from "sonner"
import { useFileInput } from "@/common/hooks/useFileInput"
import { loadImage, renderCropToBlobUrl } from "./cropUtils"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png"])
const VALIDATION_MESSAGE = "The photo must be less than 10 Mb and have JPEG or PNG format"

type Step = "upload" | "crop"

export const useAvatarUpload = (onSave: (blobUrl: string) => void) => {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>("upload")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const croppedAreaRef = useRef<Area | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const validateFile = useCallback((file: File): boolean => {
    if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
      toast.error(VALIDATION_MESSAGE)
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
      setZoom(1)
      croppedAreaRef.current = null
    },
    [validateFile],
  )

  const { fileInputRef, triggerFileInput, handleFileChange } = useFileInput({
    onFilesSelected: handleFilesSelected,
  })

  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      croppedAreaRef.current = croppedAreaPixels
    },
    [],
  )

  const handleSave = useCallback(async () => {
    if (!previewUrl || !croppedAreaRef.current) return

    setIsSaving(true)
    try {
      const img = await loadImage(previewUrl)
      const croppedBlobUrl = await renderCropToBlobUrl(img, croppedAreaRef.current)
      if (croppedBlobUrl) {
        onSave(croppedBlobUrl)
        setIsOpen(false)
        setStep("upload")
        setPreviewUrl(null)
        setZoom(1)
        croppedAreaRef.current = null
      }
    } catch {
      toast.error("Failed to process the image")
    } finally {
      setIsSaving(false)
    }
  }, [previewUrl, onSave])

  const cleanup = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setStep("upload")
    setZoom(1)
    croppedAreaRef.current = null
  }, [previewUrl])

  const requestClose = useCallback(() => {
    if (step === "crop") {
      setShowCloseConfirm(true)
    } else {
      cleanup()
      setIsOpen(false)
    }
  }, [step, cleanup])

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
    zoom,
    isSaving,
    showCloseConfirm,
    fileInputRef,
    setZoom,
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
