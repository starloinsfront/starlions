import { Icon } from "@/common/components/Icon/Icon"
import carouselStyles from "@/common/components/Carousel/Carousel.module.css"
import styles from "./CarouselNavigation.module.css"

type CarouselNavigationProps = {
  count: number
  activeIndex: number
  onPrev: () => void
  onNext: () => void
  onGoToSlide: (index: number) => void
}

export const CarouselNavigation = ({
  count,
  activeIndex,
  onPrev,
  onNext,
  onGoToSlide,
}: CarouselNavigationProps) => {
  if (count <= 1) {
    return null
  }

  return (
    <>
      {/* Navigation arrows */}
      <button
        className={`${styles.navArrow} ${styles.navArrowLeft}`}
        type="button"
        aria-label="Previous image"
        onClick={onPrev}
      >
        <Icon className={carouselStyles.navIconLeft} height={27} name="arrowIosDownOutline" width={27} />
      </button>
      <button
        className={`${styles.navArrow} ${styles.navArrowRight}`}
        type="button"
        aria-label="Next image"
        onClick={onNext}
      >
        <Icon className={carouselStyles.navIconRight} height={27} name="arrowIosDownOutline" width={27} />
      </button>

      {/* Pagination dots */}
      <div className={styles.pagination}>
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to image ${index + 1}`}
            aria-current={activeIndex === index}
            className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ""}`}
            onClick={() => onGoToSlide(index)}
          />
        ))}
      </div>
    </>
  )
}
