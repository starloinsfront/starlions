import { useMemo } from "react"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { CarouselNavigation } from "../CroppingStep/CarouselNavigation/CarouselNavigation"
import { FiltersStepHeader } from "./FiltersStepHeader/FiltersStepHeader"
import { useFilters } from "./hooks/useFilters"
import { FILTER_PRESETS } from "./filters"
import styles from "./FiltersStep.module.css"
import type { FiltersStepProps } from "./FiltersStep.types"

export const FiltersStep = ({
  selectedImages,
  croppedImages,
  onBack,
  onNext,
}: FiltersStepProps) => {
  const { activeIndex, goToSlide, showNext, showPrev } = useCarousel(selectedImages.length)
  const { selectedFilters, selectFilter, getFilterCss } = useFilters(selectedImages.length)

  /**
   * Prepare each photo's display image:
   * croppedImage takes priority; falls back to original if no crop was made.
   */
  const preparedPhotos = useMemo(
    () =>
      selectedImages.map((originalUrl, i) => ({
        displayImage: croppedImages[i] ?? originalUrl,
      })),
    [selectedImages, croppedImages],
  )

  const currentDisplayImage = preparedPhotos[activeIndex].displayImage
  const currentFilterCss = getFilterCss(activeIndex)

  return (
    <div className={styles.step}>
      <FiltersStepHeader onBack={onBack} onNext={onNext} />

      <div className={styles.content}>
        {/* ── Left: large preview ── */}
        <div className={styles.previewArea}>
          {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
          <img
            src={currentDisplayImage}
            alt={`Photo ${activeIndex + 1} with filter`}
            className={styles.previewImage}
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

        {/* ── Right: scrollable filters panel ── */}
        <div className={styles.filtersPanel}>
          <div className={styles.filterGrid}>
            {FILTER_PRESETS.map((filter) => {
              const isSelected =
                (selectedFilters[activeIndex] ?? "normal") === filter.id

              return (
                <button
                  key={filter.id}
                  type="button"
                  className={`${styles.filterItem} ${isSelected ? styles.filterItemSelected : ""}`}
                  onClick={() => selectFilter(activeIndex, filter.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
                  <img
                    src={currentDisplayImage}
                    alt={`${filter.label} filter preview`}
                    className={styles.thumbnailImage}
                    style={{ filter: filter.value }}
                  />
                  <span className={styles.filterLabel}>{filter.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
