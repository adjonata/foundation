import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),
  password: z.string().min(6).max(72),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(120, 'Máximo 120 caracteres'),
  email: z
    .string()
    .email('E-mail inválido')
    .transform((v) => v.toLowerCase()),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres').max(72),
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
