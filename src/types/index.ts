export interface User {
  id?: string
  name?: string
  role?: string
  custom?: Record<string, string>
  locale?: string | null
  email?: string
  createdAt?: number
  photoUrl?: string | null
  phone?: string
  welcomeMessage?: string | null
  availabilityText?: string
  pushTokens?: object
}
