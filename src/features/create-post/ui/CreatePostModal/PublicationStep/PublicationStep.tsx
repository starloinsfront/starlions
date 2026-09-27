import { useCallback } from "react"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { useMe } from "@/features/auth/api/useMe"
import { CarouselNavigation } from "../CarouselNavigation/CarouselNavigation"
import { PublicationStepHeader } from "./PublicationStepHeader/PublicationStepHeader"
import { PublicationForm } from "./PublicationForm"
import { usePublication } from "./hooks/usePublication"
import { usePhotoDisplay } from "../hooks/usePhotoDisplay"
import styles from "./PublicationStep.module.css"
import type { PublicationStepProps } from "./PublicationStep.types"

export const PublicationStep = ({
  selectedImages,
  croppedImages,
  selectedFilters,
  onBack,
  onPublish,
  isPublishing = false,
}: PublicationStepProps) => {
  const { data: me } = useMe()
  const { activeIndex, goToSlide, showNext, showPrev } = useCarousel(selectedImages.length)
  const {
    description,
    location,
    maxDescriptionLength,
    handleDescriptionChange,
    handleLocationChange,
    selectLocation,
  } = usePublication()

  const { currentDisplayImage, currentFilterCss } = usePhotoDisplay(
    selectedImages,
    croppedImages,
    selectedFilters,
    activeIndex,
  )

  const handlePublishClick = useCallback(() => {
    onPublish({ description, location })
  }, [description, location, onPublish])

  return (
    <div className={styles.step}>
      <PublicationStepHeader
        onBack={onBack}
        onPublish={handlePublishClick}
        isPublishing={isPublishing}
      />

      <div className={styles.content}>
        {/* ── Left: image carousel ── */}
        <div className={styles.carouselArea}>
          {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
          <img
            src={currentDisplayImage}
            alt={`Photo ${activeIndex + 1}`}
            className={styles.carouselImage}
            style={{ filter: currentFilterCss }}
          />

          <CarouselNavigation
            count={selectedImages.length}
            activeIndex={activeIndex}
            onPrev={showPrev}
            onNext={showNext}
            onGoToSlide={goToSlide}
          />
        </div>

        {/* ── Right: form panel ── */}
        <PublicationForm
          description={description}
          location={location}
          maxDescriptionLength={maxDescriptionLength}
          onDescriptionChange={handleDescriptionChange}
          onLocationChange={handleLocationChange}
          onSelectLocation={selectLocation}
          username={me?.username}
        />
      </div>
    </div>
  )
}
