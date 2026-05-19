import * as z from "zod"

export const emailSchema = z
  .string()
  .trim()
  .min(1, { error: "Email is required" })
  .pipe(z.email({ error: "Invalid email" }))

export const passwordSchema = z
  .string()
  .min(6, "Minimum number of characters 6")
  .max(20, "Maximum number of characters 20")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain 0-9, a-z, A-Z")

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const passwordConfirmationSchema = z
  .object({
    newPassword: passwordSchema,
    newPasswordConfirmation: passwordSchema,
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Passwords do not match",
    path: ["newPasswordConfirmation"],
  })

export type SignInFormData = z.infer<typeof signInSchema>
