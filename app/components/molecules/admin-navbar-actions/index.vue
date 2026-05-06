<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { getRoleDisplayLabel } from '#shared/utils/roleDisplay'

const authStore = useAuthStore()
const roleLabel = computed(() => getRoleDisplayLabel(authStore.role))

const userMenuItems = computed<DropdownMenuItem[][]>(() => {
  const u = authStore.user
  if (!u) return []

  return [
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
    [
      {
        label: 'Página inicial',
        icon: 'i-lucide-home',
        to: '/',
      },
    ],
    [
      {
        label: 'Sair',
        icon: 'i-lucide-log-out',
        color: 'error',
        onSelect: () => {
          void handleLogout()
        },
      },
    ],
  ]
})

async function handleLogout() {
  await authStore.logout()
  await navigateTo('/entrar')
}
</script>

<template>
  <div class="flex items-center gap-1.5">
    <UColorModeButton size="sm" color="neutral" variant="ghost" square aria-label="Alternar entre tema claro e escuro">
      <template #fallback>
        <UButton size="sm" square loading variant="ghost" color="neutral" aria-hidden="true" />
      </template>
    </UColorModeButton>

    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-shield-check"
      to="/admin"
      :aria-label="`Papel: ${roleLabel}`"
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
        <span class="max-w-32 truncate sm:max-w-48">
          {{ authStore.user?.name?.trim() || authStore.user?.email }}
        </span>
      </UButton>
    </UDropdownMenu>
  </div>
</template>
