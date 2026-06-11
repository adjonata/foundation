<script setup lang="ts">
import { z } from 'zod'

const api = useApi()
const toast = useToast()
const authStore = useAuthStore()

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres').max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

const state = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const loading = ref(false)
const apiError = ref<string | null>(null)

async function onSubmit() {
  loading.value = true
  apiError.value = null
  try {
    await api.user.changePassword({
      currentPassword: state.currentPassword,
      newPassword: state.newPassword,
    })
    toast.add({
      title: 'Senha alterada com sucesso',
      description: 'Suas outras sessões foram encerradas.',
      color: 'success',
    })
    authStore.clearSession()
    await navigateTo('/entrar')
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
      <div>
        <h2 class="font-semibold text-highlighted">Alterar Senha</h2>
        <p class="text-sm text-muted mt-0.5">Após a alteração, suas outras sessões serão encerradas.</p>
      </div>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Senha atual" name="currentPassword">
        <UInput v-model="state.currentPassword" type="password" placeholder="••••••••" class="w-full" />
      </UFormField>

      <UFormField label="Nova senha" name="newPassword">
        <UInput v-model="state.newPassword" type="password" placeholder="••••••••" class="w-full" />
      </UFormField>

      <UFormField label="Confirmar nova senha" name="confirmPassword">
        <UInput v-model="state.confirmPassword" type="password" placeholder="••••••••" class="w-full" />
      </UFormField>

      <UAlert v-if="apiError" color="error" variant="subtle" :description="apiError" />

      <div class="flex justify-end">
        <UButton type="submit" color="error" variant="soft" :loading="loading">
          Alterar senha
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
