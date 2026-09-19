import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
  custom: z.record(z.string(), z.string()).optional(),
  locale: z.string().nullable().optional(),
  email: z.string().email().optional(),
  createdAt: z.number().optional(),
  photoUrl: z.string().nullable().optional(),
  phone: z.string().optional(),
  welcomeMessage: z.string().nullable().optional(),
  availabilityText: z.string().optional(),
  pushTokens: z.object({}).catchall(z.any()).optional(),
})

export type UserSchemaType = z.infer<typeof UserSchema>
