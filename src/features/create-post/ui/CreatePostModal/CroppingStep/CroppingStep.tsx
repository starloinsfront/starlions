import { useRef, useCallback, ChangeEvent } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Icon } from "@/common/components/Icon/Icon"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import carouselStyles from "@/common/components/Carousel/Carousel.module.css"
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { activeIndex, goToSlide, showNext, showPrev } = useCarousel(selectedImages.length)

  const handleAddClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files && files.length > 0) {
        onAddMoreFiles(files)
      }
      // Reset input so selecting the same file again triggers onChange
      event.target.value = ""
    },
    [onAddMoreFiles],
  )

  const currentImageUrl = selectedImages[activeIndex]
  const hasMultipleImages = selectedImages.length > 1

  return (
    <div className={styles.step}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} type="button" aria-label="Go back" onClick={onBack}>
          <Icon name="arrowBackOutline" width={24} height={24} />
        </button>

        <Dialog.Title className={styles.title}>Cropping</Dialog.Title>

        <button className={styles.nextButton} type="button" onClick={onNext}>
          Next
        </button>
      </div>

      {/* Image area with carousel */}
      <div className={styles.imageArea}>
        {/* Main image */}
        {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
        <img
          src={currentImageUrl}
          alt={`Photo ${activeIndex + 1} of ${selectedImages.length}`}
          className={styles.image}
        />

        {/* Navigation arrows (only if multiple images) */}
        {hasMultipleImages && (
          <>
            <button
              className={`${styles.navArrow} ${styles.navArrowLeft}`}
              type="button"
              aria-label="Previous image"
              onClick={showPrev}
            >
              <Icon className={carouselStyles.navIconLeft} height={27} name="arrowIosDownOutline" width={27} />
            </button>
            <button
              className={`${styles.navArrow} ${styles.navArrowRight}`}
              type="button"
              aria-label="Next image"
              onClick={showNext}
            >
              <Icon className={carouselStyles.navIconRight} height={27} name="arrowIosDownOutline" width={27} />
            </button>
          </>
        )}

        {/* Pagination dots (only if multiple images) */}
        {hasMultipleImages && (
          <div className={styles.pagination}>
            {selectedImages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to image ${index + 1}`}
                aria-current={activeIndex === index}
                className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarGroup}>
            <button className={styles.toolButton} type="button" aria-label="Crop">
              <Icon name="expandOutline" width={24} height={24} />
            </button>
            <button className={styles.toolButton} type="button" aria-label="Zoom">
              <Icon name="maximizeOutline" width={24} height={24} />
            </button>
          </div>

          <button
            className={styles.toolButton}
            type="button"
            aria-label="Gallery"
            aria-pressed={isGalleryPanelOpen}
            onClick={onToggleGallery}
          >
            <Icon
              name="imageOutline"
              width={24}
              height={24}
              style={isGalleryPanelOpen ? { color: "var(--accent-500)" } : undefined}
            />
          </button>
        </div>

        {/* Mini-gallery preview panel */}
        {isGalleryPanelOpen && (
          <div className={styles.galleryPanel}>
            <div className={styles.galleryList}>
              {selectedImages.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  className={`${styles.thumbnail} ${activeIndex === index ? styles.thumbnailActive : ""}`}
                  onClick={() => goToSlide(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className={styles.thumbnailImage}
                  />
                  <span
                    className={styles.thumbnailRemove}
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove image ${index + 1}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveImage(index)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation()
                        e.preventDefault()
                        onRemoveImage(index)
                      }
                    }}
                  >
                    <Icon name="closeOutline" width={12} height={12} />
                  </span>
                </button>
              ))}

              {/* Add button */}
              <button
                className={styles.addButton}
                type="button"
                aria-label="Add image"
                onClick={handleAddClick}
              >
                <Icon name="plusCircleOutline" width={24} height={24} />
              </button>
            </div>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
