import { useCallback, useMemo, useRef, useState } from "react"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { useFileInput } from "@/common/hooks/useFileInput"
import { useCropping } from "../CroppingStep/hooks/useCropping"
import { useZoom } from "../CroppingStep/hooks/useZoom"
import { useFloatingPanels } from "../CroppingStep/hooks/useFloatingPanels"
import { useClickOutside } from "../CroppingStep/hooks/useClickOutside"
import { MAX_PHOTOS } from "@/features/create-post/model/useFileValidation"
import { FILTER_PRESETS } from "../FiltersStep/filters"
import { CropOptionsPanel } from "../CroppingStep/CropOptionsPanel/CropOptionsPanel"
import { MiniGallery } from "../CroppingStep/MiniGallery/MiniGallery"
import { CarouselNavigation } from "../CarouselNavigation/CarouselNavigation"
import { FilterSelectorSlider } from "./FilterSelectorSlider"
import { MobileCroppingHeader } from "./MobileCroppingHeader"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./MobileCroppingStep.module.css"
import type { CreatePostPhoto } from "@/features/create-post/model/createPost.types"

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

  const { activeIndex, goToSlide, showNext, showPrev } = useCarousel(selectedImages.length)
  const { fileInputRef, triggerFileInput, handleFileChange } = useFileInput({
    onFilesSelected: addMoreFiles,
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
    isGalleryPanelOpen,
    toggleCropOptions,
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
  const galleryRef = useRef<HTMLDivElement>(null)
  const imageAreaRef = useRef<HTMLDivElement>(null)

  useClickOutside(cropOptionsRef, isCropOptionsOpen, closeAll)
  useClickOutside(galleryRef, isGalleryPanelOpen, closeAll)

  const currentImageUrl = selectedImages[activeIndex]
  const isAtLimit = selectedImages.length >= MAX_PHOTOS
  const activeFilterId = selectedFilters[activeIndex] ?? "normal"

  const handleImageAreaClick = useCallback(() => {
    closeAll()
  }, [closeAll])

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

  return (
    <div className={s.step}>
      <MobileCroppingHeader onBack={handleBack} onNext={handleNext} />

      <div className={s.content}>
        <div
          className={s.imageArea}
          ref={imageAreaRef}
        >
          <div
            className={s.zoomContainer}
            style={{ transform: `scale(${zoomLevel})` }}
            onClick={handleImageAreaClick}
            onTouchStart={handleImageAreaClick}
          >
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={handleCropComplete}
              aspect={aspectRatio ?? undefined}
              className={s.cropWrapper}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- blob URL */}
              <img
                src={currentImageUrl}
                alt={`Photo ${activeIndex + 1}`}
                className={s.image}
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

          <div className={s.toolbar}>
            <button
              className={`${s.toolbarButton} ${isCropOptionsOpen ? s.toolbarButtonActive : ""}`}
              type="button"
              aria-label="Crop options"
              onClick={toggleCropOptions}
            >
              <Icon name="expandOutline" width={24} height={24} />
            </button>
            <button
              className={`${s.toolbarButton} ${isGalleryPanelOpen ? s.toolbarButtonActive : ""}`}
              type="button"
              aria-label="Gallery"
              onClick={toggleGallery}
            >
              <Icon name="imageOutline" width={24} height={24} />
            </button>
          </div>

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
            onRemoveImage={removeImage}
            onAddClick={triggerFileInput}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            isAtLimit={isAtLimit}
            currentCount={selectedImages.length}
            isOpen={isGalleryPanelOpen}
          />
        </div>

        <div className={s.filters}>
          <FilterSelectorSlider
            filters={FILTER_PRESETS}
            activeFilterId={activeFilterId}
            previewImage={currentImageUrl}
            onSelect={(filterId) => setFilter(activeIndex, filterId)}
          />
        </div>
      </div>
    </div>
  )
}
