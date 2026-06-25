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
          class="inline-flex items-center hover:opacity-80"
          :aria-label="`Voltar à página inicial — ${appName}`"
        >
          <img src="/logo.svg" :alt="appName" class="h-[42px] w-auto dark:hidden" />
          <img src="/logo-white.svg" :alt="appName" class="hidden h-[42px] w-auto dark:block" />
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
