<template>
  <TemplatesAdminAuditLogs />
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName as string)

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useSeoMeta({
  title: computed(() => `Admin — Auditoria — ${appName.value}`),
  description: 'Registos de auditoria no painel admin.',
})
</script>
