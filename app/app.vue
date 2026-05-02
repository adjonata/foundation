<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName as string

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  htmlAttrs: {
    lang: 'pt-BR',
  },
})

useSeoMeta({
  title: appName,
  description: 'Template base para aplicações full-stack com autenticação completa, RBAC e painel admin.',
})
</script>

<template>
  <UApp>
    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
