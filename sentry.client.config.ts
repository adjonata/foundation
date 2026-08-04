import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: useRuntimeConfig().public.sentry.dsn,

  // Tracing — captura 100% das transações; reduza em produção
  tracesSampleRate: 0.6,

  // Session Replay — grava 10% das sessões normais e 100% das sessões com erro
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 0.6,

  // Logs
  enableLogs: true,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.piniaIntegration(usePinia(), {
      attachPiniaState: true,
      addBreadcrumbs: true,
      // Use stateTransformer para remover campos sensíveis antes do envio:
      // stateTransformer: (state) => ({ ...state, auth: { ...state.auth, token: null } }),
    }),
  ],
})
