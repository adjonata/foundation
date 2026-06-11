import { useAdminApi } from './api/modules/admin'
import { useAuthApi } from './api/modules/auth'
import { useUserApi } from './api/modules/user'

/** Ponto unico de acesso aos modulos da API no frontend. */
export function useApi() {
  return {
    auth: useAuthApi(),
    admin: useAdminApi(),
    user: useUserApi(),
  }
}
