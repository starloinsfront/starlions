"use client"

import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { type CSSProperties } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./Carousel.module.css"
import { useCarousel } from "./useCarousel"
import { CarouselProps } from "@/common/components/Carousel/ClassNames.types"

export const Carousel = (props: CarouselProps) => {
  const { classNames, slides } = props
  const { activeIndex, goToSlide, showNext, showPrev } = useCarousel(slides.length)

  if (slides.length === 0) {
    return null
  }

  return (
    <div className={classNames.root}>
      {props.variant === "card" ? (
        (() => {
          const activeSlide = props.slides[activeIndex]

          return (
            <Link
              aria-label={`Open post: ${activeSlide.label}`}
              className={classNames.slide}
              href={activeSlide.href}
              style={{ "--slide-background": activeSlide.background } as CSSProperties}
            >
              <span className={props.labelClassName}>{activeSlide.label}</span>
            </Link>
          )
        })()
      ) : (
        (() => {
          const activeSlide = props.slides[activeIndex]

          return (
            <div className={classNames.slide}>
              <Image
                alt={activeSlide.label}
                className={props.imageClassName}
                fill
                priority
                sizes={props.imageSizes}
                src={activeSlide.src}
              />
            </div>
          )
        })()
      )}

      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            className={clsx(classNames.navButton, classNames.navPrev)}
            onClick={showPrev}
            type="button"
          >
            <Icon className={s.navIconLeft} height={27} name="arrowIosDownOutline" width={27} />
          </button>

          <button
            aria-label="Next image"
            className={clsx(classNames.navButton, classNames.navNext)}
            onClick={showNext}
            type="button"
          >
            <Icon className={s.navIconRight} height={27} name="arrowIosDownOutline" width={27} />
          </button>

          <div className={classNames.dots}>
            {slides.map((slide, index) => (
              <button
                aria-current={activeIndex === index}
                aria-label={`Open image ${index + 1}`}
                className={classNames.dot}
                key={slide.id}
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
