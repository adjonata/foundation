<template>
  <TemplatesEsqueciSenha />
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const config = useRuntimeConfig()
const appName = computed(() => config.public.appName as string)

useSeoMeta({
  title: computed(() => `Esqueci minha senha — ${appName.value}`),
})
</script>
