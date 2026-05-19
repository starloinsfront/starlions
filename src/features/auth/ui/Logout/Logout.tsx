"use client"

import { ROUTES } from "@/common/constants/route"
import { clearAccessToken } from "@/common/utils/auth/accessToken"
import { useRouter } from "next/navigation"

type Props = {
  onClick?: () => void
}

export const Logout = ({ onClick }: Props) => {
  const router = useRouter()

  const handleClick = () => {
    clearAccessToken()
    onClick?.()
    router.push(ROUTES.signIn)
    router.refresh()
  }

  return (
    <button type="button" onClick={handleClick}>
      Logout
    </button>
  )
}
