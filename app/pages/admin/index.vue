<template>
  <TemplatesAdminIndexTemplate />
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName as string)

definePageMeta({
  middleware: ['auth', 'admin']
})

useSeoMeta({
  title: computed(() => `Admin — ${appName.value}`),
  description: 'Permissões e papéis do sistema (catálogo RBAC).'
})
</script>
