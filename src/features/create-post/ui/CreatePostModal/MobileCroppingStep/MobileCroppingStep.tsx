import { useMemo, useState } from "react"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { useFileInput } from "@/common/hooks/useFileInput"
import { useFloatingPanels } from "../CroppingStep/hooks/useFloatingPanels"
import { ASPECT_RATIOS } from "../CroppingStep/CropOptionsPanel/CropOptionsPanel"
import { FILTER_PRESETS } from "../FiltersStep/filters"
import { MAX_PHOTOS } from "@/features/create-post/model/useFileValidation"
import { CropOptionsPanel } from "../CroppingStep/CropOptionsPanel/CropOptionsPanel"
import { MiniGallery } from "../CroppingStep/MiniGallery/MiniGallery"
import { MobileCroppingHeader } from "./MobileCroppingHeader"
import { MediaPreviewSlider } from "./MediaPreviewSlider"
import { FilterSelectorSlider } from "./FilterSelectorSlider"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./MobileCroppingStep.module.css"

type MobileCroppingStepProps = {
  selectedImages: string[]
  selectedFilters: (string | null)[]
  onBack: () => void
  onNext: () => void
  setFilter: (index: number, filterId: string) => void
  addMoreFiles: (files: File[]) => void
  removeImage: (index: number) => void
}

export const MobileCroppingStep = ({
  selectedImages,
  selectedFilters,
  onBack,
  onNext,
  setFilter,
  addMoreFiles,
  removeImage,
}: MobileCroppingStepProps) => {
  const { activeIndex, goToSlide } = useCarousel(selectedImages.length)
  const [selectedRatioId, setSelectedRatioId] = useState("original")

  const {
    isCropOptionsOpen,
    isGalleryPanelOpen,
    toggleCropOptions,
    toggleGallery,
  } = useFloatingPanels()

  const { fileInputRef, triggerFileInput, handleFileChange } = useFileInput({
    onFilesSelected: addMoreFiles,
  })

  const activeFilterId = selectedFilters[activeIndex] ?? "normal"
  const currentImage = selectedImages[activeIndex]
  const isAtLimit = selectedImages.length >= MAX_PHOTOS

  const aspectRatio = useMemo(() => {
    const option = ASPECT_RATIOS.find((r) => r.id === selectedRatioId)
    return option?.value ?? null
  }, [selectedRatioId])

  return (
    <div className={s.step}>
      <MobileCroppingHeader onBack={onBack} onNext={onNext} />

      <div className={s.content}>
        <MediaPreviewSlider
          images={selectedImages}
          filters={selectedFilters}
          aspectRatio={aspectRatio}
          onSlideChange={goToSlide}
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
          selectedOptionId={selectedRatioId}
          onSelect={(option) => setSelectedRatioId(option.id)}
          isOpen={isCropOptionsOpen}
        />

        <MiniGallery
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
