import { useCallback, useRef, useState } from "react"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { CroppingStepHeader } from "./CroppingStepHeader/CroppingStepHeader"
import { CarouselNavigation } from "../CarouselNavigation/CarouselNavigation"
import { CroppingToolbar } from "./CroppingToolbar/CroppingToolbar"
import { MiniGallery } from "./MiniGallery/MiniGallery"
import { CropOptionsPanel } from "./CropOptionsPanel/CropOptionsPanel"
import { useFileInput } from "@/common/hooks/useFileInput"
import { useCropping } from "./hooks/useCropping"
import { useZoom } from "./hooks/useZoom"
import { useFloatingPanels } from "./hooks/useFloatingPanels"
import { useClickOutside } from "./hooks/useClickOutside"
import { MAX_PHOTOS } from "@/features/create-post/model/useFileValidation"
import styles from "./CroppingStep.module.css"
import type { CroppingStepProps } from "./CroppingStep.types"

export const CroppingStep = ({
  photos,
  selectedImages,
  croppedImages,
  onBack,
  onNext,
  onCropImage,
  onAddMoreFiles,
  onRemoveImage,
}: CroppingStepProps) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const { activeIndex, goToSlide, showNext, showPrev } = useCarousel(selectedImages.length)
  const { fileInputRef, triggerFileInput, handleFileChange } = useFileInput({
    onFilesSelected: onAddMoreFiles,
  })

  const {
    zoomLevel,
    minZoom,
    maxZoom,
    zoomStep,
    handleZoomChange,
  } = useZoom(activeIndex)

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

  const cropOptionsRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const imageAreaRef = useRef<HTMLDivElement>(null)

  useClickOutside(cropOptionsRef, isCropOptionsOpen, closeAll)
  useClickOutside(toolbarRef, isSliderVisible, closeAll)
  useClickOutside(galleryRef, isGalleryPanelOpen, closeAll)

  const currentImageUrl = selectedImages[activeIndex]
  const isAtLimit = selectedImages.length >= MAX_PHOTOS

  const handleToggleCrop = useCallback(() => {
    toggleCropOptions()
  }, [toggleCropOptions])

  const handleImageAreaMouseDown = useCallback(() => {
    closeAll()
  }, [closeAll])

  const handleNext = useCallback(async () => {
    setIsProcessing(true)
    try {
      // First confirm the active image crop (if one is in progress)
      const currentCropUrl = await handleConfirmCrop()

      // Create updated croppedImages with the current photo's crop result
      const updatedCroppedImages = [...croppedImages]
      if (currentCropUrl) {
        updatedCroppedImages[activeIndex] = currentCropUrl
      }

      // Then batch-crop any remaining uncropped images
      const results = await cropAllImages(photos, updatedCroppedImages)

      // Persist all new cropped URLs into parent state
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

  return (
    <div className={styles.step}>
      <CroppingStepHeader
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={isProcessing}
      />

      <div
        className={styles.imageArea}
        ref={imageAreaRef}
      >
        <div
          className={styles.zoomContainer}
          style={{ transform: `scale(${zoomLevel})` }}
          onMouseDown={handleImageAreaMouseDown}
          onTouchStart={handleImageAreaMouseDown}
        >
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={handleCropComplete}
            aspect={aspectRatio ?? undefined}
            className={styles.cropWrapper}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
            <img
              src={currentImageUrl}
              alt={`Photo ${activeIndex + 1} of ${selectedImages.length}`}
              className={styles.image}
              onLoad={handleImageLoad}
            />
          </ReactCrop>
        </div>

        <CarouselNavigation
          count={selectedImages.length}
          activeIndex={activeIndex}
          onPrev={showPrev}
          onNext={showNext}
          onGoToSlide={goToSlide}
        />

        <CroppingToolbar
          ref={toolbarRef}
          isGalleryOpen={isGalleryPanelOpen}
          isCropOptionsOpen={isCropOptionsOpen}
          onToggleGallery={toggleGallery}
          onToggleCropOptions={handleToggleCrop}
          zoomLevel={zoomLevel}
          isSliderVisible={isSliderVisible}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomStep={zoomStep}
          onToggleSlider={toggleSlider}
          onZoomChange={handleZoomChange}
        />

        <CropOptionsPanel
          ref={cropOptionsRef}
          selectedOptionId={selectedRatioId}
          onSelect={(option) => setAspectRatio(option.value)}
          isOpen={isCropOptionsOpen}
        />

        <MiniGallery
          ref={galleryRef}
          images={selectedImages}
          activeIndex={activeIndex}
          onSelectSlide={goToSlide}
          onRemoveImage={onRemoveImage}
          onAddClick={triggerFileInput}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          isAtLimit={isAtLimit}
          currentCount={selectedImages.length}
          isOpen={isGalleryPanelOpen}
        />
      </div>
    </div>
  )
}
