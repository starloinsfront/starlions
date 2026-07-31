import createClient from "openapi-fetch"

import type { paths } from "./schema"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

if (!apiUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is missing. The API client cannot be initialized.",
  )
}

export const client = createClient<paths>({
  baseUrl: apiUrl.replace(/\/$/, ""),
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
})