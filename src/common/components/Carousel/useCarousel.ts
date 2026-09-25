import { useState } from "react"

export const useCarousel = (slidesCount: number) => {
  const [rawActiveIndex, setRawActiveIndex] = useState(0)

  const activeIndex = slidesCount > 0 ? Math.min(rawActiveIndex, slidesCount - 1) : 0
  const canShowPrev = slidesCount > 1 && activeIndex > 0
  const canShowNext = slidesCount > 1 && activeIndex < slidesCount - 1

  const goToSlide = (index: number) => {
    setRawActiveIndex(Math.min(Math.max(index, 0), Math.max(slidesCount - 1, 0)))
  }

  const showPrev = () => {
    setRawActiveIndex((prev) => Math.max(prev - 1, 0))
  }

  const showNext = () => {
    setRawActiveIndex((prev) => Math.min(prev + 1, Math.max(slidesCount - 1, 0)))
  }

  return {
    activeIndex,
    canShowNext,
    canShowPrev,
    goToSlide,
    showNext,
    showPrev,
  }
}
