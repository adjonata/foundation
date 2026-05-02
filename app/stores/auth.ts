import type { AuthUser } from "#shared/types/user";

export const useAuthStore = defineStore("auth", () => {
  // During SSR, $fetch to /api does not forward cookies by itself; we forward the incoming request Cookie header.
  // In the browser, `credentials: 'include'` is enough — forwardedCookies stays undefined.
  const forwardedCookies = import.meta.server
    ? useRequestHeaders(["cookie"])
    : undefined;

  const user = ref<AuthUser | null>(null);
  /** Whether fetchMe() has run at least once (success or failure). */
  const sessionChecked = ref(false);

  const isAuthenticated = computed(() => user.value !== null);
  /** Signed-in user role; `null` when anonymous. */
  const role = computed(() => user.value?.role ?? null);

  function clearSession() {
    user.value = null;
  }

  /**
   * SSR only: forwards the incoming `Cookie` header to `$fetch` (Nitro does not send cookies by default).
   * Browser: optional extra headers only.
   * Spread the result into `$fetch`: `{ credentials: 'include', ...apiHeaders() }`.
   */
  function apiHeaders(extra?: HeadersInit): { headers?: HeadersInit } {
    const onServer = import.meta.server;
    const forwardCookie = onServer && Boolean(forwardedCookies?.cookie);

    if (forwardCookie) {
      const merged: Record<string, string> = {
        ...forwardedCookies,
        ...(extra && typeof extra === "object" && !Array.isArray(extra)
          ? (extra as Record<string, string>)
          : {}),
      };
      return { headers: merged };
    }

    if (extra !== undefined) return { headers: extra };
    return {};
  }

  /** GET /api/auth/me — hydrate user after reload or first visit. */
  async function fetchMe() {
    try {
      const res = await $fetch("/api/auth/me", {
        credentials: "include",
        ...apiHeaders(),
      });
      user.value = res;
    } catch {
      clearSession();
    } finally {
      sessionChecked.value = true;
    }
  }

  /** Single attempt to hydrate session (middleware / layout). */
  async function ensureSession() {
    if (sessionChecked.value) return;
    await fetchMe();
  }

  async function login(body: { email: string; password: string }) {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body,
      credentials: "include",
      ...apiHeaders(),
    });
    user.value = res.user;
    sessionChecked.value = true;
  }

  async function register(body: {
    name: string;
    email: string;
    password: string;
  }) {
    const res = await $fetch("/api/auth/register", {
      method: "POST",
      body,
      credentials: "include",
      ...apiHeaders(),
    });
    user.value = res.user;
    sessionChecked.value = true;
  }

  async function logout() {
    try {
      await $fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        ...apiHeaders(),
      });
    } catch {
      // Session already invalid on the server
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
