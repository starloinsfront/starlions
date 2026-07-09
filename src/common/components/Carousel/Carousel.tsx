"use client"

import clsx from "clsx"
import Link from "next/link"
import { type CSSProperties } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./Carousel.module.css"
import { useCarousel } from "./useCarousel"
import { CarouselProps } from "@/common/components/Carousel/ClassNames.types"

const getImageStyle = (src: string) => {
  return { "--carousel-image": `url("${src}")` } as CSSProperties
}

export const Carousel = (props: CarouselProps) => {
  const { classNames, slides } = props
  const { activeIndex, canShowNext, canShowPrev, goToSlide, showNext, showPrev } = useCarousel(
    slides.length,
  )

  if (slides.length === 0) {
    return null
  }

  return (
    <div className={classNames.root}>
      {props.variant === "card"
        ? (() => {
            const activeSlide = props.slides[activeIndex]

            return (
              <Link
                aria-label={`Open post: ${activeSlide.postId}`}
                className={classNames.slide}
                href={props.getHref(activeSlide)}
                onClick={(event) => props.onNavigate?.(event, activeSlide)}
                style={getImageStyle(activeSlide.src)}
              >
                {props.labelClassName && (
                  <span className={props.labelClassName}>{activeSlide.postId}</span>
                )}
              </Link>
            )
          })()
        : (() => {
            const activeSlide = props.slides[activeIndex]

            return (
              <div
                aria-label={activeSlide.src}
                className={classNames.slide}
                role="img"
                style={getImageStyle(activeSlide.src)}
              />
            )
          })()}

      {slides.length > 1 && (
        <>
          {canShowPrev && (
            <button
              aria-label="Previous image"
              className={clsx(classNames.navButton, classNames.navPrev)}
              onClick={showPrev}
              type="button"
            >
              <Icon className={s.navIconLeft} height={27} name="arrowIosDownOutline" width={27} />
            </button>
          )}

          {canShowNext && (
            <button
              aria-label="Next image"
              className={clsx(classNames.navButton, classNames.navNext)}
              onClick={showNext}
              type="button"
            >
              <Icon className={s.navIconRight} height={27} name="arrowIosDownOutline" width={27} />
            </button>
          )}

          <div className={classNames.dots}>
            {slides.map((slide, index) => (
              <button
                aria-current={activeIndex === index}
                aria-label={`Open image ${index + 1}`}
                className={classNames.dot}
                key={`${slide.src}-${index}`}
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
