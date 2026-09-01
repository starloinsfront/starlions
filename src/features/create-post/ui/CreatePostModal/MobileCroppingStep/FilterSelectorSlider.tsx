import s from "./FilterSelectorSlider.module.css"
import type { FilterPreset } from "@/features/create-post/ui/CreatePostModal/FiltersStep/filters"

type FilterSelectorSliderProps = {
  filters: FilterPreset[]
  activeFilterId: string
  previewImage: string
  onSelect: (filterId: string) => void
}

export const FilterSelectorSlider = ({
  filters,
  activeFilterId,
  previewImage,
  onSelect,
}: FilterSelectorSliderProps) => {
  return (
    <div className={s.slider}>
      {filters.map((filter) => {
        const isActive = activeFilterId === filter.id

        return (
          <button
            key={filter.id}
            type="button"
            className={`${s.filterNode} ${isActive ? s.filterNodeActive : ""}`}
            onClick={() => onSelect(filter.id)}
          >
            <div className={s.previewBox}>
              {/* eslint-disable-next-line @next/next/no-img-element -- blob URL */}
              <img
                src={previewImage}
                alt={`${filter.label} filter preview`}
                className={s.previewImage}
                style={{ filter: filter.value }}
              />
            </div>
            <span className={`${s.filterLabel} ${isActive ? s.filterLabelActive : ""}`}>
              {filter.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
