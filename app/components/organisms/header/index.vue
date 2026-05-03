<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName as string
const authStore = useAuthStore()
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')
const logoSrc = computed(() => (isDark.value ? '/logo-white.svg' : '/logo.svg'))
const headerClass = computed(() =>
  isDark.value
    ? 'border-b border-editorial-800 bg-editorial-950 text-editorial-100'
    : 'border-b border-editorial-200 bg-editorial-50 text-editorial-950',
)

async function handleLogout() {
  await authStore.logout()
  await navigateTo('/entrar')
}
</script>

<template>
  <header :class="headerClass">
    <div class="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
      <NuxtLink to="/" class="inline-flex items-center hover:opacity-80" :aria-label="`Voltar para ${appName}`">
        <img :src="logoSrc" :alt="appName" class="h-7 w-auto" />
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
