<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName as string
const authStore = useAuthStore()

const features = [
  {
    icon: 'i-lucide-shield-check',
    title: 'Autenticação Completa',
    description:
      'JWT com refresh token rotativo, verificação de e-mail, reset de senha, soft delete e controle total de sessão.',
    accent: 'wine',
  },
  {
    icon: 'i-lucide-key-round',
    title: 'RBAC Granular',
    description:
      'Papéis e permissões configuráveis com middleware de autorização por rota, sem precisar repetir código.',
    accent: 'ember',
  },
  {
    icon: 'i-lucide-layout-dashboard',
    title: 'Painel Admin',
    description:
      'Gestão de utilizadores, sessões ativas e catálogo de permissões — painel completo pronto para produção.',
    accent: 'wine',
  },
  {
    icon: 'i-lucide-image-plus',
    title: 'Upload de Arquivos',
    description:
      'Avatar via S3-compatible. MinIO em desenvolvimento, Cloudflare R2 em produção — mesma API, zero mudança.',
    accent: 'ember',
  },
  {
    icon: 'i-lucide-scroll-text',
    title: 'Audit Log',
    description:
      '12 eventos rastreados automaticamente: logins, alterações de papel, revogações de sessão e muito mais.',
    accent: 'wine',
  },
  {
    icon: 'i-lucide-user-cog',
    title: 'Configurações do Usuário',
    description:
      'Edição de perfil e senha com e-mails de segurança, gestão de sessões ativas e proteção em camadas.',
    accent: 'ember',
  },
]

const stack = [
  { name: 'Nuxt 4', icon: 'i-lucide-zap' },
  { name: 'Vue 3', icon: 'i-lucide-triangle' },
  { name: 'TypeScript', icon: 'i-lucide-code-2' },
  { name: 'Prisma', icon: 'i-lucide-database' },
  { name: 'PostgreSQL', icon: 'i-lucide-database-zap' },
  { name: 'Nuxt UI', icon: 'i-lucide-palette' },
  { name: 'Tailwind CSS 4', icon: 'i-lucide-wind' },
  { name: 'Zod', icon: 'i-lucide-check-circle-2' },
  { name: 'Argon2', icon: 'i-lucide-lock-keyhole' },
  { name: 'Jose (JWT)', icon: 'i-lucide-key-square' },
  { name: 'Pinia', icon: 'i-lucide-store' },
  { name: 'Resend', icon: 'i-lucide-send' },
]

const steps = [
  {
    number: '01',
    title: 'Clone e configure',
    description: 'Clone o repositório, configure as variáveis de ambiente e inicie o banco com `prisma migrate dev`.',
    icon: 'i-lucide-git-branch',
  },
  {
    number: '02',
    title: 'Personalize',
    description: 'Adapte as cores, o nome do app, os papéis RBAC e as rotas ao seu contexto de negócio.',
    icon: 'i-lucide-pencil-ruler',
  },
  {
    number: '03',
    title: 'Construa',
    description: 'Com auth, admin e segurança prontos, foque o que realmente importa: as features do seu produto.',
    icon: 'i-lucide-rocket',
  },
]
</script>

