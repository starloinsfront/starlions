"use client"

import { useState, useCallback, useEffect, useRef } from "react"

export type Step = "upload" | "cropping"

type CreatePostState = {
  step: Step
  selectedImages: string[]
  isGalleryPanelOpen: boolean
}

type CreatePostActions = {
  selectFiles: (files: FileList) => void
  addMoreFiles: (files: FileList) => void
  removeImage: (index: number) => void
  replaceImage: (index: number, newUrl: string) => void
  toggleGalleryPanel: () => void
  goBack: () => void
  goNext: () => void
  reset: () => void
}

export function useCreatePost(): CreatePostState & CreatePostActions {
  const [step, setStep] = useState<Step>("upload")
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isGalleryPanelOpen, setIsGalleryPanelOpen] = useState(false)

  const blobUrlsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const urls = blobUrlsRef.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const createBlobUrl = useCallback((file: File): string => {
    const url = URL.createObjectURL(file)
    blobUrlsRef.current.add(url)
    return url
  }, [])

  const revokeBlobUrl = useCallback((url: string) => {
    URL.revokeObjectURL(url)
    blobUrlsRef.current.delete(url)
  }, [])

  const selectFiles = useCallback(
    (files: FileList) => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      blobUrlsRef.current.clear()

      const urls = Array.from(files).map(createBlobUrl)
      setSelectedImages(urls)
      setStep("cropping")
      setIsGalleryPanelOpen(false)
    },
    [createBlobUrl],
  )

  const addMoreFiles = useCallback(
    (files: FileList) => {
      const newUrls = Array.from(files).map(createBlobUrl)
      setSelectedImages((prev) => [...prev, ...newUrls])
    },
    [createBlobUrl],
  )

  const removeImage = useCallback(
    (index: number) => {
      const urlToRemove = selectedImages[index]
      revokeBlobUrl(urlToRemove)

      setSelectedImages((prev) => prev.filter((_, i) => i !== index))

      if (selectedImages.length === 1) {
        setStep("upload")
        setIsGalleryPanelOpen(false)
      }
    },
    [selectedImages, revokeBlobUrl],
  )

  const replaceImage = useCallback(
    (index: number, newUrl: string) => {
      const oldUrl = selectedImages[index]
      revokeBlobUrl(oldUrl)
      blobUrlsRef.current.add(newUrl)
      setSelectedImages((prev) => {
        const updated = [...prev]
        updated[index] = newUrl
        return updated
      })
    },
    [selectedImages, revokeBlobUrl],
  )

  const toggleGalleryPanel = useCallback(() => {
    setIsGalleryPanelOpen((prev) => !prev)
  }, [])

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
    replaceImage,
    toggleGalleryPanel,
    goBack,
    goNext,
    reset,
  }
}
