<script setup lang="ts">
defineProps<{
  appName: string
}>()
</script>

<template>
  <header class="mx-auto max-w-3xl text-center">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-wine-700 dark:text-wine-400 md:text-sm">
      Demonstração ao vivo
    </p>
    <h1 class="mt-3 text-4xl font-bold tracking-tight text-highlighted md:text-5xl">
      {{ appName }}
    </h1>
    <p class="mt-4 text-pretty text-base leading-relaxed text-muted md:text-lg">
      Esta página resume o que o template já oferece: autenticação com sessão, rotas protegidas no cliente e autorização
      por papéis no servidor (RBAC). Use os botões abaixo para percorrer cada parte — com ou sem sessão iniciada.
    </p>
    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <UButton to="/entrar" color="primary" size="lg" icon="i-lucide-log-in" label="Entrar" />
      <UButton
        to="/cadastrar"
        color="neutral"
        variant="outline"
        size="lg"
        icon="i-lucide-user-plus"
        label="Criar conta"
      />
    </div>
  </header>
</template>
