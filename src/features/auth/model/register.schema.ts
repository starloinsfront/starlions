// src/schemas/register.schema.ts
import z from 'zod'

export const registerSchema = z
  .object({
    username: z.string()
      .min(6, 'Minimum number of characters 6')
      .max(30, 'Maximum number of characters 30')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers'),
    email: z.string()
      .email('The email must match the format example@example.com'),
    password: z.string()
      .min(6, 'Minimum number of characters 6')
      .max(20, 'Maximum number of characters 20')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain 0-9, a-z, A-Z'),
    passwordConfirmation: z.string(), // ← переименовать с confirmPassword
    isTermsAccepted: z.boolean().refine(val => val === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy',
    }),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'Passwords must match',
    path: ['passwordConfirmation'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
