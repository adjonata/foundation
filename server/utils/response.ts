import type { H3Event } from 'h3'
import { setResponseStatus } from 'h3'

/**
 * Retorna o corpo JSON direto (sem envelope `{ ok, data }`).
 * Para status diferente de `200`, passe o `event` do handler como terceiro argumento.
 */
export function ok<T>(data: T, statusCode?: number, event?: H3Event): T {
  if (statusCode !== undefined && statusCode !== 200) {
    if (!event) {
      throw new TypeError(
        'ok(data, statusCode): para status HTTP diferente de 200 passe o event do handler — ok(data, 201, event)'
      )
    }
    setResponseStatus(event, statusCode)
  }
  return data
}
