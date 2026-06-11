<script setup lang="ts">
</script>

<template>
  <div class="max-w-2xl mx-auto py-10 px-4 space-y-6">
    <div class="flex items-center gap-3">
      <UButton variant="ghost" icon="i-lucide-arrow-left" size="sm" to="/usuario" />
      <div>
        <h1 class="text-2xl font-semibold text-highlighted">Segurança</h1>
        <p class="text-sm text-muted">Gerencie sua senha e sessões ativas.</p>
      </div>
    </div>

    <OrganismsUsuarioChangePasswordForm />

    <OrganismsUsuarioSessionsList />
  </div>
</template>
