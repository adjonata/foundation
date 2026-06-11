<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <div class="max-w-4xl mx-auto py-10 px-4 space-y-6">
    <OrganismsUsuarioProfileCard v-if="authStore.user" :user="authStore.user" />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <OrganismsUsuarioProfileForm v-if="authStore.user" />

      <UCard>
        <template #header>
          <h2 class="font-semibold text-highlighted">Segurança</h2>
        </template>
        <div class="space-y-3">
          <p class="text-sm text-muted">
            Gerencie sua senha e as sessões ativas da sua conta.
          </p>
          <UButton to="/usuario/seguranca" variant="outline" icon="i-lucide-shield" block>
            Alterar senha e sessões
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
