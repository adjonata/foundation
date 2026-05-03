import { useAdminApi } from './api/modules/admin'
import { useAuthApi } from './api/modules/auth'

/** Ponto unico de acesso aos modulos da API no frontend. */
export function useApi() {
  return {
    auth: useAuthApi(),
    admin: useAdminApi(),
  }
}
