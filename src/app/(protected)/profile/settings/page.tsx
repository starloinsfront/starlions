"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Loader } from "@/common/components/Loader/Loader"
import { ROUTES } from "@/common/constants/route"
import { useMe } from "@/features/auth/api/useMe"

import s from "@/app/(main)/profile/redirect.module.css"

export default function ProfileSettingsShortcutPage() {
  const router = useRouter()
  const { data: me, isPending } = useMe()

  useEffect(() => {
    if (isPending) {
      return
    }

    if (me?.id) {
      router.replace(ROUTES.settings(me.id))
      return
    }

    router.replace(ROUTES.signIn)
  }, [isPending, me?.id, router])

  return (
    <section aria-live="polite" className={s.page}>
      <Loader />
      <p>Opening profile settings…</p>
    </section>
  )
}
