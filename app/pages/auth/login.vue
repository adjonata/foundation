<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-bold text-highlighted">
          Entrar
        </h1>
        <p class="text-sm text-muted">
          Acesse sua conta para continuar
        </p>
      </div>

      <UCard>
        <UForm
          :schema="loginSchema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="E-mail" name="email" required>
            <UInput
              v-model="state.email"
              type="email"
              placeholder="voce@exemplo.com"
              autocomplete="email"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Senha" name="password" required>
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              class="w-full"
              :trailing-icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click:trailing="showPassword = !showPassword"
            />
          </UFormField>

          <div class="flex justify-end">
            <UButton variant="link" size="sm" class="p-0 h-auto" disabled>
              Esqueci minha senha
            </UButton>
          </div>

          <UButton
            type="submit"
            class="w-full"
            :loading="loading"
          >
            Entrar
          </UButton>
        </UForm>
      </UCard>

      <p class="text-center text-sm text-muted">
        Não tem uma conta?
        <UButton variant="link" size="sm" class="p-0 h-auto" to="/auth/register">
          Cadastre-se
        </UButton>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { loginSchema, type LoginSchema } from '~/schemas/auth'

useSeoMeta({ title: 'Entrar — order-flow' })

const state = reactive<Partial<LoginSchema>>({
  email: undefined,
  password: undefined
})

const loading = ref(false)
const showPassword = ref(false)

async function onSubmit(_event: FormSubmitEvent<LoginSchema>) {
  loading.value = true
  // TODO: integrar com /api/auth/login
  await new Promise(resolve => setTimeout(resolve, 800))
  loading.value = false
}
</script>
