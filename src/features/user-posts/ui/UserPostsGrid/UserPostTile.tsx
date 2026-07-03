import Image from "next/image"
import Link from "next/link"

import s from "./UserPostTile.module.css"

type Props = {
  id: string
  coverUrl?: string
  imagesCount?: number
}

export const UserPostTile = ({ id, coverUrl, imagesCount }: Props) => {
  return (
    <Link className={s.tile} href={`/post/${id}`}>
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
