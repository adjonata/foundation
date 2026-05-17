<template>
  <div class="flex min-h-screen flex-col">
    <OrganismsHeader />
    <UAlert
      v-if="authStore.sessionChecked && authStore.isAuthenticated && authStore.user && !authStore.user.emailVerified"
      color="warning"
      variant="subtle"
      title="E-mail não verificado"
      description="Verifique a sua caixa de entrada e clique no link de confirmação para activar a conta."
      icon="i-lucide-mail-warning"
      :actions="[{ label: 'Reenviar verificação', to: '/verificar-email', color: 'warning', variant: 'outline' }]"
      :ui="{ root: 'rounded-none border-x-0 border-t-0' }"
    />
    <UMain class="flex-1">
      <slot />
    </UMain>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script>
