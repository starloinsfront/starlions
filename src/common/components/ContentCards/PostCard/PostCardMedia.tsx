import { type CSSProperties } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import s from "../ContentCards.module.css"
import { PostImage } from "../PostImageType"

type Props = {
  activeIndex: number
  goToSlide: (index: number) => void
  images: PostImage[]
  showNext: () => void
  showPrev: () => void
}

export const PostCardMedia = ({
  activeIndex,
  goToSlide,
  images,
  showNext,
  showPrev,
}: Props) => {
  return (
    <div className={s.media}>
      <div
        className={s.slide}
        style={{ "--slide-background": images[activeIndex].background } as CSSProperties}
      >
        <span className={s.slideLabel}>{images[activeIndex].label}</span>
      </div>

      {images.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            className={`${s.navButton} ${s.navPrev}`}
            onClick={showPrev}
            type="button"
          >
            <Icon className={s.navIconLeft} height={27} name="arrowIosDownOutline" width={27} />
          </button>

          <button
            aria-label="Next image"
            className={`${s.navButton} ${s.navNext}`}
            onClick={showNext}
            type="button"
          >
            <Icon className={s.navIconRight} height={27} name="arrowIosDownOutline" width={27} />
          </button>

          <div className={s.dots}>
            {images.map((image, index) => (
              <button
                aria-current={activeIndex === index}
                aria-label={`Open ${image.label}`}
                className={s.dot}
                key={image.label}
                onClick={() => goToSlide(index)}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
