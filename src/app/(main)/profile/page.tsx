"use client"

import { Loader } from "@/common/components/Loader/Loader"
import { useMe } from "@/features/auth/api/useMe"
import { ProfileHeader } from "@/features/profile/ui/ProfileHeader"
import { UserPostsGrid } from "@/features/user-posts/ui/UserPostsGrid"

import s from "./page.module.css"

export default function ProfilePage() {
  const { data: me, isLoading, isError } = useMe()

  if (isLoading) {
    return (
      <section className={s.page}>
        <div className={s.state}>
          <Loader />
        </div>
      </section>
    )
  }

  if (isError || !me?.id) {
    return (
      <section className={s.page}>
        <p className={s.state}>Failed to load profile.</p>
      </section>
    )
  }

  return (
    <>
      <section className={s.page}>
        <ProfileHeader username={me.username} />
        <UserPostsGrid userId={me.id} />
      </section>
    </>
  )
}
