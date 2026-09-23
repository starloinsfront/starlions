import type { QueryClient } from "@tanstack/react-query"

import type { SchemaPublicProfileOutputDto } from "@/common/api/schema"
import { PUBLIC_PROFILE_QUERY_KEY } from "@/features/profile/api/usePublicProfileQuery"
import type { ProfileSettingsDto } from "./apiProfileSettings"
import { PROFILE_SETTINGS_QUERY_KEY } from "./useProfileSettingsQuery"

const toPublicProfile = (profile: ProfileSettingsDto): SchemaPublicProfileOutputDto => ({
  userId: profile.userId,
  username: profile.username,
  avatarUrl: profile.avatarUrl,
  aboutMe: profile.aboutMe,
})

export const setProfileCaches = (queryClient: QueryClient, profile: ProfileSettingsDto) => {
  queryClient.setQueryData(PROFILE_SETTINGS_QUERY_KEY, profile)
  queryClient.setQueryData(PUBLIC_PROFILE_QUERY_KEY(profile.userId), toPublicProfile(profile))
}

export const setAvatarInProfileCaches = (queryClient: QueryClient, avatarUrl: string | null) => {
  const currentProfile = queryClient.getQueryData<ProfileSettingsDto>(PROFILE_SETTINGS_QUERY_KEY)

  if (!currentProfile) {
    return
  }

  setProfileCaches(queryClient, { ...currentProfile, avatarUrl })
}
