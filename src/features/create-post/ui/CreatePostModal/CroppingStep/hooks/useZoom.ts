import { useState, useCallback, useEffect } from "react"

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.01

export const useZoom = (activeIndex: number) => {
  const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM)
  const [isSliderVisible, setIsSliderVisible] = useState(false)

  // Reset zoom when switching photos
  useEffect(() => {
    setZoomLevel(MIN_ZOOM)
    setIsSliderVisible(false)
  }, [activeIndex])

  const toggleSlider = useCallback(() => {
    setIsSliderVisible((prev) => !prev)
  }, [])

  const closeSlider = useCallback(() => {
    setIsSliderVisible(false)
  }, [])

  const handleZoomChange = useCallback((value: number[]) => {
    setZoomLevel(value[0] ?? MIN_ZOOM)
  }, [])

  const resetZoom = useCallback(() => {
    setZoomLevel(MIN_ZOOM)
  }, [])

  return {
    zoomLevel,
    isSliderVisible,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    zoomStep: ZOOM_STEP,
    toggleSlider,
    closeSlider,
    handleZoomChange,
    resetZoom,
  }
}
