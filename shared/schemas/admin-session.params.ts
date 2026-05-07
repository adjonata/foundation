import { z } from 'zod'

/** Parametro `:id` de rotas sobre sessões no painel admin. */
export const adminSessionIdParamSchema = z.coerce.number().int().positive()
