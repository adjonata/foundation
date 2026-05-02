import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    '#shared': resolve(rootDir, 'shared'),
  },

  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],

  runtimeConfig: {
    public: {
      appName: 'foundation',
    },
  },

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
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
