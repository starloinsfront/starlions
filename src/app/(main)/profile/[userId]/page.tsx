"use client"

import { useParams } from "next/navigation"

import { useMe } from "@/features/auth/api/useMe"
import { createProfileStub } from "@/features/profile/model/profile.stub"
import { ProfileHeader } from "@/features/profile/ui/ProfileHeader"
import { UserPostsGrid } from "@/features/user-posts/ui/UserPostsGrid"

import s from "./page.module.css"

export default function ProfilePage() {
  const params = useParams<{ userId: string }>()
  const { data: me } = useMe()
  const userId = params.userId
  const isAuthorized = Boolean(me?.id)
  const isOwner = Boolean(me?.id && me.id === userId)

  const profile = createProfileStub({
    userId,
    username: isOwner ? me?.username : undefined,
  })

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
