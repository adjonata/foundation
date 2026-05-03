<template>
  <templates-entrar-template />
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName as string)

definePageMeta({
  middleware: 'guest',
})

useSeoMeta({
  title: computed(() => `Entrar — ${appName.value}`),
})
</script>
