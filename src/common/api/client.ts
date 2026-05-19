import createClient from "openapi-fetch"
import type { paths } from "./schema"

export const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
})
