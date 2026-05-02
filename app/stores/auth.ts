import type { AuthUser } from "#shared/types/user";
import type { LoginPayload, RegisterPayload } from "~/composables/api/modules/auth";

export const useAuthStore = defineStore("auth", () => {
  const api = useApi();

  const user = ref<AuthUser | null>(null);
  /** Indica se o fetchMe() ja foi executado ao menos uma vez (com sucesso ou falha). */
  const sessionChecked = ref(false);

  const isAuthenticated = computed(() => user.value !== null);
  /** Papel do utilizador autenticado; `null` quando anonimo. */
  const role = computed(() => user.value?.role ?? null);

  function clearSession() {
    user.value = null;
  }

  /** GET /api/auth/me — hidrata o utilizador apos recarregar ou no primeiro acesso. */
  async function fetchMe() {
    try {
      const res = await api.auth.me();
      user.value = res;
    } catch {
      clearSession();
    } finally {
      sessionChecked.value = true;
    }
  }

  /** Faz apenas uma tentativa de hidratar sessao (middleware / layout). */
  async function ensureSession() {
    if (sessionChecked.value) return;
    await fetchMe();
  }

  async function login(body: LoginPayload) {
    const res = await api.auth.login(body);
    user.value = res;
    sessionChecked.value = true;
  }

  async function register(body: RegisterPayload) {
    const res = await api.auth.register(body);
    user.value = res;
    sessionChecked.value = true;
  }

  async function logout() {
    try {
      await api.auth.logout();
    } catch {
      // Sessao ja invalida no servidor
    } finally {
      clearSession();
      sessionChecked.value = true;
    }
  }
  return {
    user,
    sessionChecked,
    isAuthenticated,
    role,
    fetchMe,
    ensureSession,
    login,
    register,
    logout,
    clearSession,
  };
});
