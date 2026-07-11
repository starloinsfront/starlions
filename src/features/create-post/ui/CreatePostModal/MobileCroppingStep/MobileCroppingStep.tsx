import { useMemo } from "react"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { FILTER_PRESETS } from "../FiltersStep/filters"
import { MobileCroppingHeader } from "./MobileCroppingHeader"
import { MediaPreviewSlider } from "./MediaPreviewSlider"
import { FilterSelectorSlider } from "./FilterSelectorSlider"
import s from "./MobileCroppingStep.module.css"

type MobileCroppingStepProps = {
  selectedImages: string[]
  selectedFilters: (string | null)[]
  onBack: () => void
  onNext: () => void
  setFilter: (index: number, filterId: string) => void
}

export const MobileCroppingStep = ({
  selectedImages,
  selectedFilters,
  onBack,
  onNext,
  setFilter,
}: MobileCroppingStepProps) => {
  const { activeIndex, goToSlide } = useCarousel(selectedImages.length)

  const activeFilterId = selectedFilters[activeIndex] ?? "normal"
  const currentImage = selectedImages[activeIndex]

  const filterCss = useMemo(() => {
    const preset = FILTER_PRESETS.find((f) => f.id === activeFilterId)
    return preset?.value ?? "none"
  }, [activeFilterId])

  return (
    <div className={s.step}>
      <MobileCroppingHeader onBack={onBack} onNext={onNext} />

      <div className={s.content}>
        <MediaPreviewSlider
          images={selectedImages}
          filterCss={filterCss}
          onSlideChange={goToSlide}
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
