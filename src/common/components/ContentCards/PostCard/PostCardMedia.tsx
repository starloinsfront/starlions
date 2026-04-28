import Link from "next/link"
import { type CSSProperties } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import s from "../ContentCards.module.css"
import { PostImage } from "../PostImageType"

type Props = {
  activeIndex: number
  goToSlide: (index: number) => void
  images: PostImage[]
  postId: number
  showNext: () => void
  showPrev: () => void
}

export const PostCardMedia = ({
  activeIndex,
  goToSlide,
  images,
  postId,
  showNext,
  showPrev,
}: Props) => {
  return (
    <div className={s.media}>
      <Link
        aria-label={`Open post ${postId}: ${images[activeIndex].label}`}
        className={s.slide}
        href={`/post/${postId}`}
        style={{ "--slide-background": images[activeIndex].background } as CSSProperties}
      >
        <span className={s.slideLabel}>{images[activeIndex].label}</span>
      </Link>

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
