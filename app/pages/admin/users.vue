<template>
  <TemplatesAdminUsers />
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName as string)

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useSeoMeta({
  title: computed(() => `Admin — Utilizadores — ${appName.value}`),
  description: 'Gestão de utilizadores no painel admin.',
})
</script>
