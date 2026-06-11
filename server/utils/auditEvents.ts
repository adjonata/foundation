export const AuditEvent = {
  USER_REGISTERED: { action: 'REGISTERED', entity: 'User' },
  USER_LOGIN: { action: 'LOGIN', entity: 'User' },
  USER_LOGOUT: { action: 'LOGOUT', entity: 'User' },
  USER_ROLE_CHANGED: { action: 'ROLE_CHANGED', entity: 'User' },
  USER_DELETED: { action: 'DELETED', entity: 'User' },
  USER_RESTORED: { action: 'RESTORED', entity: 'User' },
  EMAIL_VERIFIED: { action: 'EMAIL_VERIFIED', entity: 'User' },
  VERIFICATION_RESENT: { action: 'VERIFICATION_RESENT', entity: 'User' },
  PASSWORD_RESET_REQUESTED: { action: 'PASSWORD_RESET_REQUESTED', entity: 'User' },
  PASSWORD_RESET: { action: 'PASSWORD_RESET', entity: 'User' },
  SESSION_REVOKED: { action: 'SESSION_REVOKED', entity: 'Session' },
  REFRESH_TOKEN_REUSE_DETECTED: { action: 'TOKEN_REUSE_DETECTED', entity: 'Session' },
  PROFILE_UPDATED: { action: 'PROFILE_UPDATED', entity: 'User' },
  PASSWORD_CHANGED: { action: 'PASSWORD_CHANGED', entity: 'User' },
} as const

export type AuditEventKey = keyof typeof AuditEvent
