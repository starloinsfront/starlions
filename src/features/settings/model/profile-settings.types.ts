export type ProfileSettingsDto = {
  id: string
  username: string
  firstName: string
  lastName: string
  dateOfBirth: string | null
  country: string | null
  city: string | null
  aboutMe: string
  avatarUrl: string | null
}
