"use client"

import { useState, useCallback, useMemo } from "react"
import { validateFiles } from "./useFileValidation"
import { useBlobUrls } from "./useBlobUrls"
import { useStepNavigation } from "./useStepNavigation"
import type { CreatePostPhoto } from "./createPost.types"

export type { Step } from "./useStepNavigation"

export function useCreatePost() {
  const { createBlobUrl, revokeBlobUrl, trackBlobUrl, revokeAllBlobUrls } = useBlobUrls()
  const {
    step,
    goBack: navGoBack,
    goNext,
    goToCropping,
    goToPublication,
    goBackToCropping,
    goBackToFilters,
    resetStep,
  } = useStepNavigation()

  const [photos, setPhotos] = useState<CreatePostPhoto[]>([])
  const [isGalleryPanelOpen, setIsGalleryPanelOpen] = useState(false)

  const selectedImages = useMemo(
    () => photos.map((photo) => photo.previewUrl),
    [photos],
  )

  const croppedImages = useMemo(
    () => photos.map((photo) => photo.croppedUrl),
    [photos],
  )

  const selectedFilters = useMemo(
    () => photos.map((photo) => photo.filterId),
    [photos],
  )

  const selectFiles = useCallback(
    async (files: File[]) => {
      if (!(await validateFiles(files, 0))) return

      revokeAllBlobUrls()

      const nextPhotos = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: createBlobUrl(file),
        croppedUrl: null,
        filterId: null,
      }))

      setPhotos(nextPhotos)
      goToCropping()
      setIsGalleryPanelOpen(false)
    },
    [createBlobUrl, revokeAllBlobUrls, goToCropping],
  )

  const addMoreFiles = useCallback(
    async (files: File[]) => {
      if (!(await validateFiles(files, photos.length))) return

      const nextPhotos = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: createBlobUrl(file),
        croppedUrl: null,
        filterId: null,
      }))

      setPhotos((prev) => [...prev, ...nextPhotos])
    },
    [createBlobUrl, photos.length],
  )

  const removeImage = useCallback(
    (index: number) => {
      const photoToRemove = photos[index]
      if (!photoToRemove) return

      revokeBlobUrl(photoToRemove.previewUrl)
      if (photoToRemove.croppedUrl) {
        revokeBlobUrl(photoToRemove.croppedUrl)
      }

      if (photos.length === 1) {
        navGoBack()
        setIsGalleryPanelOpen(false)
        return
      }

      setPhotos((prev) => prev.filter((_, i) => i !== index))
    },
    [photos, revokeBlobUrl, navGoBack],
  )

  const setCroppedImage = useCallback(
    (index: number, url: string) => {
      setPhotos((prev) => {
        const oldPhoto = prev[index]
        if (!oldPhoto) return prev

        if (oldPhoto?.croppedUrl) revokeBlobUrl(oldPhoto.croppedUrl)
        trackBlobUrl(url)
        const updated = [...prev]
        updated[index] = {
          ...oldPhoto,
          croppedUrl: url,
        }
        return updated
      })
    },
    [revokeBlobUrl, trackBlobUrl],
  )

  const setFilter = useCallback((index: number, filterId: string) => {
    setPhotos((prev) => {
      if (!prev[index]) return prev

      const updated = [...prev]
      updated[index] = {
        ...prev[index],
        filterId,
      }
      return updated
    })
  }, [])

  const toggleGalleryPanel = useCallback(() => {
    setIsGalleryPanelOpen((prev) => !prev)
  }, [])

  const goBack = useCallback(() => {
    revokeAllBlobUrls()
    setPhotos([])
    navGoBack()
    setIsGalleryPanelOpen(false)
  }, [revokeAllBlobUrls, navGoBack])

  const resetCroppedImages = useCallback(() => {
    setPhotos((prev) =>
      prev.map((photo) => {
        if (photo.croppedUrl) {
          revokeBlobUrl(photo.croppedUrl)
        }

        return {
          ...photo,
          croppedUrl: null,
        }
      }),
    )
  }, [revokeBlobUrl])

  const reset = useCallback(() => {
    revokeAllBlobUrls()
    setPhotos([])
    resetStep()
    setIsGalleryPanelOpen(false)
  }, [revokeAllBlobUrls, resetStep])

  return {
    step,
    photos,
    selectedImages,
    croppedImages,
    selectedFilters,
    isGalleryPanelOpen,
    selectFiles,
    addMoreFiles,
    removeImage,
    setCroppedImage,
    setFilter,
    toggleGalleryPanel,
    goBack,
    goNext,
    goToPublication,
    goBackToCropping,
    goBackToFilters,
    resetCroppedImages,
    reset,
  }
}
