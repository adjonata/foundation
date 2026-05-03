<script setup lang="ts">
import type { BadgeProps } from '@nuxt/ui'
import { getRoleBadgeColor, getRoleDisplayLabel } from '#shared/utils/roleDisplay'

const props = withDefaults(
  defineProps<{
    /** Valor do enum `Role` (ex.: `ADMIN`). */
    role: string
    /** Mostra o identificador técnico ao lado (útil em listagens admin). */
    showCode?: boolean
    variant?: BadgeProps['variant']
  }>(),
  {
    showCode: false,
    variant: 'subtle',
  },
)

const label = computed(() => getRoleDisplayLabel(props.role))
const color = computed(() => getRoleBadgeColor(props.role))
</script>

<template>
  <span class="inline-flex flex-wrap items-center gap-2">
    <UBadge :color="color" :variant="variant">
      {{ label }}
    </UBadge>
    <span v-if="showCode" class="font-mono text-xs text-muted">
      {{ role }}
    </span>
  </span>
</template>
