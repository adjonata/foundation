<template>
  <div class="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-4xl items-center px-4 py-8">
    <UCard class="w-full">
      <template #header>
        <div class="space-y-1">
          <h1 class="text-xl font-semibold text-highlighted">Área autenticada de teste</h1>
          <p class="text-sm text-muted">Esta página valida o fluxo de login e mostra os dados atuais da sessão.</p>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <UBadge color="success" variant="subtle">Sessão autenticada</UBadge>
          <span class="text-sm text-muted">Middleware `auth` ativo nesta rota.</span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <UButton :loading="loadingMe" icon="i-lucide-refresh-cw" @click="handleGetMe">
            Buscar sessão (GET /api/auth/me)
          </UButton>
          <span v-if="lastMeAt" class="text-xs text-muted">Última atualização: {{ lastMeAt }}</span>
        </div>

        <div class="space-y-2">
          <p class="text-sm text-muted">Dados da seção (sessão do utilizador):</p>
          <pre class="overflow-x-auto rounded-md border border-default bg-elevated/40 p-3 text-xs">{{
            userData
          }}</pre>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName as string)
const { $toast } = useNuxtApp()

definePageMeta({
  middleware: 'auth',
})

useSeoMeta({
  title: computed(() => `Teste de sessão — ${appName.value}`),
})

const loadingMe = ref(false)
const lastMeAt = ref('')

async function handleGetMe() {
  loadingMe.value = true
  try {
    await authStore.fetchMe()
    lastMeAt.value = new Date().toLocaleString('pt-BR')
    $toast.add({
      title: 'Sessão atualizada',
      description: 'Dados carregados com sucesso via GET /api/auth/me',
      color: 'success',
    })
  } finally {
    loadingMe.value = false
  }
}

const userData = computed(() => JSON.stringify(authStore.user, null, 2))
</script>
