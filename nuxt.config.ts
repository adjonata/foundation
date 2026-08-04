import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    '#shared': resolve(rootDir, 'shared'),
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
  },

  modules: ['@sentry/nuxt/module', '@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', '@nuxt/icon', '@vueuse/nuxt'],

  runtimeConfig: {
    public: {
      appName: 'Foundation',
      sentry: {
        dsn: process.env.NUXT_PUBLIC_SENTRY_DSN, // Use a public environment variable for the DSN
      },
    },
  },

  sentry: {
    org: 'foundation-5v',
    project: 'foundation',
    // store your auth token in an environment variable
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },

  sourcemap: { client: 'hidden' },

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/auth/login': { redirect: '/entrar' },
    '/auth/register': { redirect: '/cadastrar' },
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },
})
