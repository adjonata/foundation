import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().transform(value => value.toLowerCase()),
  password: z.string().min(6).max(72)
})

export type CreateUserInput = z.infer<typeof createUserSchema>
