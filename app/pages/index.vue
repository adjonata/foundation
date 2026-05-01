<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-4">
    <h1 class="text-3xl font-bold">foundation</h1>
    <p class="text-neutral-500">Template base com autenticação, RBAC e painel admin.</p>
    <div class="flex gap-2">
      <UButton label="Login" to="/auth/login" color="primary" />
      <UButton label="Cadastro" to="/auth/register" variant="outline" />
    </div>
  </div>
</template>
