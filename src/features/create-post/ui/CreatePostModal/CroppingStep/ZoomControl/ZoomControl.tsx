import { useEffect, useRef } from "react"
import * as Slider from "@radix-ui/react-slider"
import { Icon } from "@/common/components/Icon/Icon"
import styles from "./ZoomControl.module.css"

type ZoomControlProps = {
  zoomLevel: number
  isSliderVisible: boolean
  minZoom: number
  maxZoom: number
  zoomStep: number
  onToggleSlider: () => void
  onCloseSlider: () => void
  onZoomChange: (value: number[]) => void
}

export const ZoomControl = ({
  zoomLevel,
  isSliderVisible,
  minZoom,
  maxZoom,
  zoomStep,
  onToggleSlider,
  onCloseSlider,
  onZoomChange,
}: ZoomControlProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close slider on click outside
  useEffect(() => {
    if (!isSliderVisible) return

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onCloseSlider()
      }
    }

    // Use timeout to avoid the same click that opened it from closing it
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSliderVisible, onCloseSlider])

  return (
    <div className={styles.zoomWrapper} ref={wrapperRef}>
      <div
        className={`${styles.sliderPanel} ${isSliderVisible ? styles.sliderPanelOpen : ""}`}
      >
        <Slider.Root
          className={styles.sliderRoot}
          value={[zoomLevel]}
          min={minZoom}
          max={maxZoom}
          step={zoomStep}
          onValueChange={onZoomChange}
        >
          <Slider.Track className={styles.sliderTrack}>
            <Slider.Range className={styles.sliderRange} />
          </Slider.Track>
          <Slider.Thumb className={styles.sliderThumb} aria-label="Zoom level" />
        </Slider.Root>
      </div>

      <button
        className={styles.triggerButton}
        type="button"
        aria-label="Zoom"
        aria-pressed={isSliderVisible}
        onClick={onToggleSlider}
      >
        <Icon
          name="maximizeOutline"
          width={24}
          height={24}
          style={zoomLevel > 1 ? { color: "var(--accent-500)" } : undefined}
        />
      </button>
    </div>
  )
}
