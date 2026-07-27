import { useCallback, useMemo, useState } from "react"
import Cropper from "react-easy-crop"
import "react-easy-crop/react-easy-crop.css"
import { FILTER_PRESETS } from "../FiltersStep/filters"
import { CropOptionsPanel } from "../CroppingStep/CropOptionsPanel/CropOptionsPanel"
import { MiniGallery } from "../CroppingStep/MiniGallery/MiniGallery"
import { CroppingToolbar } from "../CroppingStep/CroppingToolbar/CroppingToolbar"
import { CroppingStepHeader } from "../CroppingStep/CroppingStepHeader/CroppingStepHeader"
import { useCroppingStep } from "../CroppingStep/hooks/useCroppingStep"
import { ConfirmationModal } from "@/common/components/ConfirmationModal/ConfirmationModal"
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
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false)

  const {
    activeIndex,
    goToSlide,
    isCropOptionsOpen,
    isSliderVisible,
    isGalleryPanelOpen,
    toggleCropOptions,
    toggleSlider,
    toggleGallery,
    zoom,
    setZoom,
    aspectRatio,
    cropPosition,
    selectedRatioId,
    setAspectRatio,
    handleCropChange,
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
    handleBack: baseHandleBack,
    handleImageAreaMouseDown,
  } = useCroppingStep({
    photos,
    selectedImages,
    croppedImages,
    onBack,
    onNext,
    onCropImage,
    addMoreFiles,
    removeImage,
  })

  const activeFilterId = selectedFilters[activeIndex] ?? "normal"
  const activeFilterValue = FILTER_PRESETS.find((f) => f.id === activeFilterId)?.value ?? "none"

  const hasChanges = useMemo(
    () =>
      croppedImages.some((url) => url !== null) ||
      selectedFilters.some((f) => f !== null && f !== "normal"),
    [croppedImages, selectedFilters],
  )

  const handleBack = useCallback(() => {
    if (hasChanges) {
      setIsDiscardDialogOpen(true)
      return
    }
    baseHandleBack()
  }, [hasChanges, baseHandleBack])

  const handleDiscard = useCallback(() => {
    setIsDiscardDialogOpen(false)
    baseHandleBack()
  }, [baseHandleBack])

  return (
    <div className={s.step}>
      <CroppingStepHeader onBack={handleBack} onNext={handleNext} isNextDisabled={isProcessing} variant="mobile" />

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
              className={s.cropperContainer}
              onMouseDown={handleImageAreaMouseDown}
              onTouchStart={handleImageAreaMouseDown}
            >
              <Cropper
                image={currentImage}
                crop={cropPosition}
                zoom={zoom}
                aspect={aspectRatio ?? 1}
                onCropChange={handleCropChange}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                cropShape="rect"
                showGrid={false}
                zoomSpeed={0.1}
                restrictPosition={false}
                style={{
                  containerStyle: { width: "100%", height: "100%" },
                }}
                mediaProps={{ style: { filter: activeFilterValue } }}
              />
            </div>
          )}

          <CroppingToolbar
            ref={toolbarRef}
            isGalleryOpen={isGalleryPanelOpen}
            isCropOptionsOpen={isCropOptionsOpen}
            onToggleGallery={toggleGallery}
            onToggleCropOptions={toggleCropOptions}
            zoomLevel={zoom}
            isSliderVisible={isSliderVisible}
            minZoom={1}
            maxZoom={3}
            zoomStep={0.01}
            onToggleSlider={toggleSlider}
            onZoomChange={(value) => setZoom(value[0] ?? 1)}
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

      <ConfirmationModal
        isOpen={isDiscardDialogOpen}
        title="Discard changes?"
        message="Your crop and filter settings will be lost."
        discardBtnText="Discard"
        confirmBtnText="Keep editing"
        onDiscard={handleDiscard}
        onConfirm={() => setIsDiscardDialogOpen(false)}
        onClose={() => setIsDiscardDialogOpen(false)}
      />
    </div>
  )
}
