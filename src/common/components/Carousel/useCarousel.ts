import { useState } from "react"

export const useCarousel = (slidesCount: number) => {
  const [rawActiveIndex, setRawActiveIndex] = useState(0)

  const activeIndex = slidesCount > 0 ? Math.min(rawActiveIndex, slidesCount - 1) : 0

  const goToSlide = (index: number) => setRawActiveIndex(index)
  const showPrev = () =>
    setRawActiveIndex((prev) => (prev === 0 ? slidesCount - 1 : prev - 1))
  const showNext = () =>
    setRawActiveIndex((prev) => (prev === slidesCount - 1 ? 0 : prev + 1))

  return {
    activeIndex,
    goToSlide,
    showNext,
    showPrev,
  }
}
