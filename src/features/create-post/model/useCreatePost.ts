"use client"

import { useCallback, useState } from "react"
import { useStepNavigation } from "./useStepNavigation"
import { usePhotos } from "./usePhotos"

export type { Step } from "./useStepNavigation"

export function useCreatePost() {
  const {
    step,
    goBack: navGoBack,
    goNext,
    goToCropping,
    goToPublication,
    goBackToFilters,
    resetStep,
  } = useStepNavigation()

  const [isGalleryPanelOpen, setIsGalleryPanelOpen] = useState(false)

  const {
    photos,
    selectedImages,
    croppedImages,
    selectedFilters,
    selectFiles: baseSelectFiles,
    addMoreFiles,
    removeImage: baseRemoveImage,
    setCroppedImage,
    setFilter,
    resetCroppedImages,
    clearPhotos,
  } = usePhotos({
    onLastPhotoRemoved: () => {
      navGoBack()
      setIsGalleryPanelOpen(false)
    },
  })

  const selectFiles = useCallback(
    async (files: File[]) => {
      await baseSelectFiles(files)
      goToCropping()
      setIsGalleryPanelOpen(false)
    },
    [baseSelectFiles, goToCropping],
  )

  const goBack = useCallback(() => {
    clearPhotos()
    navGoBack()
    setIsGalleryPanelOpen(false)
  }, [clearPhotos, navGoBack])

  const reset = useCallback(() => {
    clearPhotos()
    resetStep()
    setIsGalleryPanelOpen(false)
  }, [clearPhotos, resetStep])

  const toggleGalleryPanel = useCallback(() => {
    setIsGalleryPanelOpen((prev) => !prev)
  }, [])

  return {
    step,
    photos,
    selectedImages,
    croppedImages,
    selectedFilters,
    isGalleryPanelOpen,
    selectFiles,
    addMoreFiles,
    removeImage: baseRemoveImage,
    setCroppedImage,
    setFilter,
    toggleGalleryPanel,
    goBack,
    goNext,
    goToPublication,
    goToCropping,
    goBackToFilters,
    resetCroppedImages,
    reset,
  }
}
