"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Loader } from "@/common/components/Loader/Loader"
import { ROUTES } from "@/common/constants/route"
import { useMe } from "@/features/auth/api/useMe"
import { SettingsView } from "@/features/settings/ui/SettingsView"

import s from "./page.module.css"

type Props = {
  userId: string
}

export const ProfileSettingsPageClient = ({ userId }: Props) => {
  const router = useRouter()
  const { data: me } = useMe()
  const isOwner = Boolean(me?.id && me.id === userId)

  useEffect(() => {
    if (me?.id && !isOwner) {
      router.replace(ROUTES.settings(me.id))
    }
  }, [isOwner, me?.id, router])

  if (!isOwner) {
    return (
      <div aria-live="polite" className={s.state} role="status">
        <Loader />
        <p>Opening your profile settings…</p>
      </div>
    )
  }

  return <SettingsView />
}
