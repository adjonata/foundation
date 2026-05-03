<template>
  <TemplatesHomeTemplate />
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName as string)

useSeoMeta({
  title: computed(() => `${appName.value} — demonstração do template`),
  description: 'Visão geral das funcionalidades: autenticação, sessão, RBAC no servidor e stack Nuxt 4 com Nuxt UI.',
})
</script>
