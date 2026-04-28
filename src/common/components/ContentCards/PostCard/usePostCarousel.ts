import { useState } from "react"
import { PostImage } from "../PostImageType"

export const usePostCarousel = (images: PostImage[]) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToSlide = (index: number) => setActiveIndex(index)
  const showPrev = () => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const showNext = () => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  return {
    activeIndex,
    goToSlide,
    showNext,
    showPrev,
  }
}
