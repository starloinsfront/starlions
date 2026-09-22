import { useQuery } from "@tanstack/react-query"
import { fetchPublicProfile } from "./profileApi"

// Why: Generates a unique cache key for TanStack Query. The key is an array ["publicProfile", "6a9ccc49-3382-..."].

export const PUBLIC_PROFILE_QUERY_KEY = (userId: string) => ["publicProfile", userId]

// Why: A React hook that components use to load a public profile.

export const usePublicProfileQuery = (userId: string) => {
  return useQuery({
    queryKey: PUBLIC_PROFILE_QUERY_KEY(userId),
    queryFn: () => fetchPublicProfile(userId),
    enabled: Boolean(userId),
  })
}
