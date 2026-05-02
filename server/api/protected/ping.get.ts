import { ok } from '../../utils/response'

/** Exemplo de rota em `/api/protected/*` — o middleware de auth exige cookie de sessao. */
export default defineEventHandler(() => {
  return ok({ ping: 'pong' })
})
