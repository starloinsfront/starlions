export type ProfileStats = {
  followers: number
  following: number
  publications: number
}

export type ProfileViewModel = {
  aboutMe: string
  avatarUrl?: string
  id: string
  isFollowing?: boolean
  stats: ProfileStats
  username: string
}
