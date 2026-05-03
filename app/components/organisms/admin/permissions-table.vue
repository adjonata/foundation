<script setup lang="ts">
import type { AdminPermission } from '#shared/types/admin'

defineProps<{
  rows: AdminPermission[]
  loading: boolean
}>()
</script>

<template>
  <UCard>
    <template #header>
      <div class="space-y-1">
        <h2 class="text-lg font-semibold text-highlighted">
          Permissões
        </h2>
        <p class="text-sm text-muted">
          Catálogo persistido (tabela <code class="text-xs">Permission</code>).
        </p>
      </div>
    </template>

    <div
      v-if="loading"
      class="flex justify-center py-10"
    >
      <Icon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-muted"
      />
    </div>

    <div
      v-else
      class="overflow-x-auto"
    >
      <table class="w-full min-w-[32rem] text-left text-sm">
        <thead class="border-b border-default text-muted">
          <tr>
            <th class="pb-2 pr-4 font-medium">
              Nome
            </th>
            <th class="pb-2 font-medium">
              Descrição
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="border-b border-default/60 last:border-0"
          >
            <td class="py-2 pr-4 align-top font-mono text-xs text-highlighted">
              {{ row.name }}
            </td>
            <td class="py-2 align-top text-muted">
              {{ row.description ?? '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UCard>
</template>
