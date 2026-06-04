<template>
  <div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="space-y-1 text-center">
        <h1 class="text-2xl font-bold text-highlighted">Esqueci minha senha</h1>
        <p class="text-sm text-muted">Enviaremos um link de redefinição para o seu e-mail</p>
      </div>

      <UCard>
        <div v-if="sent" class="space-y-4">
          <UAlert
            color="success"
            variant="subtle"
            icon="i-lucide-mail-check"
            title="Link enviado"
            description="Se esse e-mail estiver cadastrado, você receberá as instruções em breve. Verifique também a pasta de spam."
          />
          <UButton variant="ghost" to="/entrar" class="w-full justify-center">Voltar para o login</UButton>
        </div>

        <UForm v-else :schema="forgotPasswordSchema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="E-mail" name="email" required>
            <UInput
              v-model="state.email"
              type="email"
              placeholder="voce@exemplo.com"
              autocomplete="email"
              class="w-full"
            />
          </UFormField>

          <UButton type="submit" class="w-full justify-center" :loading="loading">Enviar link</UButton>

          <p class="text-center text-sm text-muted">
            Lembrou a senha?
            <UButton variant="link" size="sm" class="h-auto p-0" to="/entrar">Entrar</UButton>
          </p>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { forgotPasswordSchema } from '~/schemas/auth'
import type { ForgotPasswordInput } from '~/schemas/auth'

const api = useApi()
const { $toast } = useNuxtApp()

const state = reactive<Partial<ForgotPasswordInput>>({ email: undefined })
const loading = ref(false)
const sent = ref(false)

async function onSubmit(event: FormSubmitEvent<ForgotPasswordInput>) {
  loading.value = true
  try {
    await api.auth.forgotPassword({ email: event.data.email })
    sent.value = true
  } catch {
    $toast.add({
      title: 'Erro ao enviar',
      description: 'Não foi possível processar a solicitação. Tente novamente.',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
