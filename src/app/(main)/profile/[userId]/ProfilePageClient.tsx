"use client"

import { useParams } from "next/navigation"

import type { SchemaPublicProfileOutputDto } from "@/common/api/schema"
import { useMe } from "@/features/auth/api/useMe"
import type { PostDetailData } from "@/features/posts/ui/PostDetail/PostDetail.types"
import { PostDetail } from "@/features/posts/ui/PostDetail/PostDetail"
import { PostDetailModal } from "@/features/posts/ui/PostDetail/PostDetailModal"
import { usePublicProfileQuery } from "@/features/profile/api/usePublicProfileQuery"
import { ProfileHeader } from "@/features/profile/ui/ProfileHeader"
import type { UserPostsPage } from "@/features/user-posts/model/userPosts.types"
import { UserPostsGrid } from "@/features/user-posts/ui/UserPostsGrid"

import s from "./page.module.css"

type Props = {
  initialPost: PostDetailData | null
  initialPosts: UserPostsPage | null
  initialProfile: SchemaPublicProfileOutputDto | null
}

export default function ProfilePageClient({ initialPost, initialPosts, initialProfile }: Props) {
  const params = useParams<{ userId: string }>()
  const { data: me } = useMe()
  const userId = params.userId
  const isAuthorized = Boolean(me?.id)
  const isOwner = Boolean(me?.id && me.id === userId)
  const { data: publicProfile, isPending } = usePublicProfileQuery(userId, initialProfile)

  const profile = {
    id: userId,
    username: publicProfile?.username || initialProfile?.username || me?.username || "UserName",
    aboutMe: publicProfile?.aboutMe ?? initialProfile?.aboutMe ?? "",
    avatarUrl: publicProfile?.avatarUrl ?? initialProfile?.avatarUrl ?? undefined,
    stats: {
      following: 0,
      followers: 0,
      publications: initialPosts?.totalCount ?? 0,
    },
  }

  if (isPending && !publicProfile && !initialProfile) {
    return (
      <section className={s.page}>
        <p>Loading...</p>
      </section>
    )
  }

  return (
    <section className={s.page}>
      <ProfileHeader key={profile.id} isAuthorized={isAuthorized} isOwner={isOwner} profile={profile} />
      <UserPostsGrid initialPage={initialPosts ?? undefined} isOwner={isOwner} userId={userId} />

      {initialPost ? (
        <PostDetailModal closeHref={`/profile/${encodeURIComponent(userId)}`}>
          <PostDetail isModal post={initialPost} />
        </PostDetailModal>
      ) : null}
    </section>
  )
}
