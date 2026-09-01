import { forwardRef } from "react"
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
  onZoomChange: (value: number[]) => void
}

export const ZoomControl = forwardRef<HTMLDivElement, ZoomControlProps>(
  (
    {
      zoomLevel,
      isSliderVisible,
      minZoom,
      maxZoom,
      zoomStep,
      onToggleSlider,
      onZoomChange,
    },
    ref,
  ) => {
    return (
      <div className={styles.zoomWrapper} ref={ref}>
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
  },
)

ZoomControl.displayName = "ZoomControl"
