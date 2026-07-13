import { useCallback, useRef, useState } from "react"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { useFileInput } from "@/common/hooks/useFileInput"
import { useCropping } from "./useCropping"
import { useZoom } from "./useZoom"
import { useFloatingPanels } from "./useFloatingPanels"
import { useClickOutside } from "./useClickOutside"
import { MAX_PHOTOS } from "@/features/create-post/model/useFileValidation"
import type { CreatePostPhoto } from "@/features/create-post/model/createPost.types"

type UseCroppingStepProps = {
  photos: CreatePostPhoto[]
  selectedImages: string[]
  croppedImages: (string | null)[]
  onBack: () => void
  onNext: () => void
  onCropImage: (index: number, url: string) => void
  addMoreFiles: (files: File[]) => void
  removeImage: (index: number) => void
}

export const useCroppingStep = ({
  photos,
  selectedImages,
  croppedImages,
  onBack,
  onNext,
  onCropImage,
  addMoreFiles,
  removeImage,
}: UseCroppingStepProps) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const { activeIndex, goToSlide, showNext, showPrev } = useCarousel(selectedImages.length)

  const {
    isCropOptionsOpen,
    isSliderVisible,
    isGalleryPanelOpen,
    toggleCropOptions,
    toggleSlider,
    toggleGallery,
    closeAll,
  } = useFloatingPanels()

  const {
    zoomLevel,
    minZoom,
    maxZoom,
    zoomStep,
    handleZoomChange,
  } = useZoom(activeIndex)

  const {
    aspectRatio,
    crop,
    selectedRatioId,
    setAspectRatio,
    setCrop,
    handleImageLoad,
    handleCropComplete,
    handleConfirmCrop,
    cropAllImages,
    resetCrop,
  } = useCropping(photos, activeIndex, {
    isCropOptionsOpen,
    closeCropOptions: closeAll,
  })

  const { fileInputRef, triggerFileInput, handleFileChange } = useFileInput({
    onFilesSelected: addMoreFiles,
  })

  const cropOptionsRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const imageAreaRef = useRef<HTMLDivElement>(null)

  useClickOutside(cropOptionsRef, isCropOptionsOpen, closeAll)
  useClickOutside(toolbarRef, isSliderVisible, closeAll)
  useClickOutside(galleryRef, isGalleryPanelOpen, closeAll)

  const currentImage = selectedImages[activeIndex]
  const isAtLimit = selectedImages.length >= MAX_PHOTOS
  const isMultiple = selectedImages.length > 1

  const handleNext = useCallback(async () => {
    setIsProcessing(true)
    try {
      const currentCropUrl = await handleConfirmCrop()

      const updatedCroppedImages = [...croppedImages]
      if (currentCropUrl) {
        updatedCroppedImages[activeIndex] = currentCropUrl
      }

      const results = await cropAllImages(photos, updatedCroppedImages)

      results.forEach((url, i) => {
        if (url && url !== croppedImages[i]) {
          onCropImage(i, url)
        }
      })

      onNext()
    } finally {
      setIsProcessing(false)
    }
  }, [
    handleConfirmCrop,
    cropAllImages,
    activeIndex,
    photos,
    croppedImages,
    onCropImage,
    onNext,
  ])

  const handleBack = useCallback(() => {
    resetCrop()
    onBack()
  }, [resetCrop, onBack])

  const handleImageAreaMouseDown = useCallback(() => {
    closeAll()
  }, [closeAll])

  return {
    activeIndex,
    goToSlide,
    showNext,
    showPrev,
    isCropOptionsOpen,
    isSliderVisible,
    isGalleryPanelOpen,
    toggleCropOptions,
    toggleSlider,
    toggleGallery,
    closeAll,
    zoomLevel,
    minZoom,
    maxZoom,
    zoomStep,
    handleZoomChange,
    aspectRatio,
    crop,
    selectedRatioId,
    setAspectRatio,
    setCrop,
    handleImageLoad,
    handleCropComplete,
    fileInputRef,
    triggerFileInput,
    handleFileChange,
    cropOptionsRef,
    toolbarRef,
    galleryRef,
    imageAreaRef,
    currentImage,
    isAtLimit,
    isMultiple,
    isProcessing,
    handleNext,
    handleBack,
    handleImageAreaMouseDown,
    removeImage,
  }
}
