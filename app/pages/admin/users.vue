<template>
  <UPage>
    <UPageHeader
      headline="Utilizadores"
      title="Gestão de utilizadores"
      description="Esta secção será preenchida com a tabela de utilizadores, busca e alteração de papel (ver roadmap)."
    />
    <UPageBody>
      <UCard class="p-6">
        <p class="text-sm text-muted">Em breve.</p>
      </UCard>
    </UPageBody>
  </UPage>
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
