"use client"

import { useState, useCallback } from "react"
import { validateFiles } from "./useFileValidation"
import { useBlobUrls } from "./useBlobUrls"
import { useStepNavigation } from "./useStepNavigation"

export type { Step } from "./useStepNavigation"

export function useCreatePost() {
  const { createBlobUrl, revokeBlobUrl, trackBlobUrl, revokeAllBlobUrls } = useBlobUrls()
  const {
    step,
    goBack: navGoBack,
    goNext,
    goToCropping,
    goBackToCropping,
    goBackToFilters,
    resetStep,
  } = useStepNavigation()

  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [croppedImages, setCroppedImages] = useState<(string | null)[]>([])
  const [selectedFilters, setSelectedFilters] = useState<(string | null)[]>([])
  const [isGalleryPanelOpen, setIsGalleryPanelOpen] = useState(false)

  const selectFiles = useCallback(
    (files: FileList) => {
      if (!validateFiles(files)) return

      revokeAllBlobUrls()

      const urls = Array.from(files).map(createBlobUrl)
      setSelectedImages(urls)
      setCroppedImages([])
      setSelectedFilters([])
      goToCropping()
      setIsGalleryPanelOpen(false)
    },
    [createBlobUrl, revokeAllBlobUrls, goToCropping],
  )

  const addMoreFiles = useCallback(
    (files: FileList) => {
      if (!validateFiles(files)) return

      const newUrls = Array.from(files).map(createBlobUrl)
      setSelectedImages((prev) => [...prev, ...newUrls])
      setCroppedImages((prev) => [...prev, ...newUrls.map(() => null)])
      setSelectedFilters((prev) => [...prev, ...newUrls.map(() => null)])
    },
    [createBlobUrl],
  )

  const removeImage = useCallback(
    (index: number) => {
      const urlToRemove = selectedImages[index]
      revokeBlobUrl(urlToRemove)

      const croppedUrl = croppedImages[index]
      if (croppedUrl) revokeBlobUrl(croppedUrl)

      setSelectedImages((prev) => prev.filter((_, i) => i !== index))
      setCroppedImages((prev) => prev.filter((_, i) => i !== index))
      setSelectedFilters((prev) => prev.filter((_, i) => i !== index))

      if (selectedImages.length === 1) {
        navGoBack()
        setIsGalleryPanelOpen(false)
      }
    },
    [selectedImages, croppedImages, revokeBlobUrl, navGoBack],
  )

  const replaceImage = useCallback(
    (index: number, newUrl: string) => {
      const oldUrl = selectedImages[index]
      revokeBlobUrl(oldUrl)
      trackBlobUrl(newUrl)
      setSelectedImages((prev) => {
        const updated = [...prev]
        updated[index] = newUrl
        return updated
      })
    },
    [selectedImages, revokeBlobUrl, trackBlobUrl],
  )

  const setCroppedImage = useCallback(
    (index: number, url: string) => {
      setCroppedImages((prev) => {
        const oldUrl = prev[index]
        if (oldUrl) revokeBlobUrl(oldUrl)
        trackBlobUrl(url)
        const updated = [...prev]
        updated[index] = url
        return updated
      })
    },
    [revokeBlobUrl, trackBlobUrl],
  )

  const setFilter = useCallback((index: number, filterId: string) => {
    setSelectedFilters((prev) => {
      const updated = [...prev]
      updated[index] = filterId
      return updated
    })
  }, [])

  const toggleGalleryPanel = useCallback(() => {
    setIsGalleryPanelOpen((prev) => !prev)
  }, [])

  const goBack = useCallback(() => {
    revokeAllBlobUrls()
    setSelectedImages([])
    setCroppedImages([])
    setSelectedFilters([])
    navGoBack()
    setIsGalleryPanelOpen(false)
  }, [revokeAllBlobUrls, navGoBack])

  const resetCroppedImages = useCallback(() => {
    croppedImages.forEach((url) => {
      if (url) revokeBlobUrl(url)
    })
    setCroppedImages(croppedImages.map(() => null))
  }, [croppedImages, revokeBlobUrl])

  const reset = useCallback(() => {
    revokeAllBlobUrls()
    setSelectedImages([])
    setCroppedImages([])
    setSelectedFilters([])
    resetStep()
    setIsGalleryPanelOpen(false)
  }, [revokeAllBlobUrls, resetStep])

  return {
    step,
    selectedImages,
    croppedImages,
    selectedFilters,
    isGalleryPanelOpen,
    selectFiles,
    addMoreFiles,
    removeImage,
    replaceImage,
    setCroppedImage,
    setFilter,
    toggleGalleryPanel,
    goBack,
    goNext,
    goBackToCropping,
    goBackToFilters,
    resetCroppedImages,
    reset,
  }
}
