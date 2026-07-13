import { useState, useCallback, useEffect } from "react"

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.01

export const useZoom = (activeIndex: number) => {
  const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM)

  useEffect(() => {
    setZoomLevel(MIN_ZOOM)
  }, [activeIndex])

  const handleZoomChange = useCallback((value: number[]) => {
    setZoomLevel(value[0] ?? MIN_ZOOM)
  }, [])

  return {
    zoomLevel,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    zoomStep: ZOOM_STEP,
    handleZoomChange,
  }
}
