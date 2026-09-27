import { useMemo } from "react"
import { FILTER_PRESETS } from "../FiltersStep/filters"

/**
 * Shared hook that resolves which image to display for each photo
 * (cropped version takes priority) and the CSS filter string for
 * the currently active photo.
 *
 * Used by both FiltersStep and PublicationStep.
 */
export const usePhotoDisplay = (
  selectedImages: string[],
  croppedImages: (string | null)[],
  selectedFilters: (string | null)[],
  activeIndex: number,
) => {
  const preparedPhotos = useMemo(
    () =>
      selectedImages.map((originalUrl, i) => ({
        displayImage: croppedImages[i] ?? originalUrl,
      })),
    [selectedImages, croppedImages],
  )

  const currentDisplayImage = preparedPhotos[activeIndex]?.displayImage

  const currentFilterCss = useMemo(() => {
    const filterId = selectedFilters[activeIndex]
    const preset = FILTER_PRESETS.find((f) => f.id === filterId)
    return preset?.value ?? "none"
  }, [selectedFilters, activeIndex])

  return {
    preparedPhotos,
    currentDisplayImage,
    currentFilterCss,
  }
}
