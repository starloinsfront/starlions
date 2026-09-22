"use client"

import clsx from "clsx"

import { Carousel } from "@/common/components/Carousel/Carousel"
import { ROUTES } from "@/common/constants/route"
import type { PublicPostImage } from "@/features/posts/model/post.types"

import stylesPostCard from "../PostCard.module.css"
import s from "./PostCardMedia.module.css"

type Props = {
  hideControls?: boolean
  images: PublicPostImage[]
  postHrefBase?: string
  postId: string
}

export const PostCardMedia = ({
  hideControls = false,
  images,
  postHrefBase = "/",
  postId,
}: Props) => {
  const visibleImages = hideControls ? images.slice(0, 1) : images
  const postModalHref = ROUTES.postModalById(postHrefBase, postId)

  return (
    <Carousel
      classNames={{
        dot: s.dot,
        dots: clsx(s.dots, hideControls && s.controlsHidden),
        navButton: clsx(s.navButton, hideControls && s.controlsHidden),
        navNext: s.navNext,
        navPrev: s.navPrev,
        root: stylesPostCard.media,
        slide: stylesPostCard.slide,
      }}
      getHref={() => postModalHref}
      labelClassName={s.slideLabel}
      slides={visibleImages.map((image) => ({
        postId,
        src: image.url,
      }))}
      variant="card"
    />
  )
}
