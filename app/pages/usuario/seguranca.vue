<template>
  <TemplatesUsuarioSeguranca />
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
useSeoMeta({ title: 'Segurança' })
</script>
