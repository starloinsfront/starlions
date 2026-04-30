import { Carousel } from "@/common/components/Carousel/Carousel"
import cardSliderStyles from "@/common/components/ContentCards/ContentCards.module.css"
import s from "./PostDetail.module.css"
import { PostDetailImage } from "./PostDetail.types"

type Props = {
  images: PostDetailImage[]
}

export const PostDetailMedia = ({ images }: Props) => {
  return (
    <div className={s.mediaSection}>
      <Carousel
        classNames={{
          dot: cardSliderStyles.dot,
          dots: cardSliderStyles.dots,
          navButton: cardSliderStyles.navButton,
          navNext: cardSliderStyles.navNext,
          navPrev: cardSliderStyles.navPrev,
          root: s.mediaCarousel,
          slide: s.mediaSlide,
        }}
        imageClassName={s.mediaImage}
        imageSizes="(max-width: 1024px) 100vw, 70vw"
        slides={images}
        variant="detail"
      />
    </div>
  )
}
