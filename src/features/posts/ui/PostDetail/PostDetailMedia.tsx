import clsx from "clsx"

import { Carousel } from "@/common/components/Carousel/Carousel"
import s from "./PostDetailMedia.module.css"
import { PostDetailImage } from "./PostDetail.types"

type Props = {
  className?: string
  href?: string
  images: PostDetailImage[]
  sizes?: string
  variant?: "desktop" | "mobile" | "mobile-detail"
}

export const PostDetailMedia = ({ className, href, images, sizes, variant = "desktop" }: Props) => {
  const isMobile = variant !== "desktop"
  const isMobileDetail = variant === "mobile-detail"

  return (
    <div
      className={clsx(
        s.mediaSection,
        isMobile && s.mobile,
        isMobileDetail && s.mobileDetail,
        className,
      )}
    >
      <Carousel
        classNames={{
          dot: s.dot,
          dots: s.dots,
          navButton: s.navButton,
          navNext: s.navNext,
          navPrev: s.navPrev,
          root: s.mediaCarousel,
          slide: s.mediaSlide,
        }}
        slides={images.map((image) => ({
          src: image.url,
        }))}
        sizes={sizes ?? (isMobile ? "100vw" : "(max-width: 768px) 100vw, 50vw")}
        getHref={href ? () => href : undefined}
        variant="detail"
      />
    </div>
  )
}
