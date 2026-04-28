import { useState } from "react"

export const useCarousel = (slidesCount: number) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToSlide = (index: number) => setActiveIndex(index)
  const showPrev = () =>
    setActiveIndex((prev) => (prev === 0 ? slidesCount - 1 : prev - 1))
  const showNext = () =>
    setActiveIndex((prev) => (prev === slidesCount - 1 ? 0 : prev + 1))

  return {
    activeIndex,
    goToSlide,
    showNext,
    showPrev,
  }
}
