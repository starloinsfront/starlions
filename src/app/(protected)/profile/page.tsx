"use client"
import s from "../feed/page.module.css"
import {useMe} from "@/features/auth/api/useMe"

export default function ProfilePage() {
  const query = useMe()
  return (
    <section className={s.page}>
      <h1 className={s.title}>My Profile</h1>
      <p className={s.description}>
        This protected page is available only for authenticated users and is opened from the sidebar
        route /profile.
      </p>
      <h1>{query.data?.username}</h1>
      <h1>{query.data?.email}</h1>
    </section>
  )
}
