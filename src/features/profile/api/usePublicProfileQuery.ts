import { useQuery } from "@tanstack/react-query"
import { client } from "@/common/api/client"
import { handleApiResponse } from "@/common/utils/api/error/handleApiResponse"
import type { SchemaPublicProfileOutputDto } from "@/common/api/schema"

// Why: Generates a unique cache key for TanStack Query. The key is an array ["publicProfile", "6a9ccc49-3382-..."].

export const PUBLIC_PROFILE_QUERY_KEY = (userId: string) => ["publicProfile", userId]

// Why: The actual HTTP request to the server. Separated from the hook for clarity.

const fetchPublicProfile = async (userId: string): Promise<SchemaPublicProfileOutputDto> => {
  const result = await client.GET("/api/v1/users/{id}/profile", {
    params: { path: { id: userId } },
  })

  return handleApiResponse(result, "Failed to fetch profile") as SchemaPublicProfileOutputDto
}

// Why: A React hook that components use to load a public profile.

export const usePublicProfileQuery = (userId: string) => {
  return useQuery({
    queryKey: PUBLIC_PROFILE_QUERY_KEY(userId),
    queryFn: () => fetchPublicProfile(userId),
    enabled: Boolean(userId),
  })
}
