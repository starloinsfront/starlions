import { cookies } from "next/headers"

import { ACCESS_TOKEN_COOKIE } from "@/common/constants/auth"

export async function isAuthenticated() {
  const cookieStore = await cookies()

  return Boolean(cookieStore.get(ACCESS_TOKEN_COOKIE)?.value)
}
