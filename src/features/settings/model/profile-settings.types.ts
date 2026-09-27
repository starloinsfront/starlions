export type ProfileSettingsDto = {
  userId: string
  username: string
  email: string
  firstName: string | null
  lastName: string | null
  dateOfBirth: string | null
  countryCode: string | null
  cityId: number | null
  cityName: string | null
  aboutMe: string | null
  avatarUrl: string | null
}