<template>
  <!-- ── HERO ─────────────────────────────────────────────────── -->
  <section class="relative overflow-hidden">
    <!-- Background radial gradients -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div
        class="absolute left-0 top-0 h-[700px] w-[700px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-wine-200/50 blur-[120px] dark:bg-wine-950/60"
      />
      <div
        class="absolute bottom-0 right-0 h-[600px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-ember-200/40 blur-[120px] dark:bg-ember-950/50"
      />
      <!-- Dot grid -->
      <div
        class="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style="background-image: radial-gradient(circle, #7a2e2e 1px, transparent 1px); background-size: 28px 28px"
      />
    </div>

    <div class="mx-auto max-w-5xl px-4 pb-24 pt-20 md:pb-32 md:pt-28 text-center">
      <!-- Badge pill -->
      <div
        class="mb-8 inline-flex items-center gap-2 rounded-full border border-wine-200 bg-wine-50 px-4 py-1.5 text-sm font-medium text-wine-700 dark:border-wine-800 dark:bg-wine-950/60 dark:text-wine-300"
      >
        <UIcon name="i-lucide-layers" class="size-3.5 shrink-0" />
        Open Source · Nuxt 4 · TypeScript · Production-ready
      </div>

      <!-- Headline -->
      <h1 class="text-5xl font-bold leading-tight tracking-tight text-highlighted md:text-7xl">
        A base que você<br />
        <span
          class="bg-linear-to-r from-wine-600 to-ember-500 bg-clip-text text-transparent dark:from-wine-400 dark:to-ember-400"
        >
          precisava para começar
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-muted">
        Template full-stack com autenticação completa, RBAC, painel admin, audit log e muito mais — tudo pronto para
        você focar no que realmente importa: o seu produto.
      </p>

      <!-- CTAs -->
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <UButton size="xl" to="/cadastrar" icon="i-lucide-user-plus" trailing-icon="i-lucide-arrow-right">
          Criar conta grátis
        </UButton>
        <UButton size="xl" variant="outline" to="/entrar" icon="i-lucide-log-in">
          Entrar
        </UButton>
      </div>

      <!-- Mock UI preview -->
      <div class="relative mt-20">
        <!-- Glow behind card -->
        <div
          class="absolute inset-x-10 top-4 h-full rounded-3xl bg-wine-200/50 blur-3xl dark:bg-wine-900/40"
        />

        <div
          class="relative overflow-hidden rounded-2xl border border-editorial-200 bg-white shadow-2xl dark:border-editorial-700 dark:bg-editorial-900"
        >
          <!-- Fake browser bar -->
          <div
            class="flex items-center gap-3 border-b border-editorial-100 bg-editorial-50 px-5 py-3 dark:border-editorial-800 dark:bg-editorial-800/80"
          >
            <div class="flex gap-1.5">
              <div class="h-3 w-3 rounded-full bg-rust-400" />
              <div class="h-3 w-3 rounded-full bg-ember-400" />
              <div class="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div
              class="flex flex-1 items-center gap-1.5 rounded-full bg-editorial-200 px-3 py-1 text-xs text-muted dark:bg-editorial-700"
            >
              <UIcon name="i-lucide-lock" class="size-3 shrink-0" />
              foundation.app/admin/users
            </div>
            <div class="flex items-center gap-2">
              <div class="h-6 w-6 rounded-full bg-wine-600 flex items-center justify-center">
                <span class="text-[10px] font-bold text-white">A</span>
              </div>
            </div>
          </div>

          <!-- Fake dashboard content -->
          <div class="flex">
            <!-- Fake sidebar -->
            <div
              class="hidden w-52 shrink-0 border-r border-editorial-100 bg-editorial-50 p-4 dark:border-editorial-800 dark:bg-editorial-800/50 md:block"
            >
              <div class="mb-4 flex items-center gap-2 px-2 text-sm font-semibold text-highlighted">
                <img src="/logo.svg" alt="Foundation" class="h-6 w-auto dark:hidden" />
                <img src="/logo-white.svg" alt="Foundation" class="hidden h-6 w-auto dark:block" />
              </div>
              <div class="space-y-1">
                <div
                  v-for="item in ['Visão geral', 'Utilizadores', 'Sessões', 'Audit Log', 'Permissões']"
                  :key="item"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
                  :class="
                    item === 'Utilizadores'
                      ? 'bg-wine-100 text-wine-700 font-medium dark:bg-wine-900/50 dark:text-wine-300'
                      : 'text-muted hover:bg-editorial-100 dark:hover:bg-editorial-700/50'
                  "
                >
                  <div class="size-1.5 rounded-full bg-current opacity-60" />
                  {{ item }}
                </div>
              </div>
            </div>

            <!-- Fake content area -->
            <div class="min-w-0 flex-1 p-5">
              <!-- Header row -->
              <div class="mb-5 flex items-center justify-between">
                <div>
                  <div class="text-sm font-semibold text-highlighted">Utilizadores</div>
                  <div class="text-xs text-muted">1 284 registos</div>
                </div>
                <div class="flex gap-2">
                  <div class="h-7 w-20 rounded-lg bg-editorial-100 dark:bg-editorial-700" />
                  <div class="h-7 w-28 rounded-lg bg-wine-600" />
                </div>
              </div>
              <!-- Fake table rows -->
              <div class="space-y-2">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="flex items-center gap-3 rounded-xl border border-editorial-100 bg-editorial-50/50 px-4 py-3 dark:border-editorial-700/50 dark:bg-editorial-800/30"
                >
                  <div
                    class="h-7 w-7 shrink-0 rounded-full"
                    :class="i % 2 === 0 ? 'bg-wine-200 dark:bg-wine-800' : 'bg-ember-200 dark:bg-ember-800'"
                  />
                  <div class="min-w-0 flex-1 space-y-1">
                    <div
                      class="h-2.5 rounded-full bg-editorial-200 dark:bg-editorial-600"
                      :style="{ width: `${55 + i * 12}%` }"
                    />
                    <div class="h-2 w-32 rounded-full bg-editorial-100 dark:bg-editorial-700" />
                  </div>
                  <div
                    class="h-5 w-16 rounded-full"
                    :class="
                      i === 1
                        ? 'bg-wine-100 dark:bg-wine-900/40'
                        : i === 2
                          ? 'bg-ember-100 dark:bg-ember-900/40'
                          : 'bg-editorial-100 dark:bg-editorial-700'
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating badges -->
        <div
          class="absolute -left-4 top-12 hidden items-center gap-2 rounded-xl border border-green-200 bg-white px-3 py-2 shadow-lg dark:border-green-800 dark:bg-editorial-900 md:flex"
        >
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <UIcon name="i-lucide-shield-check" class="size-3.5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div class="text-xs font-semibold text-highlighted">Auth segura</div>
            <div class="text-[10px] text-muted">JWT + Refresh rotativo</div>
          </div>
        </div>

        <div
          class="absolute -right-4 bottom-12 hidden items-center gap-2 rounded-xl border border-wine-200 bg-white px-3 py-2 shadow-lg dark:border-wine-800 dark:bg-editorial-900 md:flex"
        >
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-wine-100 dark:bg-wine-900/50">
            <UIcon name="i-lucide-scroll-text" class="size-3.5 text-wine-600 dark:text-wine-400" />
          </div>
          <div>
            <div class="text-xs font-semibold text-highlighted">Audit Log</div>
            <div class="text-[10px] text-muted">12 eventos rastreados</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── STATS STRIP ──────────────────────────────────────────── -->
  <div class="border-y border-editorial-100 bg-editorial-50 dark:border-editorial-800 dark:bg-editorial-900/30">
    <div class="mx-auto max-w-5xl px-4 py-10">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div
          v-for="stat in [
            { value: '10+', label: 'Funcionalidades prontas', icon: 'i-lucide-package' },
            { value: '5', label: 'Camadas de segurança', icon: 'i-lucide-shield' },
            { value: '12', label: 'Eventos de auditoria', icon: 'i-lucide-activity' },
            { value: '100%', label: 'TypeScript tipado', icon: 'i-lucide-code-2' },
          ]"
          :key="stat.value"
          class="text-center"
        >
          <div class="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-wine-100 dark:bg-wine-900/40">
            <UIcon :name="stat.icon" class="size-4 text-wine-600 dark:text-wine-400" />
          </div>
          <div class="text-2xl font-bold text-highlighted">{{ stat.value }}</div>
          <div class="mt-0.5 text-xs text-muted">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── FEATURES ─────────────────────────────────────────────── -->
  <section class="mx-auto max-w-5xl px-4 py-24">
    <div class="text-center">
      <div
        class="mb-4 inline-flex items-center gap-2 rounded-full border border-ember-200 bg-ember-50 px-3 py-1 text-xs font-medium text-ember-700 dark:border-ember-800 dark:bg-ember-950/40 dark:text-ember-300"
      >
        <UIcon name="i-lucide-sparkles" class="size-3" />
        Tudo incluso
      </div>
      <h2 class="text-3xl font-bold text-highlighted md:text-4xl">Tudo que você precisa, pronto para usar</h2>
      <p class="mx-auto mt-4 max-w-xl text-muted">
        Meses de boilerplate eliminados. Cada funcionalidade foi pensada para produção desde o primeiro dia.
      </p>
    </div>

    <div class="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="group relative overflow-hidden rounded-2xl border border-editorial-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-editorial-700 dark:bg-editorial-900"
      >
        <!-- Hover glow -->
        <div
          class="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
          :class="
            feature.accent === 'wine'
              ? 'bg-linear-to-br from-wine-50/60 to-transparent dark:from-wine-950/30'
              : 'bg-linear-to-br from-ember-50/60 to-transparent dark:from-ember-950/30'
          "
        />

        <div class="relative">
          <div
            class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
            :class="
              feature.accent === 'wine'
                ? 'bg-wine-100 dark:bg-wine-900/50'
                : 'bg-ember-100 dark:bg-ember-900/50'
            "
          >
            <UIcon
              :name="feature.icon"
              class="size-5"
              :class="
                feature.accent === 'wine'
                  ? 'text-wine-600 dark:text-wine-400'
                  : 'text-ember-600 dark:text-ember-400'
              "
            />
          </div>
          <h3 class="mb-2 font-semibold text-highlighted">{{ feature.title }}</h3>
          <p class="text-sm leading-relaxed text-muted">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── ARCHITECTURE ─────────────────────────────────────────── -->
  <section class="border-y border-editorial-100 bg-editorial-50 dark:border-editorial-800 dark:bg-editorial-900/20">
    <div class="mx-auto max-w-5xl px-4 py-24">
      <div class="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
        <!-- Text -->
        <div>
          <div
            class="mb-4 inline-flex items-center gap-2 rounded-full border border-wine-200 bg-wine-50 px-3 py-1 text-xs font-medium text-wine-700 dark:border-wine-800 dark:bg-wine-950/40 dark:text-wine-300"
          >
            <UIcon name="i-lucide-layers-2" class="size-3" />
            Arquitetura limpa
          </div>
          <h2 class="text-3xl font-bold text-highlighted md:text-4xl">
            Código que escala sem virar bagunça
          </h2>
          <p class="mt-4 leading-relaxed text-muted">
            Arquitetura em camadas bem definidas: cada responsabilidade no seu lugar, fácil de testar, estender e
            manter — mesmo quando o time cresce.
          </p>
          <ul class="mt-6 space-y-3">
            <li
              v-for="item in [
                { label: 'Routes', desc: 'Validação de input e resposta HTTP', icon: 'i-lucide-route' },
                { label: 'Services', desc: 'Lógica de negócio isolada e testável', icon: 'i-lucide-cog' },
                { label: 'Repositories', desc: 'Acesso ao banco via Prisma encapsulado', icon: 'i-lucide-database' },
              ]"
              :key="item.label"
              class="flex items-start gap-3"
            >
              <div
                class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-wine-100 dark:bg-wine-900/50"
              >
                <UIcon :name="item.icon" class="size-3.5 text-wine-600 dark:text-wine-400" />
              </div>
              <div>
                <span class="text-sm font-medium text-highlighted">{{ item.label }}</span>
                <span class="text-sm text-muted"> — {{ item.desc }}</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Code block mockup -->
        <div
          class="overflow-hidden rounded-2xl border border-editorial-200 bg-editorial-950 shadow-2xl dark:border-editorial-700"
        >
          <div
            class="flex items-center gap-2 border-b border-editorial-800 bg-editorial-900 px-4 py-3"
          >
            <div class="flex gap-1.5">
              <div class="h-3 w-3 rounded-full bg-rust-500" />
              <div class="h-3 w-3 rounded-full bg-ember-500" />
              <div class="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span class="ml-2 text-xs text-editorial-500">server/api/protected/users/me.patch.ts</span>
          </div>
          <pre
            class="overflow-x-auto p-5 text-xs leading-relaxed"
          ><code><span class="text-editorial-500">// Rota — apenas lê input e delega</span>
