import { z } from 'zod'
import { getTalkSession } from '@talkjs/core'

export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
  custom: z.record(z.string(), z.string()).optional(),
  locale: z.string().nullable().optional(),
  email: z.string().email().or(z.string()).nullable().optional().catch(''),
  createdAt: z.number().optional(),
  photoUrl: z.string().nullable().optional(),
  phone: z.string().nullable().optional().catch(''),
  welcomeMessage: z.string().nullable().optional(),
  availabilityText: z.string().nullable().optional().catch(''),
  pushTokens: z.object({}).catchall(z.any()).optional(),
})

export type UserSchemaType = z.infer<typeof UserSchema>

export interface User {
  id: string
  name: string
  email: string
  photoUrl: string
}

export type TalkJsSession = ReturnType<typeof getTalkSession>

export interface CreateUserPayload {
  name: string
  email: string
  photoUrl: string
}

export interface TargetUserPayload {
  id: string
  name: string
}
