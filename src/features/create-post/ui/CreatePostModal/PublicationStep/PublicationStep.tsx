import { useCallback } from "react"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { CarouselNavigation } from "../CarouselNavigation/CarouselNavigation"
import { PublicationStepHeader } from "./PublicationStepHeader/PublicationStepHeader"
import { usePublication } from "./hooks/usePublication"
import { usePhotoDisplay } from "../hooks/usePhotoDisplay"
import { DescriptionField } from "./DescriptionField/DescriptionField"
import { LocationField } from "./LocationField/LocationField"
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
        <div className={styles.formPanel}>
          {/* Profile block */}
          <div className={styles.profileBlock}>
            {/* eslint-disable-next-line @next/next/no-img-element -- placeholder avatar */}
            <img
              src="/images/auth/email-confirm.svg"
              alt="User avatar"
              className={styles.avatar}
            />
            <span className={styles.username}>Username</span>
          </div>

          <DescriptionField
            description={description}
            maxDescriptionLength={maxDescriptionLength}
            onChange={handleDescriptionChange}
          />

          <LocationField
            location={location}
            onChange={handleLocationChange}
            onSelectLocation={selectLocation}
          />
        </div>
      </div>
    </div>
  )
}
