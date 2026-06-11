import { useState, useCallback } from "react"
import { FILTER_PRESETS } from "../filters"
import type { FilterPreset } from "../filters"

/**
 * Manages per-photo filter selection.
 * Each photo stores its own selected filter ID independently,
 * so switching between photos never resets another photo's filter.
 */
export const useFilters = (photosCount: number) => {
  // One filter ID per photo; null = no filter selected (uses "normal")
  const [selectedFilters, setSelectedFilters] = useState<(string | null)[]>(
    () => Array(photosCount).fill(null),
  )

  const selectFilter = useCallback((photoIndex: number, filterId: string) => {
    setSelectedFilters((prev) => {
      const updated = [...prev]
      updated[photoIndex] = filterId
      return updated
    })
  }, [])

  /** Resolve the active FilterPreset for a given photo index. */
  const getActiveFilter = useCallback(
    (photoIndex: number): FilterPreset => {
      const filterId = selectedFilters[photoIndex]
      return FILTER_PRESETS.find((f) => f.id === filterId) ?? FILTER_PRESETS[0]
    },
    [selectedFilters],
  )

  /** Memoised CSS filter string for a given photo index. */
  const getFilterCss = useCallback(
    (photoIndex: number): string => getActiveFilter(photoIndex).value,
    [getActiveFilter],
  )

  return {
    selectedFilters,
    selectFilter,
    getActiveFilter,
    getFilterCss,
  }
}
