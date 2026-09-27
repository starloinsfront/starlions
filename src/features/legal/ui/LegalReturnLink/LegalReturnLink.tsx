"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { getSafeSettingsReturnTo } from "@/features/legal/model/legalReturnTo"

import s from "./LegalReturnLink.module.css"

export const LegalReturnLink = () => {
  const searchParams = useSearchParams()
  const returnTo = getSafeSettingsReturnTo(searchParams.get("returnTo"))

  if (!returnTo) {
    return null
  }

  return (
    <Link className={s.link} href={returnTo}>
      <span aria-hidden="true">←</span>
      Back to General Information
    </Link>
  )
}
