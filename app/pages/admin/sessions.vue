<template>
  <TemplatesAdminSessions />
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName as string)

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useSeoMeta({
  title: computed(() => `Admin — Sessões — ${appName.value}`),
  description: 'Sessões ativas no painel admin.',
})
</script>
