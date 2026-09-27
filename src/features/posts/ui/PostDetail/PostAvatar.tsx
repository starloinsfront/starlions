"use client"

import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"

import s from "./PostAvatar.module.css"

type Props = {
  className?: string
  imageUrl?: string | null
  label: string
  size?: "lg" | "md" | "sm"
}

const imageSizes = {
  lg: "48px",
  md: "36px",
  sm: "24px",
} as const

export const PostAvatar = ({ className, imageUrl, label, size = "md" }: Props) => {
  const avatarSource = imageUrl?.trim() || undefined
  const [failedAvatarSource, setFailedAvatarSource] = useState<string>()
  const showAvatarImage = Boolean(avatarSource) && avatarSource !== failedAvatarSource

  return (
    <span
      aria-hidden="true"
      className={clsx(s.avatar, s[size], showAvatarImage && s.withImage, className)}
    >
      {showAvatarImage ? (
        <Image
          alt=""
          className={s.image}
          fill
          sizes={imageSizes[size]}
          src={avatarSource ?? ""}
          onError={() => avatarSource && setFailedAvatarSource(avatarSource)}
          unoptimized
        />
      ) : (
        label
      )}
    </span>
  )
}
