"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Loader } from "@/common/components/Loader/Loader"
import { ROUTES } from "@/common/constants/route"
import { useMe } from "@/features/auth/api/useMe"

import s from "./redirect.module.css"

export default function MyProfileRedirectPage() {
  const router = useRouter()
  const { data: me, isPending } = useMe()

  useEffect(() => {
    if (isPending) {
      return
    }

    router.replace(me?.id ? ROUTES.profileById(me.id) : ROUTES.home)
  }, [isPending, me?.id, router])

  return (
    <section className={s.page} aria-live="polite">
      <Loader />
      <p>Opening profile…</p>
    </section>
  )
}
