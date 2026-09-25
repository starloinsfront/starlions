import { useQuery } from "@tanstack/react-query"
import { fetchProfileSettings } from "./apiProfileSettings"

export const PROFILE_SETTINGS_QUERY_KEY = ["profileSettings"]

export const useProfileSettingsQuery = () => {
  return useQuery({
    queryKey: PROFILE_SETTINGS_QUERY_KEY,
    queryFn: fetchProfileSettings,
  })
}
