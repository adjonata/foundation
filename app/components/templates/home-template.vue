<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName as string
const authStore = useAuthStore()
</script>

<template>
  <div
    class="w-full bg-linear-to-b from-editorial-100/80 via-transparent to-editorial-50/30 pb-16 dark:from-editorial-900/50 dark:via-transparent dark:to-editorial-950/40"
  >
    <div class="mx-auto max-w-5xl px-4 pt-10 md:pt-14">
      <OrganismsHomeDemoHero :app-name="appName" />

      <div class="mt-16 space-y-10 md:mt-20 md:space-y-12">
        <OrganismsHomeDemoAuth />
        <OrganismsHomeDemoSession :is-authenticated="authStore.isAuthenticated" />
        <OrganismsHomeDemoRbac />
        <OrganismsHomeDemoStackFooter />
      </div>
    </div>
  </div>
</template>
