<template>
  <TemplatesVerificarEmail />
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName as string)

useSeoMeta({
  title: computed(() => `Verificar e-mail — ${appName.value}`),
})
</script>
