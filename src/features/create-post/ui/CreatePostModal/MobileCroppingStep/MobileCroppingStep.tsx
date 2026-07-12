import { useCallback, useRef, useState } from "react"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { useFileInput } from "@/common/hooks/useFileInput"
import { useFloatingPanels } from "../CroppingStep/hooks/useFloatingPanels"
import { useCropping } from "../CroppingStep/hooks/useCropping"
import { useZoom } from "../CroppingStep/hooks/useZoom"
import { useClickOutside } from "../CroppingStep/hooks/useClickOutside"
import { FILTER_PRESETS } from "../FiltersStep/filters"
import { MAX_PHOTOS } from "@/features/create-post/model/useFileValidation"
import { CropOptionsPanel } from "../CroppingStep/CropOptionsPanel/CropOptionsPanel"
import { MiniGallery } from "../CroppingStep/MiniGallery/MiniGallery"
import { CroppingToolbar } from "../CroppingStep/CroppingToolbar/CroppingToolbar"
import { MobileCroppingHeader } from "./MobileCroppingHeader"
import { MediaPreviewSlider } from "./MediaPreviewSlider"
import { FilterSelectorSlider } from "./FilterSelectorSlider"
import type { CreatePostPhoto } from "@/features/create-post/model/createPost.types"
import s from "./MobileCroppingStep.module.css"

type MobileCroppingStepProps = {
  photos: CreatePostPhoto[]
  selectedImages: string[]
  croppedImages: (string | null)[]
  selectedFilters: (string | null)[]
  onBack: () => void
  onNext: () => void
  onCropImage: (index: number, url: string) => void
  setFilter: (index: number, filterId: string) => void
  addMoreFiles: (files: File[]) => void
  removeImage: (index: number) => void
}

export const MobileCroppingStep = ({
  photos,
  selectedImages,
  croppedImages,
  selectedFilters,
  onBack,
  onNext,
  onCropImage,
  setFilter,
  addMoreFiles,
  removeImage,
}: MobileCroppingStepProps) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const { activeIndex, goToSlide } = useCarousel(selectedImages.length)

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
  const activeFilterId = selectedFilters[activeIndex] ?? "normal"
  const activeFilterValue = FILTER_PRESETS.find((f) => f.id === activeFilterId)?.value ?? "none"
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

  return (
    <div className={s.step}>
      <MobileCroppingHeader onBack={handleBack} onNext={handleNext} isNextDisabled={isProcessing} />

      <div className={s.content}>
        <div className={s.imageArea} ref={imageAreaRef}>
          {isMultiple ? (
            <div
              className={s.sliderContainer}
              onMouseDown={handleImageAreaMouseDown}
              onTouchStart={handleImageAreaMouseDown}
            >
              <MediaPreviewSlider
                images={selectedImages}
                filters={selectedFilters}
                aspectRatio={aspectRatio}
                onSlideChange={goToSlide}
              />
            </div>
          ) : (
            <div
              className={s.zoomContainer}
              style={{ transform: `scale(${zoomLevel})` }}
              onMouseDown={handleImageAreaMouseDown}
              onTouchStart={handleImageAreaMouseDown}
            >
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={handleCropComplete}
                aspect={aspectRatio ?? undefined}
                className={s.cropWrapper}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
                <img
                  src={currentImage}
                  alt={`Photo ${activeIndex + 1} of ${selectedImages.length}`}
                  className={s.image}
                  style={{ filter: activeFilterValue }}
                  onLoad={handleImageLoad}
                />
              </ReactCrop>
            </div>
          )}

          <CroppingToolbar
            ref={toolbarRef}
            isGalleryOpen={isGalleryPanelOpen}
            isCropOptionsOpen={isCropOptionsOpen}
            onToggleGallery={toggleGallery}
            onToggleCropOptions={toggleCropOptions}
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
        </div>

        <MiniGallery
          ref={galleryRef}
          images={selectedImages}
          activeIndex={activeIndex}
          onSelectSlide={goToSlide}
          onRemoveImage={removeImage}
          onAddClick={triggerFileInput}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          isAtLimit={isAtLimit}
          currentCount={selectedImages.length}
          isOpen={isGalleryPanelOpen}
        />

        <FilterSelectorSlider
          filters={FILTER_PRESETS}
          activeFilterId={activeFilterId}
          previewImage={currentImage}
          onSelect={(filterId) => setFilter(activeIndex, filterId)}
        />
      </div>
    </div>
  )
}
