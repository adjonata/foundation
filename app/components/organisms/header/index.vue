<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName as string
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  await navigateTo('/entrar')
}
</script>

<template>
  <header
    class="border-b border-editorial-200 bg-editorial-50 text-editorial-950 dark:border-editorial-800 dark:bg-editorial-950 dark:text-editorial-100"
  >
    <div class="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
      <NuxtLink to="/" class="inline-flex items-center hover:opacity-80" :aria-label="`Voltar para ${appName}`">
        <img src="/logo.svg" :alt="appName" class="h-[42px] w-auto dark:hidden" />
        <img src="/logo-white.svg" :alt="appName" class="hidden h-[42px] w-auto dark:block" />
      </NuxtLink>

      <div class="flex items-center gap-2">
        <UColorModeButton
          size="sm"
          color="neutral"
          variant="ghost"
          square
          aria-label="Alternar entre tema claro e escuro"
        >
          <template #fallback>
            <UButton size="sm" square loading variant="ghost" color="neutral" aria-hidden="true" />
          </template>
        </UColorModeButton>

        <template v-if="authStore.isAuthenticated">
          <UButton color="neutral" variant="ghost" @click="handleLogout"> Sair </UButton>
        </template>
        <template v-else>
          <UButton color="neutral" variant="ghost" to="/entrar"> Entrar </UButton>
          <UButton to="/cadastrar"> Criar conta </UButton>
        </template>
      </div>
    </div>
  </header>
</template>
