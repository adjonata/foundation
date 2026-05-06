<template>
  <UPage>
    <UPageHeader
      headline="Sessões"
      title="Sessões ativas"
      description="Esta secção será preenchida com a listagem de sessões e revogação (ver roadmap)."
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
  title: computed(() => `Admin — Sessões — ${appName.value}`),
  description: 'Sessões ativas no painel admin.',
})
</script>
