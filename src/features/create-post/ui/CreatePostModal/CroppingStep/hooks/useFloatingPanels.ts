import { useState, useCallback } from "react"

type Panel = "cropOptions" | "zoom" | "gallery" | null

export function useFloatingPanels() {
  const [openPanel, setOpenPanel] = useState<Panel>(null)

  const togglePanel = useCallback((panel: Panel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel))
  }, [])

  const closeAll = useCallback(() => {
    setOpenPanel(null)
  }, [])

  return {
    openPanel,
    isCropOptionsOpen: openPanel === "cropOptions",
    isSliderVisible: openPanel === "zoom",
    isGalleryPanelOpen: openPanel === "gallery",
    toggleCropOptions: useCallback(() => togglePanel("cropOptions"), [togglePanel]),
    toggleSlider: useCallback(() => togglePanel("zoom"), [togglePanel]),
    toggleGallery: useCallback(() => togglePanel("gallery"), [togglePanel]),
    closeAll,
  }
}