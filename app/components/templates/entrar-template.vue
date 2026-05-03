<template>
  <div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="space-y-1 text-center">
        <h1 class="text-2xl font-bold text-highlighted">Entrar</h1>
        <p class="text-sm text-muted">Acesse sua conta para continuar</p>
      </div>

      <UCard>
        <UForm :schema="loginSchema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="E-mail" name="email" required>
            <UInput
              v-model="state.email"
              type="email"
              placeholder="voce@exemplo.com"
              autocomplete="username"
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
            <UButton variant="link" size="sm" class="h-auto p-0" disabled> Esqueci minha senha </UButton>
          </div>

          <UButton type="submit" class="w-full text-center justify-center" :loading="loading"> Entrar </UButton>
        </UForm>
      </UCard>

      <p class="text-center text-sm text-muted">
        Não tem uma conta?
        <UButton variant="link" size="sm" class="h-auto p-0" to="/cadastrar"> Cadastre-se </UButton>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { loginSchema, type LoginSchema } from '~/schemas/auth'

const route = useRoute()
const auth = useAuthStore()
const { $toast } = useNuxtApp()

// Em dev, alinha ao seed em prisma/seed/users.ts (mesma senha Argon2 do `prisma:seed`)
const state = reactive<Partial<LoginSchema>>({
  email: import.meta.dev ? 'admin@starter.dev' : undefined,
  password: import.meta.dev ? '123456' : undefined,
})

const loading = ref(false)
const showPassword = ref(false)

async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  loading.value = true
  try {
    await auth.login({
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
      title: 'Falha no login',
      description: getFetchErrorMessage(error),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
