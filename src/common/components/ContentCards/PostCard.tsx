import { Post } from "@/common/components/ContentCards/PostImageType"
import { type CSSProperties, useState } from "react"
import s from "@/common/components/ContentCards/ContentCards.module.css"
import { Icon } from "@/common/components/Icon/Icon"
import Link from "next/link"

export const PostCard = ({ avatar, description, images, time, username }: Omit<Post, "id">) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToSlide = (index: number) => setActiveIndex(index)
  const showPrev = () => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const showNext = () => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  return (
    <article className={s.card}>
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

      <div className={s.content}>
        <div className={s.user}>
          <span aria-hidden="true" className={s.avatar}>
            {avatar}
          </span>

          <div className={s.userMeta}>
            <strong className={s.userName}>{username}</strong>
          </div>
        </div>
        <div className={s.cardMeta}>
          <span className={s.time}>{time}</span>
          <p className={s.cardDescription}>
            {description}{" "}
            <Link className={s.showMore} href="/">
              Show more
            </Link>
          </p>
        </div>
      </div>
    </article>
  )
}
