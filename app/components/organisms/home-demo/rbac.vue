<template>
  <section aria-labelledby="sec-rbac-heading">
    <OrganismsHomeDemoSectionHeading
      heading-id="sec-rbac-heading"
      title="Autorização (RBAC)"
      subtitle="Regras no Nitro, alinhadas a papéis e permissões em código."
      icon="i-lucide-shield-check"
      tone="editorial"
    />
    <UCard class="p-6 md:p-8">
      <p class="text-sm leading-relaxed text-muted">
        Rotas <code class="rounded bg-elevated px-1.5 py-0.5 text-xs">/api/admin/*</code> exigem permissões mapeadas em
        middleware. O catálogo de permissões também existe na base de dados para evolução do painel administrativo.
      </p>
      <p class="mt-3 text-sm leading-relaxed text-muted">
        Documentação detalhada no repositório:
        <code class="rounded bg-elevated px-1.5 py-0.5 text-xs">docs/RBAC.md</code>
      </p>
    </UCard>
  </section>
</template>
