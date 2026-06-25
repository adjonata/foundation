<script setup lang="ts">
const authStore = useAuthStore()
const api = useApi()
const toast = useToast()

const file = ref<File | null>(null)
const loading = ref(false)

async function save() {
  if (!file.value) return
  loading.value = true
  try {
    const updatedUser = await api.user.updateAvatar(file.value)
    authStore.user = updatedUser
    file.value = null
    toast.add({ title: 'Foto de perfil atualizada', color: 'success' })
    await navigateTo('/usuario')
  } catch {
    toast.add({ title: 'Erro ao salvar foto', description: 'Tente novamente.', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto">
    <div class="flex items-center gap-3 mb-8">
      <UButton variant="ghost" icon="i-lucide-arrow-left" size="sm" to="/usuario" />
      <div>
        <h1 class="text-xl font-semibold text-highlighted">Foto de perfil</h1>
        <p class="text-sm text-muted">Arraste ou clique para selecionar</p>
      </div>
    </div>

    <div class="flex flex-col items-center gap-8">
      <MoleculesAvatarDropzone
        v-model="file"
        :current-src="authStore.user?.avatarUrl"
        :user-name="authStore.user?.name"
      />

      <div class="flex gap-3 w-full">
        <UButton
          class="flex-1"
          size="lg"
          icon="i-lucide-save"
          :loading="loading"
          :disabled="!file"
          @click="save"
        >
          Salvar foto
        </UButton>
        <UButton variant="outline" size="lg" :disabled="loading" to="/usuario">
          Cancelar
        </UButton>
      </div>

      <p class="text-xs text-muted text-center">PNG, JPG, GIF, WebP · Máx. 5 MB</p>
    </div>
  </div>
</template>
