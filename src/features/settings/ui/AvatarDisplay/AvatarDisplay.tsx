"use client"

import Image from "next/image"
import { useState } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./AvatarDisplay.module.css"

type Props = {
  avatarUrl: string | null | undefined
  username: string
  disabled?: boolean
  onSelectPhoto?: () => void
  onDelete?: () => void
}

const getInitials = (name: string) => {
  const normalized = name.trim()
  if (!normalized) return "?"
  return normalized.slice(0, 2).toUpperCase()
}

export const AvatarDisplay = ({
  avatarUrl,
  username,
  disabled = false,
  onSelectPhoto,
  onDelete,
}: Props) => {
  const avatarSource = avatarUrl?.trim() || undefined
  const [failedAvatarSource, setFailedAvatarSource] = useState<string>()
  const showAvatarImage = Boolean(avatarSource) && avatarSource !== failedAvatarSource

  return (
    <div className={s.container}>
      <div className={s.avatarWrapper}>
        <div className={s.avatar} aria-label={`${username} profile image`} role="img">
          {showAvatarImage ? (
            <Image
              alt=""
              className={s.avatarImage}
              fill
              sizes="192px"
              src={avatarSource ?? ""}
              unoptimized
              loading="eager"
              onError={() => avatarSource && setFailedAvatarSource(avatarSource)}
            />
          ) : (
            <span className={s.avatarFallback}>{getInitials(username)}</span>
          )}
        </div>

        {avatarSource && onDelete ? (
          <button
            type="button"
            className={s.deleteButton}
            onClick={onDelete}
            aria-label="Delete profile photo"
            disabled={disabled}
          >
            <Icon name="closeOutline" width={16} height={16} />
          </button>
        ) : null}
      </div>

      {onSelectPhoto ? (
        <button
          type="button"
          className={s.selectButton}
          onClick={onSelectPhoto}
          disabled={disabled}
        >
          Add a Profile Photo
        </button>
      ) : null}
    </div>
  )
}
