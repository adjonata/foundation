<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName as string
const authStore = useAuthStore()

await authStore.ensureSession()

async function handleLogout() {
  await authStore.logout()
  await navigateTo('/entrar')
}

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  htmlAttrs: {
    lang: 'pt-BR',
  },
})

useSeoMeta({
  title: appName,
  description: 'Template base para aplicações full-stack com autenticação completa, RBAC e painel admin.',
})
</script>

<template>
  <UApp>
    <header class="border-b border-editorial-950 bg-editorial-950 text-wine-100">
      <div class="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <NuxtLink to="/" class="inline-flex items-center hover:opacity-80" :aria-label="`Voltar para ${appName}`">
          <img src="/logo-white.svg" :alt="appName" class="h-[42px] w-auto" />
        </NuxtLink>

        <div class="flex items-center gap-2">
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
    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
