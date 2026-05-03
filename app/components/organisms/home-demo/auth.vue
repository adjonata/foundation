<template>
  <section aria-labelledby="sec-auth-heading">
    <OrganismsHomeDemoSectionHeading
      heading-id="sec-auth-heading"
      title="Autenticação"
      subtitle="Registo e login com validação e cookies de sessão."
      icon="i-lucide-key-round"
      tone="wine"
    />
    <UCard class="overflow-hidden">
      <div class="grid gap-6 p-6 md:grid-cols-2 md:p-8">
        <div class="space-y-2">
          <h3 class="font-medium text-highlighted">Criar conta</h3>
          <p class="text-sm leading-relaxed text-muted">
            Formulário com Zod, hash Argon2 no servidor e redirecionamento após registo bem-sucedido.
          </p>
          <UButton
            to="/cadastrar"
            variant="soft"
            color="primary"
            class="mt-2 w-fit"
            trailing-icon="i-lucide-arrow-right"
          >
            Abrir cadastro
          </UButton>
        </div>
        <div class="space-y-2 border-t border-default pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <h3 class="font-medium text-highlighted">Entrar</h3>
          <p class="text-sm leading-relaxed text-muted">
            Login em <code class="rounded bg-elevated px-1.5 py-0.5 text-xs">POST /api/auth/login</code>; sessão
            reforçada no layout da aplicação.
          </p>
          <UButton to="/entrar" variant="soft" color="neutral" class="mt-2 w-fit" trailing-icon="i-lucide-arrow-right">
            Abrir login
          </UButton>
        </div>
      </div>
    </UCard>
  </section>
</template>
