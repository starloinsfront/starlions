"use client"

import type { SchemaPublicProfileOutputDto } from "@/common/api/schema"
import { useMe } from "@/features/auth/api/useMe"
import { ProfileHeader } from "@/features/profile/ui/ProfileHeader"
import type { UserPostsPage } from "@/features/user-posts/model/userPosts.types"
import { UserPostsGrid } from "@/features/user-posts/ui/UserPostsGrid"

import s from "./page.module.css"

type Props = {
  initialPosts: UserPostsPage
  profile: SchemaPublicProfileOutputDto
  userId: string
}

export const ProfilePageClient = ({ initialPosts, profile, userId }: Props) => {
  const { data: me, isPending } = useMe()
  const isAuthorized = Boolean(me?.id)
  const isAuthLoading = isPending && !me
  const isOwner = Boolean(me?.id === userId)

  const profileViewModel = {
    id: profile.userId,
    username: profile.username,
    aboutMe: profile.aboutMe ?? "",
    avatarUrl: profile.avatarUrl ?? undefined,
    stats: {
      following: 0,
      followers: 0,
      publications: initialPosts.totalCount,
    },
  }

  return (
    <section className={s.page}>
      <ProfileHeader
        isAuthorized={isAuthorized}
        isAuthLoading={isAuthLoading}
        isOwner={isOwner}
        profile={profileViewModel}
      />

      <UserPostsGrid initialPage={initialPosts} isOwner={isOwner} userId={userId} />
    </section>
  )
}
