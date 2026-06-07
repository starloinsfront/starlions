"use client"

import { useState, useCallback, useEffect, useRef } from "react"

export type Step = "upload" | "cropping"

type CreatePostState = {
  step: Step
  // Array of blob URLs for all selected images
  selectedImages: string[]
  // Whether the mini-gallery preview panel is open
  isGalleryPanelOpen: boolean
}

type CreatePostActions = {
  // Add files from initial upload (transitions to cropping step)
  selectFiles: (files: FileList) => void
  // Add more files to existing gallery (stays on cropping step)
  addMoreFiles: (files: FileList) => void
  // Remove image at given index
  removeImage: (index: number) => void
  // Toggle mini-gallery panel visibility
  toggleGalleryPanel: () => void
  // Step navigation
  goBack: () => void
  goNext: () => void
  // Reset all state
  reset: () => void
}

export function useCreatePost(): CreatePostState & CreatePostActions {
  const [step, setStep] = useState<Step>("upload")
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isGalleryPanelOpen, setIsGalleryPanelOpen] = useState(false)

  // Ref to track all blob URLs for cleanup on unmount
  const blobUrlsRef = useRef<Set<string>>(new Set())

  // Revoke all blob URLs on unmount
  useEffect(() => {
    const urls = blobUrlsRef.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  // Create blob URL and track it
  const createBlobUrl = useCallback((file: File): string => {
    const url = URL.createObjectURL(file)
    blobUrlsRef.current.add(url)
    return url
  }, [])

  // Revoke a single blob URL
  const revokeBlobUrl = useCallback((url: string) => {
    URL.revokeObjectURL(url)
    blobUrlsRef.current.delete(url)
  }, [])

  // Initial file selection — transitions to cropping step
  const selectFiles = useCallback(
    (files: FileList) => {
      // Revoke any existing URLs
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      blobUrlsRef.current.clear()

      // Create new blob URLs
      const urls = Array.from(files).map(createBlobUrl)
      setSelectedImages(urls)
      setStep("cropping")
      setIsGalleryPanelOpen(false)
    },
    [createBlobUrl],
  )

  // Add more files to existing gallery
  const addMoreFiles = useCallback(
    (files: FileList) => {
      const newUrls = Array.from(files).map(createBlobUrl)
      setSelectedImages((prev) => [...prev, ...newUrls])
    },
    [createBlobUrl],
  )

  // Remove image at given index
  const removeImage = useCallback(
    (index: number) => {
      const urlToRemove = selectedImages[index]
      revokeBlobUrl(urlToRemove)

      setSelectedImages((prev) => prev.filter((_, i) => i !== index))

      // If no images left, go back to upload step
      if (selectedImages.length === 1) {
        setStep("upload")
        setIsGalleryPanelOpen(false)
      }
    },
    [selectedImages, revokeBlobUrl],
  )

  // Toggle gallery panel
  const toggleGalleryPanel = useCallback(() => {
    setIsGalleryPanelOpen((prev) => !prev)
  }, [])

  // Go back to upload step
  const goBack = useCallback(() => {
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    blobUrlsRef.current.clear()
    setSelectedImages([])
    setStep("upload")
    setIsGalleryPanelOpen(false)
  }, [])

  const goNext = useCallback(() => {
    // TODO: transition to next step (e.g. filters → publish)
  }, [])

  // Reset all state
  const reset = useCallback(() => {
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    blobUrlsRef.current.clear()
    setSelectedImages([])
    setStep("upload")
    setIsGalleryPanelOpen(false)
  }, [])

  return {
    step,
    selectedImages,
    isGalleryPanelOpen,
    selectFiles,
    addMoreFiles,
    removeImage,
    toggleGalleryPanel,
    goBack,
    goNext,
    reset,
  }
}
