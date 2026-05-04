<script setup lang="ts">
import type { AdminPermission } from '#shared/types/admin'

const api = useApi()
const { $toast } = useNuxtApp()

const rows = ref<AdminPermission[]>([])
const loading = ref(true)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  errorMessage.value = null
  try {
    rows.value = await api.admin.listPermissions()
  } catch (error: unknown) {
    errorMessage.value = getFetchErrorMessage(error)
    $toast.add({
      title: 'Erro ao carregar permissões',
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
      title="Não foi possível carregar as permissões"
      :description="errorMessage"
      icon="i-lucide-alert-circle"
    />
    <OrganismsAdminPermissionsTable :rows="rows" :loading="loading" />
  </div>
</template>
