"use client"

import Image from "next/image"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./AvatarDisplay.module.css"

type Props = {
  avatarUrl: string | null | undefined
  username: string
  onSelectPhoto?: () => void
  onDelete?: () => void
}

const getInitials = (name: string) => {
  const normalized = name.trim()
  if (!normalized) return "?"
  return normalized.slice(0, 2).toUpperCase()
}

export const AvatarDisplay = ({ avatarUrl, username, onSelectPhoto, onDelete }: Props) => (
  <div className={s.container}>
    <div className={s.avatarWrapper}>
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

      {avatarUrl && onDelete && (
        <button
          type="button"
          className={s.deleteButton}
          onClick={onDelete}
          aria-label="Delete profile photo"
        >
          <Icon name="closeOutline" width={16} height={16} />
        </button>
      )}
    </div>

    {onSelectPhoto && (
      <button type="button" className={s.selectButton} onClick={onSelectPhoto}>
        Select Profile Photo
      </button>
    )}
  </div>
)
