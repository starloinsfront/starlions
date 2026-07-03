import Link from "next/link"

import { Button } from "@/common/components/Button/Button"
import { ROUTES } from "@/common/constants/route"

import s from "./ProfileHeader.module.css"

type Props = {
  username?: string
}

const getInitials = (username?: string) => {
  if (!username) return "?"

  return username.slice(0, 2).toUpperCase()
}

export const ProfileHeader = ({ username }: Props) => {
  return (
    <header className={s.header}>
      <div className={s.avatar} aria-hidden>
        {getInitials(username)}
      </div>

      <div className={s.info}>
        <h1 className={s.username}>{username ?? "Profile"}</h1>
        <p className={s.about}>
          <span className={s.aboutLabel}>About me</span>
          <span className={s.aboutText}>No information yet.</span>
        </p>
        <Button asChild className={s.settingsButton} variant="outline">
          <Link href={ROUTES.settings}>Profile Settings</Link>
        </Button>
      </div>
    </header>
  )
}
