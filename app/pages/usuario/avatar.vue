<template>
  <TemplatesUsuarioAvatar />
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
useSeoMeta({ title: 'Editar Avatar' })
</script>
