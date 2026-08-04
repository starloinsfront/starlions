"use client"

import Link from "next/link"
import { ROUTES } from "@/common/constants/route"
import s from "./AgeRestrictionNotice.module.css"

type Props = {
  dateOfBirth: string | null | undefined
}

const isUnder13 = (dob: string): boolean => {
  const birthDate = new Date(dob)
  if (isNaN(birthDate.getTime())) return false

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age < 13
}

export const AgeRestrictionNotice = ({ dateOfBirth }: Props) => {
  if (!dateOfBirth || !isUnder13(dateOfBirth)) {
    return null
  }

  return (
    <div className={s.notice} role="alert">
      <p className={s.text}>
        A user under 13 cannot create a profile.{" "}
        <Link className={s.link} href={ROUTES.privacyPolicy}>
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
