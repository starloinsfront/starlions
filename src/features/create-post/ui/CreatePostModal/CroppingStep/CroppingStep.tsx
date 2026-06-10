import { useCallback } from "react"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { CroppingStepHeader } from "./CroppingStepHeader/CroppingStepHeader"
import { CarouselNavigation } from "./CarouselNavigation/CarouselNavigation"
import { CroppingToolbar } from "./CroppingToolbar/CroppingToolbar"
import { MiniGallery } from "./MiniGallery/MiniGallery"
import { CropOptionsPanel } from "./CropOptionsPanel/CropOptionsPanel"
import { useFileInput } from "@/common/hooks/useFileInput"
import { useCropping } from "./hooks/useCropping"
import styles from "./CroppingStep.module.css"
import type { CroppingStepProps } from "./CroppingStep.types"

export const CroppingStep = ({
  selectedImages,
  isGalleryPanelOpen,
  onBack,
  onNext,
  onToggleGallery,
  onReplaceImage,
  onAddMoreFiles,
  onRemoveImage,
}: CroppingStepProps) => {

  const { activeIndex, goToSlide, showNext, showPrev } = useCarousel(selectedImages.length)
  const { fileInputRef, triggerFileInput, handleFileChange } = useFileInput({
    onFilesSelected: onAddMoreFiles,
  })

  const {
    isCropOptionsOpen,
    aspectRatio,
    crop,
    selectedRatioId,
    toggleCropOptions,
    closeCropOptions,
    setAspectRatio,
    setCrop,
    handleImageLoad,
    handleCropComplete,
    handleConfirmCrop,
    resetCrop,
  } = useCropping({ onCropConfirm: (url, index) => onReplaceImage(index, url) })

  const currentImageUrl = selectedImages[activeIndex]

  const handleToggleGallery = useCallback(() => {
    closeCropOptions()
    onToggleGallery()
  }, [closeCropOptions, onToggleGallery])

  const handleToggleCrop = useCallback(() => {
    if (isGalleryPanelOpen) {
      // Close gallery first (handled by toggleGalleryPanel closing gallery)
    }
    toggleCropOptions()
  }, [isGalleryPanelOpen, toggleCropOptions])

  const handleNext = useCallback(async () => {
    await handleConfirmCrop(activeIndex)
    onNext()
  }, [handleConfirmCrop, activeIndex, onNext])

  const handleBack = useCallback(() => {
    resetCrop()
    onBack()
  }, [resetCrop, onBack])

  return (
    <div className={styles.step}>
      <CroppingStepHeader onBack={handleBack} onNext={handleNext} />

      <div className={styles.imageArea}>
        <ReactCrop
          crop={crop}
          locked={true}
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

        <CarouselNavigation
          count={selectedImages.length}
          activeIndex={activeIndex}
          onPrev={showPrev}
          onNext={showNext}
          onGoToSlide={goToSlide}
        />

        <CroppingToolbar
          isGalleryOpen={isGalleryPanelOpen}
          isCropOptionsOpen={isCropOptionsOpen}
          onToggleGallery={handleToggleGallery}
          onToggleCropOptions={handleToggleCrop}
        />

        {isCropOptionsOpen && (
          <CropOptionsPanel
            selectedOptionId={selectedRatioId}
            onSelect={(option) => setAspectRatio(option.value)}
          />
        )}

        {isGalleryPanelOpen && (
          <MiniGallery
            images={selectedImages}
            activeIndex={activeIndex}
            onSelectSlide={goToSlide}
            onRemoveImage={onRemoveImage}
            onAddClick={triggerFileInput}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />
        )}
      </div>
    </div>
  )
}
