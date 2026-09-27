import { QueryClient } from "@tanstack/react-query"
import { describe, expect, it } from "vitest"

import type { SchemaPublicProfileOutputDto } from "@/common/api/schema"
import { PUBLIC_PROFILE_QUERY_KEY } from "@/features/profile/api/usePublicProfileQuery"
import type { ProfileSettingsDto } from "./apiProfileSettings"
import { setAvatarInProfileCaches, setProfileCaches } from "./profileCache"
import { PROFILE_SETTINGS_QUERY_KEY } from "./useProfileSettingsQuery"

const profile: ProfileSettingsDto = {
  userId: "user-id",
  username: "john_doe",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1998-04-23",
  countryCode: null,
  cityId: null,
  cityName: null,
  aboutMe: "About John",
  avatarUrl: null,
}

describe("profile cache synchronization", () => {
  it("seeds both settings and public-profile caches", () => {
    const queryClient = new QueryClient()

    setProfileCaches(queryClient, profile)

    expect(queryClient.getQueryData(PROFILE_SETTINGS_QUERY_KEY)).toEqual(profile)
    expect(
      queryClient.getQueryData<SchemaPublicProfileOutputDto>(
        PUBLIC_PROFILE_QUERY_KEY(profile.userId),
      ),
    ).toEqual({
      userId: profile.userId,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      aboutMe: profile.aboutMe,
    })
  })

  it("updates the avatar in both caches", () => {
    const queryClient = new QueryClient()
    const avatarUrl = "https://cdn.example.com/avatar.jpg"
    setProfileCaches(queryClient, profile)

    setAvatarInProfileCaches(queryClient, avatarUrl)

    expect(
      queryClient.getQueryData<ProfileSettingsDto>(PROFILE_SETTINGS_QUERY_KEY)?.avatarUrl,
    ).toBe(avatarUrl)
    expect(
      queryClient.getQueryData<SchemaPublicProfileOutputDto>(
        PUBLIC_PROFILE_QUERY_KEY(profile.userId),
      )?.avatarUrl,
    ).toBe(avatarUrl)
  })
})
