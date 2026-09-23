import { describe, expect, it } from "vitest"

import { isAtLeastAge, parseDateOnly } from "./dateOfBirth"
import { profileSettingsSchema } from "./profile-settings.schema"

const validProfile = {
  avatarUrl: null,
  username: "john_doe",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1998-04-23",
  countryCode: null,
  cityId: null,
  aboutMe: "About John",
}

const toDateOnly = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

describe("profile settings date of birth", () => {
  it("parses a date-only value without a UTC day shift", () => {
    const date = parseDateOnly("1998-04-23")

    expect(date?.getFullYear()).toBe(1998)
    expect(date?.getMonth()).toBe(3)
    expect(date?.getDate()).toBe(23)
  })

  it("rejects impossible calendar dates", () => {
    expect(parseDateOnly("2026-02-30")).toBeNull()
    expect(parseDateOnly("23.04.1998")).toBeNull()
  })

  it("accepts the exact thirteenth birthday and rejects the following day", () => {
    const today = new Date(2026, 8, 23)

    expect(isAtLeastAge("2013-09-23", 13, today)).toBe(true)
    expect(isAtLeastAge("2013-09-24", 13, today)).toBe(false)
  })
})

describe("profileSettingsSchema", () => {
  it("accepts valid profile data", () => {
    expect(profileSettingsSchema.safeParse(validProfile).success).toBe(true)
  })

  it("rejects a user under 13", () => {
    const underageBirthDate = new Date()
    underageBirthDate.setFullYear(underageBirthDate.getFullYear() - 12)

    expect(
      profileSettingsSchema.safeParse({
        ...validProfile,
        dateOfBirth: toDateOnly(underageBirthDate),
      }).success,
    ).toBe(false)
  })

  it("rejects blank or non-letter names", () => {
    expect(profileSettingsSchema.safeParse({ ...validProfile, firstName: "   " }).success).toBe(
      false,
    )
    expect(profileSettingsSchema.safeParse({ ...validProfile, lastName: "Doe-" }).success).toBe(
      false,
    )
  })

  it("rejects an about-me value longer than 200 characters", () => {
    expect(
      profileSettingsSchema.safeParse({ ...validProfile, aboutMe: "a".repeat(201) }).success,
    ).toBe(false)
  })
})
