import * as z from "zod"

export const emailSchema = z.string().min(1, "Email is required").email("Invalid email")

export const passwordSchema = z
  .string()
  .min(6, "Minimum number of characters 6")
  .max(20, "Maximum number of characters 20")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain 0-9, a-z, A-Z")

export const passwordConfirmationSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
