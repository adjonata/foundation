<template>
  <templates-teste-auth-template />
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName as string)

definePageMeta({
  middleware: 'auth',
})

useSeoMeta({
  title: computed(() => `Teste de sessão — ${appName.value}`),
})
</script>
