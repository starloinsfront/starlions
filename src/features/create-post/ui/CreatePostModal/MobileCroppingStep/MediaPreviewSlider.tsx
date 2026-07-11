import { useRef, useCallback } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./MediaPreviewSlider.module.css"

type MediaPreviewSliderProps = {
  images: string[]
  filterCss?: string
  onSlideChange: (index: number) => void
}

export const MediaPreviewSlider = ({
  images,
  filterCss = "none",
  onSlideChange,
}: MediaPreviewSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const scrollLeft = container.scrollLeft
    const slideWidth = 250 + 8
    const index = Math.round(scrollLeft / slideWidth)
    onSlideChange(Math.max(0, Math.min(index, images.length - 1)))
  }, [images.length, onSlideChange])

  const isSingle = images.length === 1

  return (
    <div
      ref={containerRef}
      className={`${s.slider} ${isSingle ? s.sliderSingle : ""}`}
      onScroll={handleScroll}
    >
      {images.map((url, index) => (
        <div key={url} className={`${s.slide} ${isSingle ? s.slideSingle : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- blob URL */}
          <img
            src={url}
            alt={`Photo ${index + 1}`}
            className={s.slideImage}
            style={{ filter: filterCss }}
          />
          <button
            className={s.paletteButton}
            type="button"
            aria-label={`Color palette for photo ${index + 1}`}
          >
            <Icon name="colorPaletteOutline" className={s.icon} width={18} height={18} />
          </button>
        </div>
      ))}
    </div>
  )
}
