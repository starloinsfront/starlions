"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/common/components/Button/Button"
import { ROUTES } from "@/common/constants/route"
import type { ProfileViewModel } from "@/features/profile/model/profile.types"

import s from "./ProfileHeader.module.css"

type Props = {
  isAuthorized: boolean
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

export const ProfileHeader = ({ isAuthorized, isOwner, profile }: Props) => {
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing ?? false)
  const hasActions = isOwner || isAuthorized

  return (
    <header className={s.header}>
      <div className={s.avatar} aria-label={`${profile.username} profile image`} role="img">
        {profile.avatarUrl ? (
          <Image
            alt=""
            className={s.avatarImage}
            fill
            sizes="(max-width: 768px) 80px, 160px"
            src={profile.avatarUrl}
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
            className={s.actions}
            data-owner={isOwner ? "true" : "false"}
            hidden={!hasActions}
          >
            {isOwner ? (
              <Button asChild className={s.settingsButton} variant="secondary">
                <Link href={ROUTES.settings}>Profile Settings</Link>
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
