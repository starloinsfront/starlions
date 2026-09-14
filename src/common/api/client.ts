import createClient from "openapi-fetch"

import type { paths } from "./schema"

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const baseUrl = typeof window === "undefined" ? apiUrl : ""

if (!baseUrl && typeof window === "undefined") {
  throw new Error(
    "NEXT_PUBLIC_API_URL is missing. The API client cannot be initialized.",
  )
}

export const client = createClient<paths>({
  baseUrl: baseUrl?.replace(/\/$/, "") ?? "",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
})
