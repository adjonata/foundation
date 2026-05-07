<script setup lang="ts">
import type { AdminRoleWithPermissions } from '#shared/types/admin'

const api = useApi()
const { $toast } = useNuxtApp()

const rows = ref<AdminRoleWithPermissions[]>([])
const loading = ref(true)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  errorMessage.value = null
  try {
    rows.value = await api.admin.listRolesWithPermissions()
  } catch (error: unknown) {
    errorMessage.value = getFetchErrorMessage(error)
    $toast.add({
      title: 'Erro ao carregar papéis',
      description: errorMessage.value,
      color: 'error',
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-4">
    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      title="Não foi possível carregar os papéis"
      :description="errorMessage"
      icon="i-lucide-alert-circle"
    />
    <OrganismsAdminRolesMatrix :rows="rows" :loading="loading" />
  </div>
</template>
