export type ClassNames = {
  dot?: string
  dots?: string
  navButton?: string
  navNext?: string
  navPrev?: string
  root?: string
  slide?: string
}

type BaseSlide = {
  id: number | string
  label: string
}

export type CardCarouselSlide = BaseSlide & {
  background: string
  href: string
}

export type DetailCarouselSlide = BaseSlide & {
  src: string
}

type SharedProps = {
  classNames: ClassNames
  slides: Array<CardCarouselSlide | DetailCarouselSlide>
}

export type CardCarouselProps = SharedProps & {
  labelClassName: string
  slides: CardCarouselSlide[]
  variant: "card"
}

export type DetailCarouselProps = SharedProps & {
  imageClassName: string
  imageSizes: string
  slides: DetailCarouselSlide[]
  variant: "detail"
}

export type CarouselProps = CardCarouselProps | DetailCarouselProps
