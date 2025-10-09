import * as z from 'zod'

export const registerFormSchema = z.object({
  name: z.string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Name must be less than 50 characters.',
    }),

  email: z.email({
      message: 'Please enter a valid email address.',
    })
    .min(1, {
      message: 'Email is required.',
    }),

  password: z.string()
    .min(6, {
      message: 'Password must be at least 6 characters.',
    })
    .max(100, {
      message: 'Password must be less than 100 characters.',
    }),

  confirmPassword: z.string()
    .min(1, {
      message: 'Please confirm your password.',
    }),

  role: z.enum(['AUTHOR', 'READER'] as const, {
    message: 'Please select a role.',
  }),

// Validate that passwords match
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Show error on confirmPassword field
})

export type RegisterFormValues = z.infer<typeof registerFormSchema>

export const loginFormSchema = z.object({
  email: z.email({
      message: 'Please enter a valid email address.',
    })
    .min(1, {
      message: 'Email is required.',
    }),

  password: z.string()
    .min(1, {
      message: 'Password is required.',
    }),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>