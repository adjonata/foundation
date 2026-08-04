import type { H3Event } from 'h3'
import { getRequestIP } from 'h3'

export function getClientIp(event: H3Event): string {
  return getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
}
