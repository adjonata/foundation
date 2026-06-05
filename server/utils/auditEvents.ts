export const AuditEvent = {
  USER_LOGIN: { action: 'LOGIN', entity: 'User' },
  USER_LOGOUT: { action: 'LOGOUT', entity: 'User' },
  USER_ROLE_CHANGED: { action: 'ROLE_CHANGED', entity: 'User' },
  USER_DELETED: { action: 'DELETED', entity: 'User' },
  USER_RESTORED: { action: 'RESTORED', entity: 'User' },
  PASSWORD_RESET: { action: 'PASSWORD_RESET', entity: 'User' },
  SESSION_REVOKED: { action: 'SESSION_REVOKED', entity: 'Session' },
  VERIFICATION_RESENT: { action: 'VERIFICATION_RESENT', entity: 'User' },
} as const

export type AuditEventKey = keyof typeof AuditEvent
