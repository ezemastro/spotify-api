import { z } from 'zod'

export const userSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(3).max(20),
  email: z.string().email()
})
export const spotifyIdSchema = z.string().regex(/^[0-9A-Za-z]{22}$/)
