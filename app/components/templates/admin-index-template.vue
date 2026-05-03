<script setup lang="ts">
import type { AdminPermission, AdminRoleWithPermissions } from '#shared/types/admin'

const api = useApi()
const { $toast } = useNuxtApp()

const permissions = ref<AdminPermission[]>([])
const roles = ref<AdminRoleWithPermissions[]>([])
const loading = ref(true)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  errorMessage.value = null
  try {
    const [p, r] = await Promise.all([api.admin.listPermissions(), api.admin.listRolesWithPermissions()])
    permissions.value = p
    roles.value = r
  } catch (error: unknown) {
    errorMessage.value = getFetchErrorMessage(error)
    $toast.add({
      title: 'Erro ao carregar painel',
      description: errorMessage.value,
      color: 'error'
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-8 md:py-10">
    <header class="mb-8 space-y-2">
      <p class="text-xs font-semibold uppercase tracking-wider text-wine-700 dark:text-wine-400">
        Administração
      </p>
      <h1 class="text-2xl font-bold text-highlighted md:text-3xl">
        Permissões e papéis
      </h1>
      <p class="max-w-2xl text-sm text-muted">
        Leitura do catálogo RBAC no servidor. A autorização efetiva continua definida em código (
        <code class="rounded bg-elevated px-1 py-0.5 text-xs">ROLE_PERMISSIONS</code>); esta vista reflete o que está na
        base após o seed.
      </p>
    </header>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      title="Não foi possível carregar os dados"
      :description="errorMessage"
      icon="i-lucide-alert-circle"
      class="mb-8"
    />

    <div class="space-y-8">
      <OrganismsAdminPermissionsTable
        :rows="permissions"
        :loading="loading"
      />
      <OrganismsAdminRolesMatrix
        :rows="roles"
        :loading="loading"
      />
    </div>
  </div>
</template>
