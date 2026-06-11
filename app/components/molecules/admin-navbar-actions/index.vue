<script setup lang="ts">
import { getRoleDisplayLabel } from '#shared/utils/roleDisplay'

const authStore = useAuthStore()
const roleLabel = computed(() => getRoleDisplayLabel(authStore.role))

const homeContextItem = [{ label: 'Página inicial', icon: 'i-lucide-home', to: '/' }]
</script>

<template>
  <div class="flex items-center gap-1.5">
    <UColorModeButton size="sm" color="neutral" variant="ghost" square aria-label="Alternar entre tema claro e escuro">
      <template #fallback>
        <UButton size="sm" square loading variant="ghost" color="neutral" aria-hidden="true" />
      </template>
    </UColorModeButton>

    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-shield-check"
      to="/admin"
      :aria-label="`Papel: ${roleLabel}`"
    >
      {{ roleLabel }}
    </UButton>

    <MoleculesUserMenuDropdown :context-items="homeContextItem" />
  </div>
</template>
