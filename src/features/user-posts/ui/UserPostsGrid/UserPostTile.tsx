"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ROUTES } from "@/common/constants/route"

import s from "./UserPostTile.module.css"

type Props = {
  id: string
  coverUrl?: string
  imagesCount?: number
}

export const UserPostTile = ({ id, coverUrl, imagesCount }: Props) => {
  const pathname = usePathname()
  const postModalHref = ROUTES.postModalById(pathname, id)

  return (
    <Link className={s.tile} href={postModalHref} prefetch={false} scroll={false}>
      {coverUrl ? (
        <Image
          alt=""
          className={s.image}
          fill
          sizes="(max-width: 768px) 33vw, (max-width: 900px) 33vw, 25vw"
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
