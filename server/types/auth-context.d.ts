declare module 'h3' {
  interface H3EventContext {
    auth?: {
      userId: number
      role: string
      organizationId: number | null
      sessionId: string
    }
  }
}

export {}
