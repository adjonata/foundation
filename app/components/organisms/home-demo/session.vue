<script setup lang="ts">
defineProps<{
  isAuthenticated: boolean
}>()
</script>

<template>
  <section aria-labelledby="sec-session-heading">
    <OrganismsHomeDemoSectionHeading
      heading-id="sec-session-heading"
      title="Sessão e utilizador"
      icon="i-lucide-fingerprint"
      tone="ember"
    >
      <template #subtitle> Middleware <code class="text-xs">auth</code> e dados da conta. </template>
    </OrganismsHomeDemoSectionHeading>
    <UCard class="p-6 md:p-8">
      <template v-if="isAuthenticated">
        <p class="text-sm leading-relaxed text-muted">
          Está com sessão ativa. Na página de teste pode forçar
          <code class="rounded bg-elevated px-1.5 py-0.5 text-xs">GET /api/auth/me</code> e ver o JSON do utilizador
          sanitizado.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <UButton to="/teste-auth" color="primary" icon="i-lucide-flask-conical" size="lg">
            Abrir demonstração de sessão
          </UButton>
        </div>
      </template>
      <template v-else>
        <UAlert
          color="neutral"
          variant="subtle"
          title="Sem sessão iniciada"
          description="Inicie sessão para aceder à rota protegida e ver o fluxo completo (middleware auth + API)."
          icon="i-lucide-info"
        />
        <div class="mt-6">
          <UButton to="/entrar" color="primary" icon="i-lucide-log-in"> Ir para o login </UButton>
        </div>
      </template>
    </UCard>
  </section>
</template>
