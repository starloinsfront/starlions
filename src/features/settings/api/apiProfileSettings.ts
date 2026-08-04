import type { ProfileSettingsDto } from "../model/profile-settings.types"
import type { ProfileSettingsFormData } from "../model/profile-settings.schema"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchProfileSettings = async (): Promise<ProfileSettingsDto> => {
  await delay(300)

  return {
    id: "current-user",
    username: "",
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    country: null,
    city: null,
    aboutMe: "",
    avatarUrl: null,
  }
}

export const updateProfileSettings = async (
  data: ProfileSettingsFormData,
): Promise<ProfileSettingsDto> => {
  await delay(500)

  if (Math.random() < 0.1) {
    throw new Error("Server is not available")
  }

  return {
    id: "current-user",
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth ?? null,
    country: data.country ?? null,
    city: data.city ?? null,
    aboutMe: data.aboutMe ?? "",
    avatarUrl: null,
  }
}
