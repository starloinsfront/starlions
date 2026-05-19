"use client"

import { ACCESS_TOKEN_COOKIE } from "@/common/constants/auth"
import { ROUTES } from "@/common/constants/route"
import { useRouter } from "next/navigation"

type Props = {
  onClick?: () => void
}

export const Logout = ({ onClick }: Props) => {
  const router = useRouter()

  const handleClick = () => {
    localStorage.removeItem("accessToken")
    document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`
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
