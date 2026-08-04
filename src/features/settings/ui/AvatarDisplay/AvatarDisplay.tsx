"use client"

import Image from "next/image"
import s from "./AvatarDisplay.module.css"

type Props = {
  avatarUrl: string | null | undefined
  username: string
}

const getInitials = (name: string) => {
  const normalized = name.trim()
  if (!normalized) return "?"
  return normalized.slice(0, 2).toUpperCase()
}

export const AvatarDisplay = ({ avatarUrl, username }: Props) => (
  <div className={s.container}>
    <div className={s.avatar} aria-label={`${username} profile image`} role="img">
      {avatarUrl ? (
        <Image
          alt=""
          className={s.avatarImage}
          fill
          sizes="192px"
          src={avatarUrl}
          unoptimized
        />
      ) : (
        <span className={s.avatarFallback}>{getInitials(username)}</span>
      )}
    </div>
  </div>
)
