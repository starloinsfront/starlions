import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { CroppingStepHeader } from "./CroppingStepHeader/CroppingStepHeader"
import { CarouselNavigation } from "./CarouselNavigation/CarouselNavigation"
import { CroppingToolbar } from "./CroppingToolbar/CroppingToolbar"
import { MiniGallery } from "./MiniGallery/MiniGallery"
import { useFileInput } from "./hooks/useFileInput"
import styles from "./CroppingStep.module.css"
import type { CroppingStepProps } from "./CroppingStep.types"

export const CroppingStep = ({
  selectedImages,
  isGalleryPanelOpen,
  onBack,
  onNext,
  onToggleGallery,
  onAddMoreFiles,
  onRemoveImage,
}: CroppingStepProps) => {

  const { activeIndex, goToSlide, showNext, showPrev } = useCarousel(selectedImages.length)
  const { fileInputRef, triggerFileInput, handleFileChange } = useFileInput({
    onFilesSelected: onAddMoreFiles,
  })

  const currentImageUrl = selectedImages[activeIndex]

  return (
    <div className={styles.step}>
      <CroppingStepHeader onBack={onBack} onNext={onNext} />

      <div className={styles.imageArea}>
        {/* Main image */}
        {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
        <img
          src={currentImageUrl}
          alt={`Photo ${activeIndex + 1} of ${selectedImages.length}`}
          className={styles.image}
        />

        <CarouselNavigation
          count={selectedImages.length}
          activeIndex={activeIndex}
          onPrev={showPrev}
          onNext={showNext}
          onGoToSlide={goToSlide}
        />

        <CroppingToolbar
          isGalleryOpen={isGalleryPanelOpen}
          onToggleGallery={onToggleGallery}
        />

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
