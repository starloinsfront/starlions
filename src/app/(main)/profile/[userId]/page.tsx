"use client"

import { useParams } from "next/navigation"

import { useMe } from "@/features/auth/api/useMe"
import { usePublicProfileQuery } from "@/features/profile/api/usePublicProfileQuery"
import { ProfileHeader } from "@/features/profile/ui/ProfileHeader"
import { UserPostsGrid } from "@/features/user-posts/ui/UserPostsGrid"

import s from "./page.module.css"

const DEFAULT_STATS = {
  following: 0,
  followers: 0,
  publications: 0,
}

export default function ProfilePage() {
  const params = useParams<{ userId: string }>()
  const { data: me } = useMe()
  const userId = params.userId
  const isAuthorized = Boolean(me?.id)
  const isOwner = Boolean(me?.id && me.id === userId)

  const { data: publicProfile, isPending } = usePublicProfileQuery(userId)

  const profile = {
    id: userId,
    username: publicProfile?.username || me?.username || "UserName",
    aboutMe: publicProfile?.aboutMe || "",
    avatarUrl: publicProfile?.avatarUrl ?? undefined,
    stats: DEFAULT_STATS,
  }

  if (isPending && !publicProfile) {
    return (
      <section className={s.page}>
        <p>Loading...</p>
      </section>
    )
  }

  return (
    <section className={s.page}>
      <ProfileHeader
        key={profile.id}
        isAuthorized={isAuthorized}
        isOwner={isOwner}
        profile={profile}
      />

      <UserPostsGrid isOwner={isOwner} userId={userId} />
    </section>
  )
}
