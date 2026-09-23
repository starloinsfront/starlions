"use client"

import Link from "next/link"
import { ROUTES } from "@/common/constants/route"
import { isUnderMinimumAge } from "@/features/settings/model/dateOfBirth"
import s from "./AgeRestrictionNotice.module.css"

type Props = {
  dateOfBirth: string | null | undefined
  onPrivacyPolicyClick: () => void
  returnTo: string
}

export const AgeRestrictionNotice = ({ dateOfBirth, onPrivacyPolicyClick, returnTo }: Props) => {
  if (!dateOfBirth || !isUnderMinimumAge(dateOfBirth)) {
    return null
  }

  return (
    <div className={s.notice} role="alert">
      <p className={s.text}>
        A user under 13 cannot create a profile.{" "}
        <Link
          className={s.link}
          href={ROUTES.profilePrivacyPolicy(returnTo)}
          onClick={onPrivacyPolicyClick}
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
