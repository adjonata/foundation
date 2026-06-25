<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'

withDefaults(
  defineProps<{
    src?: string | null
    name?: string | null
    size?: AvatarProps['size']
  }>(),
  { size: 'md' },
)
</script>

<template>
  <UAvatar :src="src ?? undefined" :alt="name ?? 'Avatar'" :size="size" />
</template>
