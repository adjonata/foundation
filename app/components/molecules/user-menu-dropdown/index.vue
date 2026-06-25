<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  contextItems?: DropdownMenuItem[]
}>()

const authStore = useAuthStore()

const items = computed<DropdownMenuItem[][]>(() => {
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
        label: 'Meu perfil',
        icon: 'i-lucide-user',
        to: '/usuario',
      },
    ],
  ]

  if (props.contextItems?.length) {
    blocks.push(props.contextItems)
  }

  blocks.push([
    {
      label: 'Sair',
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: () => void handleLogout(),
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
  <UDropdownMenu :items="items">
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
