import * as z from 'zod'

export const createFormSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters.',
  }).max(100, {
    message: 'Title must be less than 100 characters.',
  }),
  slug: z.string().min(3, {
    message: 'Slug must be at least 3 characters.',
  }).max(100).regex(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens.',
  }),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }),
  excerpt: z.string().max(200, {
    message: 'Excerpt must be less than 200 characters.',
  }).optional(),
})

export const updateFormSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters.',
  }).max(100, {
    message: 'Title must be less than 100 characters.',
  }).optional(),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }).optional(),
  excerpt: z.string().max(200, {
    message: 'Excerpt must be less than 200 characters.',
  }).optional(),
  published: z.boolean().optional(),
})

export type CreatePostFormValues = z.infer<typeof createFormSchema>
export type UpdatePostFormValues = z.infer<typeof updateFormSchema>