<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-bold text-highlighted">
          Criar conta
        </h1>
        <p class="text-sm text-muted">
          Preencha os dados abaixo para se cadastrar
        </p>
      </div>

      <UCard>
        <UForm
          :schema="registerSchema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Nome" name="name" required>
            <UInput
              v-model="state.name"
              type="text"
              placeholder="Seu nome completo"
              autocomplete="name"
              class="w-full"
            />
          </UFormField>

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
              autocomplete="new-password"
              class="w-full"
              :trailing-icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click:trailing="showPassword = !showPassword"
            />
          </UFormField>

          <UFormField label="Confirmar senha" name="confirmPassword" required>
            <UInput
              v-model="state.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="new-password"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            class="w-full"
            :loading="loading"
          >
            Criar conta
          </UButton>
        </UForm>
      </UCard>

      <p class="text-center text-sm text-muted">
        Já tem uma conta?
        <UButton variant="link" size="sm" class="p-0 h-auto" to="/auth/login">
          Entrar
        </UButton>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { registerSchema, type RegisterSchema } from '~/schemas/auth'

useSeoMeta({ title: 'Criar conta — foundation' })

const state = reactive<Partial<RegisterSchema>>({
  name: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined
})

const loading = ref(false)
const showPassword = ref(false)

async function onSubmit(_event: FormSubmitEvent<RegisterSchema>) {
  loading.value = true
  // TODO: integrar com /api/auth/register
  await new Promise(resolve => setTimeout(resolve, 800))
  loading.value = false
}
</script>
