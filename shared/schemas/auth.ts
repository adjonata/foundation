import { z } from 'zod'

/** Login e corpo de POST /api/auth/login (mesma validacao no formulario). */
export const loginSchema = z.object({
  email: z
    .string({ error: 'E-mail é obrigatório' })
    .email('E-mail inválido')
    .transform((value) => value.toLowerCase()),
  password: z
    .string({ error: 'Senha é obrigatória' })
    .min(6, 'Mínimo de 6 caracteres')
    .max(72, 'Máximo de 72 caracteres'),
})

/** Corpo de POST /api/auth/register (sem confirmar senha no servidor). */
export const registerBodySchema = z.object({
  name: z
    .string({ error: 'Nome é obrigatório' })
    .min(2, 'Mínimo de 2 caracteres')
    .max(120, 'Máximo de 120 caracteres')
    .trim(),
  email: z
    .string({ error: 'E-mail é obrigatório' })
    .email('E-mail inválido')
    .transform((value) => value.toLowerCase()),
  password: z
    .string({ error: 'Senha é obrigatória' })
    .min(6, 'Mínimo de 6 caracteres')
    .max(72, 'Máximo de 72 caracteres'),
})

/** Formulario de cadastro (campos extra + mesma regra de negocio que o API body). */
export const registerFormSchema = registerBodySchema
  .extend({
    confirmPassword: z.string({ error: 'Confirmação de senha é obrigatória' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z
    .string({ error: 'E-mail é obrigatório' })
    .email('E-mail inválido')
    .transform((value) => value.toLowerCase()),
})

/** Corpo de POST /api/auth/reset-password (apenas token + nova senha). */
export const resetPasswordBodySchema = z.object({
  token: z.string({ error: 'Token é obrigatório' }).min(1, 'Token é obrigatório'),
  password: z
    .string({ error: 'Senha é obrigatória' })
    .min(6, 'Mínimo de 6 caracteres')
    .max(72, 'Máximo de 72 caracteres'),
})

/** Formulário de redefinição (sem token — vem da URL). */
export const resetPasswordFormSchema = z
  .object({
    password: z
      .string({ error: 'Senha é obrigatória' })
      .min(6, 'Mínimo de 6 caracteres')
      .max(72, 'Máximo de 72 caracteres'),
    confirmPassword: z.string({ error: 'Confirmação de senha é obrigatória' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

/** Schema completo com token (para uso interno e testes). */
export const resetPasswordSchema = resetPasswordBodySchema
  .extend({
    confirmPassword: z.string({ error: 'Confirmação de senha é obrigatória' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type LoginInput = z.output<typeof loginSchema>
export type RegisterInput = z.output<typeof registerBodySchema>
export type LoginSchema = LoginInput
export type RegisterSchema = z.output<typeof registerFormSchema>
export type ForgotPasswordInput = z.output<typeof forgotPasswordSchema>
export type ResetPasswordBodyInput = z.output<typeof resetPasswordBodySchema>
export type ResetPasswordFormInput = z.output<typeof resetPasswordFormSchema>
export type ResetPasswordInput = z.output<typeof resetPasswordSchema>
