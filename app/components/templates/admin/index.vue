<template>
  <UPage>
    <UPageHeader
      headline="Administração"
      title="Permissões e papéis"
      description="Leitura do catálogo RBAC no servidor. A autorização efetiva continua definida em código (ROLE_PERMISSIONS); esta vista reflete o que está na base após o seed."
    />

    <UPageBody class="space-y-8">
      <OrganismsAdminPermissions />
      <OrganismsAdminRoles />
    </UPageBody>
  </UPage>
</template>
