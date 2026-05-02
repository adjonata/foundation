import { setPrivateNoStoreHeaders } from '../utils/cacheHeaders'

/**
 * Prefixos de rota em que NAO aplicamos o padrao (defina headers na propria rota, ex.: cache publico).
 */
const API_CACHE_OPT_OUT_PREFIXES: string[] = [
  // '/api/public/',
]

export default defineEventHandler((event) => {
  const path = event.path
  if (!path.startsWith('/api')) return

  if (API_CACHE_OPT_OUT_PREFIXES.some((prefix) => path.startsWith(prefix))) return

  setPrivateNoStoreHeaders(event)
})
