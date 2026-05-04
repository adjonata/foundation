import { createError, H3Error } from 'h3'
import { ZodError } from 'zod'

export class AppError extends Error {
  statusCode: number
  code: string

  constructor(code: string, message: string, statusCode = 400) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error
  if (error instanceof H3Error) {
    const statusCode = typeof error.statusCode === 'number' ? error.statusCode : 500
    const message = error.statusMessage || error.message || 'Erro na requisicao'
    return new AppError('HTTP_ERROR', message, statusCode)
  }
  if (error instanceof ZodError) {
    return new AppError('VALIDATION_ERROR', 'Dados invalidos', 422)
  }

  return new AppError('INTERNAL_ERROR', 'Erro interno no servidor', 500)
}

export function toHttpError(error: unknown) {
  if (error instanceof H3Error) {
    return error
  }
  const appError = toAppError(error)
  return createError({
    statusCode: appError.statusCode,
    statusMessage: appError.message,
    data: { code: appError.code },
  } as ApiLikeError)
}
