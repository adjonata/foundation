<template>
  <TemplatesUsuarioPerfil />
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
useSeoMeta({ title: 'Meu Perfil' })
</script>
