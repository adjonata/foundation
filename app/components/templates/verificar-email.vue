<template>
  <div class="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="space-y-1 text-center">
        <h1 class="text-2xl font-bold text-highlighted">Verificação de e-mail</h1>
        <p class="text-sm text-muted">Confirme o seu endereço para activar a conta</p>
      </div>

      <UCard>
        <!-- Verificando token -->
        <div v-if="status === 'loading'" class="flex flex-col items-center gap-4 py-4">
          <UIcon name="i-lucide-loader-circle" class="size-10 animate-spin text-primary" />
          <p class="text-sm text-muted">A verificar o seu e-mail…</p>
        </div>

        <!-- Sucesso -->
        <div v-else-if="status === 'success'" class="space-y-4">
          <UAlert
            color="success"
            variant="subtle"
            title="E-mail verificado!"
            :description="`Conta activa. A redirecionar em ${countdown}s…`"
            icon="i-lucide-circle-check"
          />
          <UButton to="/" class="w-full justify-center">Ir para o início</UButton>
        </div>

        <!-- Erro ao verificar -->
        <div v-else-if="status === 'error'" class="space-y-4">
          <UAlert
            color="error"
            variant="subtle"
            title="Não foi possível verificar"
            :description="errorMessage"
            icon="i-lucide-circle-x"
          />
          <UButton v-if="auth.isAuthenticated" :loading="resending" class="w-full justify-center" @click="onResend">
            Reenviar e-mail de verificação
          </UButton>
          <UButton v-else variant="ghost" to="/entrar" class="w-full justify-center">Ir para o login</UButton>
        </div>

        <!-- Sem token: instruções + reenvio -->
        <div v-else class="space-y-4">
          <UAlert
            color="neutral"
            variant="subtle"
            title="Confirme o seu e-mail"
            description="Foi enviado um link de verificação para a sua caixa de entrada. Clique no link para activar a conta."
            icon="i-lucide-mail"
          />
          <UButton v-if="auth.isAuthenticated" :loading="resending" class="w-full justify-center" @click="onResend">
            Reenviar e-mail de verificação
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const auth = useAuthStore()
const api = useApi()
const { $toast } = useNuxtApp()

type Status = 'idle' | 'loading' | 'success' | 'error'

const status = ref<Status>('idle')
const errorMessage = ref('')
const resending = ref(false)
const countdown = ref(3)

async function verify(token: string) {
  status.value = 'loading'
  try {
    await auth.verifyEmail(token)
    status.value = 'success'
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        void navigateTo('/')
      }
    }, 1000)
  } catch (error: unknown) {
    status.value = 'error'
    errorMessage.value = getFetchErrorMessage(error)
  }
}

async function onResend() {
  resending.value = true
  try {
    await api.auth.resendVerification()
    $toast.add({
      title: 'E-mail reenviado',
      description: 'Verifique a sua caixa de entrada.',
      color: 'success',
    })
  } catch (error: unknown) {
    $toast.add({
      title: 'Não foi possível reenviar',
      description: getFetchErrorMessage(error),
      color: 'error',
    })
  } finally {
    resending.value = false
  }
}

onMounted(() => {
  const token = route.query.token
  if (typeof token === 'string' && token.length > 0) {
    void verify(token)
  }
})
</script>
