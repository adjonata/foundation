<template>
  <div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="space-y-1 text-center">
        <h1 class="text-2xl font-bold text-highlighted">Criar conta</h1>
        <p class="text-sm text-muted">Preencha os dados abaixo para se cadastrar</p>
      </div>

      <UCard>
        <UForm :schema="registerFormSchema" :state="state" class="space-y-4" @submit="onSubmit">
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

          <UButton type="submit" class="w-full" :loading="loading"> Criar conta </UButton>
        </UForm>
      </UCard>

      <p class="text-center text-sm text-muted">
        Já tem uma conta?
        <UButton variant="link" size="sm" class="h-auto p-0" to="/entrar"> Entrar </UButton>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { registerFormSchema, type RegisterSchema } from '~/schemas/auth'

const route = useRoute()
const auth = useAuthStore()
const { $toast } = useNuxtApp()

const state = reactive<Partial<RegisterSchema>>({
  name: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
})

const loading = ref(false)
const showPassword = ref(false)

async function onSubmit(event: FormSubmitEvent<RegisterSchema>) {
  loading.value = true
  try {
    await auth.register({
      name: event.data.name,
      email: event.data.email,
      password: event.data.password,
    })
    const rawRedirect = route.query.redirect
    const redirect =
      typeof rawRedirect === 'string' && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
        ? rawRedirect
        : '/'
    await navigateTo(redirect)
  } catch (error: unknown) {
    $toast.add({
      title: 'Falha no cadastro',
      description: getFetchErrorMessage(error),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
