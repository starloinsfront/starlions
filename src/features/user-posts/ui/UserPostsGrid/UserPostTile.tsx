"use client"

import type { MouseEvent } from "react"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ROUTES } from "@/common/constants/route"
import { useMediaQuery } from "@/common/hooks/useMediaQuery"

import s from "./UserPostTile.module.css"

type Props = {
  id: string
  coverUrl?: string
  imagesCount?: number
}

const MOBILE_POST_MEDIA_QUERY = "(max-width: 768px)"

export const UserPostTile = ({ id, coverUrl, imagesCount }: Props) => {
  const isMobile = useMediaQuery(MOBILE_POST_MEDIA_QUERY)
  const pathname = usePathname()
  const postModalHref = ROUTES.postModalById(pathname, id)
  const mobilePostHref = ROUTES.postById(id)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isMobile) {
      return
    }

    event.preventDefault()
    window.location.assign(mobilePostHref)
  }

  return (
    <Link className={s.tile} href={postModalHref} onClick={handleClick}>
      {coverUrl ? (
        <Image
          alt=""
          className={s.image}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1279px) 50vw, 25vw"
          src={coverUrl}
          unoptimized
        />
      ) : (
        <div className={s.placeholder} />
      )}
      {imagesCount != null && imagesCount > 1 && (
        <span aria-hidden className={s.badge}>
          {imagesCount}
        </span>
      )}
    </Link>
  )
}
