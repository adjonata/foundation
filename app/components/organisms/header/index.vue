<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { isAdminPanelRole } from '#shared/constants/rbac'
import { getRoleDisplayLabel } from '#shared/utils/roleDisplay'

const config = useRuntimeConfig()
const appName = config.public.appName as string
const authStore = useAuthStore()

const showAdminLink = computed(() => authStore.isAuthenticated && isAdminPanelRole(authStore.role))

const roleLabel = computed(() => getRoleDisplayLabel(authStore.role))

const userMenuItems = computed<DropdownMenuItem[][]>(() => {
  const u = authStore.user
  if (!u) return []

  const blocks: DropdownMenuItem[][] = [
    [
      {
        type: 'label',
        label: u.name?.trim() || u.email,
        description: u.name?.trim() ? u.email : undefined,
      },
    ],
    [
      {
        type: 'label',
        label: 'Papel',
        description: roleLabel.value,
      },
    ],
  ]

  if (showAdminLink.value) {
    blocks.push([
      {
        label: 'Painel admin',
        icon: 'i-lucide-layout-dashboard',
        to: '/admin',
      },
    ])
  }

  blocks.push([
    {
      label: 'Sair',
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: () => {
        void handleLogout()
      },
    },
  ])

  return blocks
})

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
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-shield-check"
            :to="showAdminLink ? '/admin' : undefined"
            :disabled="!showAdminLink"
            :aria-label="
              showAdminLink
                ? `Abrir painel admin (${roleLabel})`
                : `Papel na conta: ${roleLabel}. Sem acesso ao painel admin.`
            "
          >
            {{ roleLabel }}
          </UButton>
          <UDropdownMenu :items="userMenuItems">
            <UButton
              color="neutral"
              variant="ghost"
              trailing-icon="i-lucide-chevron-down"
              :aria-label="`Menu da conta de ${authStore.user?.email ?? 'utilizador'}`"
            >
              <span class="max-w-40 truncate sm:max-w-56">
                {{ authStore.user?.name?.trim() || authStore.user?.email }}
              </span>
            </UButton>
          </UDropdownMenu>
        </template>
        <template v-else>
          <UButton color="neutral" variant="ghost" to="/entrar"> Entrar </UButton>
          <UButton to="/cadastrar"> Criar conta </UButton>
        </template>
      </div>
    </div>
  </header>
</template>
