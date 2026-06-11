<script setup lang="ts">
import { z } from 'zod'

const authStore = useAuthStore()
const api = useApi()
const toast = useToast()

const schema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(120, 'Máximo 120 caracteres'),
  email: z.string().email('E-mail inválido'),
})

const state = reactive({
  name: authStore.user?.name ?? '',
  email: authStore.user?.email ?? '',
})

const loading = ref(false)
const apiError = ref<string | null>(null)

async function onSubmit() {
  loading.value = true
  apiError.value = null
  try {
    const updated = await api.user.updateProfile({ name: state.name, email: state.email })
    authStore.user = updated
    if (!updated.emailVerified) {
      toast.add({
        title: 'Perfil atualizado',
        description: 'Verifique o novo e-mail para continuar usando a conta.',
        color: 'warning',
      })
    } else {
      toast.add({ title: 'Perfil atualizado com sucesso', color: 'success' })
    }
  } catch (err) {
    apiError.value = getFetchErrorMessage(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-semibold text-highlighted">Informações Pessoais</h2>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Nome" name="name">
        <UInput v-model="state.name" placeholder="Seu nome" class="w-full" />
      </UFormField>

      <UFormField label="E-mail" name="email">
        <UInput v-model="state.email" type="email" placeholder="seu@email.com" class="w-full" />
      </UFormField>

      <UAlert v-if="apiError" color="error" variant="subtle" :description="apiError" />

      <div class="flex justify-end">
        <UButton type="submit" :loading="loading">Salvar alterações</UButton>
      </div>
    </UForm>
  </UCard>
</template>
