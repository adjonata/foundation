<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName as string
const route = useRoute()

const navbarTitle = computed(() => {
  if (route.path === '/admin') return 'Catálogo RBAC'
  if (route.path.startsWith('/admin/users')) return 'Utilizadores'
  if (route.path.startsWith('/admin/sessions')) return 'Sessões'
  return 'Administração'
})
</script>

<template>
  <UDashboardGroup storage-key="foundation-admin" unit="rem">
    <UDashboardSidebar collapsible resizable>
      <template #header="{ collapsed }">
        <NuxtLink
          v-if="!collapsed"
          to="/"
          class="truncate text-sm font-semibold text-highlighted"
          :aria-label="`Voltar à página inicial — ${appName}`"
        >
          {{ appName }}
        </NuxtLink>
        <UIcon v-else name="i-lucide-layout-dashboard" class="mx-auto size-5 text-primary" aria-hidden="true" />
      </template>

      <template #default="{ collapsed }">
        <OrganismsAdminNavigation :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel id="admin-panel">
      <template #header>
        <UDashboardNavbar :title="navbarTitle">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
          <template #right>
            <MoleculesAdminNavbarActions />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
