import z from "zod"

const NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/

export const profileSettingsSchema = z.object({
  username: z
    .string()
    .min(6, "Minimum number of characters 6")
    .max(30, "Maximum number of characters 30")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),

  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "Maximum number of characters 50")
    .regex(NAME_REGEX, "First name can only contain Latin and Russian letters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Maximum number of characters 50")
    .regex(NAME_REGEX, "Last name can only contain Latin and Russian letters"),

  dateOfBirth: z.string().optional().nullable(),

  country: z.string().optional().nullable(),

  city: z.string().optional().nullable(),

  aboutMe: z.string().max(200, "Maximum number of characters 200").optional(),
})

export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>
