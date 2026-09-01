import type { ProfileViewModel } from "./profile.types"

const DEFAULT_ABOUT_ME =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

const DEFAULT_STATS = {
  following: 2218,
  followers: 2358,
  publications: 2764,
} as const

type CreateProfileStubParams = {
  userId: string
  username?: string
}

/**
 * Temporary profile presentation data.
 * Replace this mapper with a public profile endpoint once the backend exposes it.
 */
export const createProfileStub = ({
  userId,
  username,
}: CreateProfileStubParams): ProfileViewModel => ({
  id: userId,
  username: username?.trim() || "UserName",
  aboutMe: DEFAULT_ABOUT_ME,
  stats: { ...DEFAULT_STATS },
})
