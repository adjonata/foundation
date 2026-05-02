<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-4">
    <h1 class="text-3xl font-bold">foundation</h1>
    <p class="text-neutral-500">Template base com autenticação, RBAC e painel admin.</p>
    <div class="flex gap-2">
      <UButton label="Login" to="/entrar" color="primary" />
      <UButton label="Cadastro" to="/cadastrar" variant="outline" />
      <UButton label="Área autenticada (teste)" to="/teste-auth" variant="soft" />
    </div>
  </div>
</template>
