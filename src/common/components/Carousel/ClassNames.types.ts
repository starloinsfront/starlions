import type { MouseEvent } from "react"

export type ClassNames = {
  dot?: string
  dots?: string
  navButton?: string
  navNext?: string
  navPrev?: string
  root?: string
  slide?: string
}

export type CardCarouselSlide = {
  postId: string
  src: string
}

export type DetailCarouselSlide = {
  src: string
}

type SharedProps = {
  classNames: ClassNames
}

export type CardCarouselProps = SharedProps & {
  getHref: (slide: CardCarouselSlide) => string
  labelClassName?: string
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, slide: CardCarouselSlide) => void
  slides: CardCarouselSlide[]
  variant: "card"
}

export type DetailCarouselProps = SharedProps & {
  slides: DetailCarouselSlide[]
  variant: "detail"
}

export type CarouselProps = CardCarouselProps | DetailCarouselProps
