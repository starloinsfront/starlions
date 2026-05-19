import { useQuery } from "@tanstack/react-query"

import { apiAuth } from "@/features/auth/api/apiAuth"

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: apiAuth.authMe,
    retry: false,
  })
}
