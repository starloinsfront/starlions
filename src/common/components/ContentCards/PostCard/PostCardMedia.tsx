import { Carousel } from "@/common/components/Carousel/Carousel"
import s from "../ContentCards.module.css"
import { PostImage } from "../PostImageType"

type Props = {
  images: PostImage[]
  postId: number
}

export const PostCardMedia = ({ images, postId }: Props) => {
  return (
    <Carousel
      classNames={{
        dot: s.dot,
        dots: s.dots,
        navButton: s.navButton,
        navNext: s.navNext,
        navPrev: s.navPrev,
        root: s.media,
        slide: s.slide,
      }}
      labelClassName={s.slideLabel}
      slides={images.map((image) => ({
        background: image.background,
        href: `/post/${postId}`,
        id: image.label,
        label: image.label,
      }))}
      variant="card"
    />
  )
}
