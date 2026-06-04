<template>
  <div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="space-y-1 text-center">
        <h1 class="text-2xl font-bold text-highlighted">Redefinir senha</h1>
        <p class="text-sm text-muted">Escolha uma nova senha para a sua conta</p>
      </div>

      <UCard>
        <!-- Token ausente na URL -->
        <div v-if="!token" class="space-y-4">
          <UAlert
            color="error"
            variant="subtle"
            icon="i-lucide-link-2-off"
            title="Link inválido"
            description="O link de redefinição está incompleto ou foi copiado incorrectamente."
          />
          <UButton to="/esqueci-senha" class="w-full justify-center">Solicitar novo link</UButton>
        </div>

        <!-- Sucesso -->
        <div v-else-if="status === 'success'" class="space-y-4">
          <UAlert
            color="success"
            variant="subtle"
            icon="i-lucide-circle-check"
            title="Senha redefinida!"
            :description="`Todas as sessões foram encerradas. A redirecionar em ${countdown}s…`"
          />
          <UButton to="/entrar" class="w-full justify-center">Ir para o login</UButton>
        </div>

        <!-- Erro irrecuperável (token inválido/expirado/usado) -->
        <div v-else-if="status === 'token-error'" class="space-y-4">
          <UAlert
            color="error"
            variant="subtle"
            icon="i-lucide-circle-x"
            title="Link expirado ou inválido"
            :description="errorMessage"
          />
          <UButton to="/esqueci-senha" class="w-full justify-center">Solicitar novo link</UButton>
        </div>

        <!-- Formulário -->
        <UForm v-else :schema="resetPasswordFormSchema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Nova senha" name="password" required>
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
              :type="showConfirm ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="new-password"
              class="w-full"
              :trailing-icon="showConfirm ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click:trailing="showConfirm = !showConfirm"
            />
          </UFormField>

          <UButton type="submit" class="w-full justify-center" :loading="loading">Redefinir senha</UButton>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { resetPasswordFormSchema } from '~/schemas/auth'
import type { ResetPasswordFormInput } from '~/schemas/auth'

const route = useRoute()
const api = useApi()
const { $toast } = useNuxtApp()

const token = computed(() => {
  const t = route.query.token
  return typeof t === 'string' && t.length > 0 ? t : null
})

type Status = 'idle' | 'success' | 'token-error'

const status = ref<Status>('idle')
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)
const countdown = ref(3)

const state = reactive<Partial<ResetPasswordFormInput>>({
  password: undefined,
  confirmPassword: undefined,
})

async function onSubmit(event: FormSubmitEvent<ResetPasswordFormInput>) {
  if (!token.value) return
  loading.value = true
  try {
    await api.auth.resetPassword({ token: token.value, password: event.data.password })
    status.value = 'success'
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        void navigateTo('/entrar')
      }
    }, 1000)
  } catch (error: unknown) {
    const msg = getFetchErrorMessage(error)
    const code = (error as { data?: { code?: string } })?.data?.code ?? ''
    const tokenErrors = ['TOKEN_USED', 'TOKEN_EXPIRED', 'INVALID_TOKEN']
    if (tokenErrors.includes(code)) {
      errorMessage.value = msg
      status.value = 'token-error'
    } else {
      $toast.add({ title: 'Erro ao redefinir senha', description: msg, color: 'error' })
    }
  } finally {
    loading.value = false
  }
}
</script>
