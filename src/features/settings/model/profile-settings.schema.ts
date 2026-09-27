import z from "zod"

import { isAtLeastAge, parseDateOnly } from "./dateOfBirth"

const NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ]+$/

export const profileSettingsSchema = z.object({
  avatarUrl: z.string().nullable().optional(),

  username: z
    .string()
    .trim()
    .min(6, "Minimum number of characters 6")
    .max(30, "Maximum number of characters 30")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),

  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "Maximum number of characters 50")
    .regex(NAME_REGEX, "First name can only contain Latin and Russian letters"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Maximum number of characters 50")
    .regex(NAME_REGEX, "Last name can only contain Latin and Russian letters"),

  dateOfBirth: z
    .string()
    .nullable()
    .optional()
    .refine((value) => !value || Boolean(parseDateOnly(value)), "Invalid date of birth")
    .refine((value) => !value || isAtLeastAge(value), "You must be at least 13 years old"),

  countryCode: z.string().length(2).nullable().optional(),

  cityId: z.number().nullable().optional(),

  aboutMe: z.string().max(200, "Maximum number of characters 200").optional(),
})

export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>
