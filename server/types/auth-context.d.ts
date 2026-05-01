declare module 'h3' {
  interface H3EventContext {
    auth?: {
      userId: number
      role: string
      sessionId: string
    }
  }
}

export {}
