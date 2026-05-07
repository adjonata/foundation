<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => {
  const p = route.path
  return [
    {
      label: 'Catálogo RBAC',
      icon: 'i-lucide-shield-check',
      to: '/admin',
      tooltip: { text: 'Permissões e papéis na base' },
      active: p === '/admin',
    },
    {
      label: 'Utilizadores',
      icon: 'i-lucide-users',
      to: '/admin/users',
      tooltip: { text: 'Gestão de contas' },
      active: p === '/admin/users' || p.startsWith('/admin/users/'),
    },
    {
      label: 'Sessões',
      icon: 'i-lucide-key-round',
      to: '/admin/sessions',
      tooltip: { text: 'Sessões ativas e revogação' },
      active: p === '/admin/sessions' || p.startsWith('/admin/sessions/'),
    },
  ]
})
</script>

<template>
  <UNavigationMenu
    :collapsed="collapsed"
    orientation="vertical"
    highlight
    highlight-color="primary"
    class="data-[orientation=vertical]:w-full"
    :items="items"
  />
</template>
