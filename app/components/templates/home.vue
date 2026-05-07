<script setup lang="ts">
import { isAdminPanelRole } from '#shared/constants/rbac'

const config = useRuntimeConfig()
const appName = config.public.appName as string
const authStore = useAuthStore()
const showAdminLinks = computed(() => authStore.isAuthenticated && isAdminPanelRole(authStore.role))
</script>

<template>
  <div
    class="w-full bg-linear-to-b from-editorial-100/80 via-transparent to-editorial-50/30 pb-16 dark:from-editorial-900/50 dark:via-transparent dark:to-editorial-950/40"
  >
    <div class="mx-auto max-w-5xl px-4 pt-10 md:pt-14">
      <OrganismsHomeDemoHero :app-name="appName" />

      <div class="mt-16 space-y-10 md:mt-20 md:space-y-12">
        <OrganismsHomeDemoAuth />
        <OrganismsHomeDemoRbac />

        <section aria-labelledby="sec-admin-heading">
          <OrganismsHomeDemoSectionHeading
            heading-id="sec-admin-heading"
            title="Sessão admin"
            subtitle="Acesso rápido às áreas de gestão e monitorização."
            icon="i-lucide-layout-dashboard"
            tone="ember"
          />
          <UCard class="p-6 md:p-8">
            <p class="text-sm leading-relaxed text-muted">
              O painel administrativo já inclui gestão de utilizadores (com alteração de papel), catálogo RBAC e sessões
              ativas com ação de revogação.
            </p>
            <div class="mt-5 flex flex-wrap gap-3">
              <UButton to="/admin" color="primary" variant="soft" trailing-icon="i-lucide-arrow-right">
                Admin: visão geral
              </UButton>
              <UButton to="/admin/users" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right">
                Admin: utilizadores
              </UButton>
              <UButton to="/admin/sessions" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right">
                Admin: sessões
              </UButton>
            </div>
            <UAlert
              v-if="!showAdminLinks"
              class="mt-5"
              color="neutral"
              variant="subtle"
              icon="i-lucide-info"
              title="Acesso controlado por permissão"
              description="Estas rotas exigem sessão autenticada com papel autorizado para o painel admin."
            />
          </UCard>
        </section>

        <OrganismsHomeDemoStackFooter />
      </div>
    </div>
  </div>
</template>
