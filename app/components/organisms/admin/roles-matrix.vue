<script setup lang="ts">
import type { AdminRoleWithPermissions } from '#shared/types/admin'

defineProps<{
  rows: AdminRoleWithPermissions[]
  loading: boolean
}>()
</script>

<template>
  <UCard>
    <template #header>
      <div class="space-y-1">
        <h2 class="text-lg font-semibold text-highlighted">Papéis e permissões</h2>
        <p class="text-sm text-muted">Vínculos <code class="text-xs">RolePermission</code> por papel.</p>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-10">
      <Icon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
    </div>

    <ul v-else class="space-y-6">
      <li v-for="entry in rows" :key="entry.role" class="rounded-lg border border-default bg-elevated/30 p-4">
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <AtomsRoleBadge :role="entry.role" show-code />
        </div>
        <ul v-if="entry.permissions.length" class="space-y-1.5 text-sm text-muted">
          <li
            v-for="p in entry.permissions"
            :key="`${entry.role}-${p.name}`"
            class="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2"
          >
            <span class="font-mono text-xs text-highlighted">{{ p.name }}</span>
            <span class="text-xs sm:text-sm">{{ p.description ?? '—' }}</span>
          </li>
        </ul>
        <p v-else class="text-sm text-muted">Sem permissões associadas neste catálogo.</p>
      </li>
    </ul>
  </UCard>
</template>
