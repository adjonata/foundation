<script setup lang="ts">
import type { AuthUser } from '#shared/types/user'

const props = defineProps<{
  user: AuthUser
}>()

const initials = computed(() =>
  (props.user.name ?? props.user.email)
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join(''),
)
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl border border-default bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-8"
  >
    <div class="absolute -top-16 -right-16 size-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

    <div class="relative flex items-center gap-6">
      <!-- Avatar com overlay de edição -->
      <NuxtLink to="/usuario/avatar" class="relative group shrink-0">
        <div
          class="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg transition-transform group-hover:scale-105"
        >
          <img
            v-if="user.avatarUrl"
            :src="user.avatarUrl"
            :alt="user.name ?? 'Avatar'"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary"
          >
            {{ initials }}
          </div>
        </div>
        <div
          class="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <UIcon name="i-lucide-camera" class="text-white size-5" />
        </div>
      </NuxtLink>

      <!-- Informações -->
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-bold text-highlighted truncate">{{ user.name ?? '—' }}</h1>
        <p class="text-muted truncate">{{ user.email }}</p>
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <AtomsRoleBadge :role="user.role" />
          <UBadge
            v-if="user.emailVerified"
            color="success"
            variant="subtle"
            icon="i-lucide-check-circle"
            size="sm"
          >
            E-mail verificado
          </UBadge>
          <UBadge v-else color="warning" variant="subtle" icon="i-lucide-alert-circle" size="sm">
            E-mail não verificado
          </UBadge>
        </div>
      </div>
    </div>
  </div>
</template>
