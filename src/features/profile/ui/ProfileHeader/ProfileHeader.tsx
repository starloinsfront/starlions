"use client"

import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/common/components/Button/Button"
import { Skeleton } from "@/common/components/Skeleton/Skeleton"
import { ROUTES } from "@/common/constants/route"
import type { ProfileViewModel } from "@/features/profile/model/profile.types"

import s from "./ProfileHeader.module.css"

type Props = {
  isAuthorized: boolean
  isAuthLoading: boolean
  isOwner: boolean
  profile: ProfileViewModel
}

const numberFormatter = new Intl.NumberFormat("ru-RU")

const getInitials = (username: string) => {
  const normalizedUsername = username.trim()

  if (!normalizedUsername) {
    return "?"
  }

  return normalizedUsername.slice(0, 2).toUpperCase()
}

export const ProfileHeader = ({ isAuthorized, isAuthLoading, isOwner, profile }: Props) => {
  const avatarSource = profile.avatarUrl?.trim() || undefined
  const [failedAvatarSource, setFailedAvatarSource] = useState<string>()
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing ?? false)
  const hasActions = isAuthLoading || isOwner || isAuthorized
  const showAvatarImage = Boolean(avatarSource) && avatarSource !== failedAvatarSource

  return (
    <header className={s.header}>
      <div
        aria-label={`${profile.username} profile image`}
        className={clsx(s.avatar, showAvatarImage && s.avatarWithImage)}
        role="img"
      >
        {showAvatarImage ? (
          <Image
            alt=""
            className={s.avatarImage}
            fill
            sizes="(max-width: 768px) 80px, 160px"
            src={avatarSource ?? ""}
            onError={() => avatarSource && setFailedAvatarSource(avatarSource)}
            unoptimized
          />
        ) : (
          <span className={s.avatarFallback}>{getInitials(profile.username)}</span>
        )}
      </div>

      <div className={s.content}>
        <div className={s.topRow}>
          <h1 className={s.username}>{profile.username}</h1>

          <div
            aria-busy={isAuthLoading}
            aria-label={isAuthLoading ? "Loading profile actions" : undefined}
            className={s.actions}
            data-owner={isOwner ? "true" : "false"}
            hidden={!hasActions}
            role={isAuthLoading ? "status" : undefined}
          >
            {isAuthLoading ? (
              <Skeleton className={s.actionsSkeleton} />
            ) : isOwner ? (
              <Button asChild className={s.settingsButton} variant="secondary">
                <Link href={ROUTES.settings(profile.id)} prefetch={false}>
                  Profile Settings
                </Link>
              </Button>
            ) : null}

            {!isOwner && isAuthorized ? (
              <>
                <Button
                  aria-pressed={isFollowing}
                  className={s.followButton}
                  onClick={() => setIsFollowing((currentValue) => !currentValue)}
                  type="button"
                  variant={isFollowing ? "outline" : "primary"}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>

                <Button
                  className={s.messageButton}
                  title="Messaging will be connected when the backend endpoint is available"
                  type="button"
                  variant="secondary"
                >
                  Send Message
                </Button>
              </>
            ) : null}
          </div>
        </div>

        <dl className={s.stats}>
          <div className={s.stat}>
            <dt>Following</dt>
            <dd>{numberFormatter.format(profile.stats.following)}</dd>
          </div>
          <div className={s.stat}>
            <dt>Followers</dt>
            <dd>{numberFormatter.format(profile.stats.followers)}</dd>
          </div>
          <div className={s.stat}>
            <dt>Publications</dt>
            <dd>{numberFormatter.format(profile.stats.publications)}</dd>
          </div>
        </dl>

        <p className={s.about}>{profile.aboutMe}</p>
      </div>
    </header>
  )
}