<span class="text-wine-400">export default</span> <span class="text-ember-300">defineEventHandler</span><span class="text-editorial-300">(</span><span class="text-wine-400">async</span> <span class="text-editorial-300">(</span><span class="text-ember-300">event</span><span class="text-editorial-300">) => {</span>
  <span class="text-wine-400">const</span> <span class="text-ember-300">auth</span> <span class="text-editorial-300">=</span> <span class="text-ember-300">event</span><span class="text-editorial-300">.</span><span class="text-ember-300">context</span><span class="text-editorial-300">.</span><span class="text-ember-300">auth!</span>
  <span class="text-wine-400">const</span> <span class="text-ember-300">input</span> <span class="text-editorial-300">=</span> <span class="text-wine-400">await</span> <span class="text-ember-300">readValidatedBody</span><span class="text-editorial-300">(</span>
    <span class="text-ember-300">event</span><span class="text-editorial-300">,</span> <span class="text-ember-300">schema</span><span class="text-editorial-300">.</span><span class="text-ember-300">parse</span>
  <span class="text-editorial-300">)</span>

  <span class="text-editorial-500">// Service — lógica de negócio</span>
  <span class="text-wine-400">const</span> <span class="text-ember-300">user</span> <span class="text-editorial-300">=</span> <span class="text-wine-400">await</span> <span class="text-ember-300">userService</span><span class="text-editorial-300">.</span><span class="text-ember-300">updateProfile</span><span class="text-editorial-300">({</span>
    <span class="text-ember-300">userId</span><span class="text-editorial-300">:</span> <span class="text-ember-300">auth</span><span class="text-editorial-300">.</span><span class="text-ember-300">userId</span><span class="text-editorial-300">,</span>
    <span class="text-editorial-300">...</span><span class="text-ember-300">input</span><span class="text-editorial-300">,</span>
  <span class="text-editorial-300">})</span>

  <span class="text-wine-400">return</span> <span class="text-ember-300">ok</span><span class="text-editorial-300">(</span><span class="text-ember-300">user</span><span class="text-editorial-300">)</span>
<span class="text-editorial-300">})</span></code></pre>
        </div>
      </div>
    </div>
  </section>

  <!-- ── HOW IT WORKS ─────────────────────────────────────────── -->
  <section class="mx-auto max-w-5xl px-4 py-24">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-highlighted md:text-4xl">Como começar</h2>
      <p class="mt-4 text-muted">Três passos e você tem uma base production-ready em funcionamento.</p>
    </div>

    <div class="relative mt-14">
      <!-- Connecting line (hidden on mobile) -->
      <div
        class="absolute left-1/2 top-8 hidden h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-editorial-200 to-transparent dark:via-editorial-700 md:block"
      />

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div v-for="step in steps" :key="step.number" class="relative text-center">
          <div class="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
            <!-- Outer ring -->
            <div
              class="absolute inset-0 rounded-full border-2 border-wine-200 dark:border-wine-800"
            />
            <!-- Inner circle -->
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-wine-600 shadow-lg dark:bg-wine-700"
            >
              <UIcon :name="step.icon" class="size-5 text-white" />
            </div>
            <!-- Step number -->
            <div
              class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-editorial-950 text-[10px] font-bold text-white dark:bg-editorial-100 dark:text-editorial-950"
            >
              {{ step.number.slice(-1) }}
            </div>
          </div>
          <h3 class="mb-2 font-semibold text-highlighted">{{ step.title }}</h3>
          <p class="text-sm leading-relaxed text-muted">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── TECH STACK ───────────────────────────────────────────── -->
  <section
    class="border-y border-editorial-100 bg-editorial-50 py-16 dark:border-editorial-800 dark:bg-editorial-900/20"
  >
    <div class="mx-auto max-w-5xl px-4">
      <p class="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted">
        Stack tecnológica
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <div
          v-for="tech in stack"
          :key="tech.name"
          class="flex items-center gap-2 rounded-full border border-editorial-200 bg-white px-4 py-2 text-sm font-medium text-editorial-700 transition-colors hover:border-wine-300 hover:bg-wine-50 hover:text-wine-700 dark:border-editorial-700 dark:bg-editorial-800 dark:text-editorial-300 dark:hover:border-wine-700 dark:hover:bg-wine-950/30 dark:hover:text-wine-300"
        >
          <UIcon :name="tech.icon" class="size-4 shrink-0 opacity-70" />
          {{ tech.name }}
        </div>
      </div>
    </div>
  </section>

  <!-- ── FINAL CTA ────────────────────────────────────────────── -->
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div
        class="absolute inset-0 bg-linear-to-br from-wine-600 to-wine-800 dark:from-wine-800 dark:to-wine-950"
      />
      <div
        class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 24px 24px"
      />
    </div>

    <div class="mx-auto max-w-5xl px-4 py-24 text-center">
      <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
        <UIcon name="i-lucide-rocket" class="size-3.5" />
        Pronto para construir?
      </div>
      <h2 class="text-4xl font-bold text-white md:text-5xl">
        Pare de reinventar<br />a roda.
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
        Comece com uma base sólida e entregue mais rápido. Auth, segurança e admin já resolvidos — seu produto pode
        ir ao ar hoje.
      </p>
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <UButton
          size="xl"
          to="/cadastrar"
          icon="i-lucide-user-plus"
          trailing-icon="i-lucide-arrow-right"
          class="bg-white! text-wine-700! shadow-lg hover:bg-wine-50!"
        >
          Criar conta grátis
        </UButton>
        <NuxtLink
          :to="authStore.isAuthenticated ? '/usuario' : '/entrar'"
          class="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:border-white/60 hover:bg-white/10"
        >
          <UIcon :name="authStore.isAuthenticated ? 'i-lucide-user' : 'i-lucide-log-in'" class="size-4" />
          {{ authStore.isAuthenticated ? 'Ir ao perfil' : 'Entrar' }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
