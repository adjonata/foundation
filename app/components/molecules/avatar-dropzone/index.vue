<script setup lang="ts">
const props = defineProps<{
  modelValue: File | null
  currentSrc?: string | null
  userName?: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [file: File | null]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const preview = ref<string | null>(null)
const isDragging = ref(false)

watch(
  () => props.modelValue,
  (file) => {
    if (!file) preview.value = null
  },
)

const displaySrc = computed(() => preview.value ?? props.currentSrc ?? null)

const initials = computed(() => {
  const n = props.userName ?? ''
  return n
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('')
})

function triggerInput() {
  inputRef.value?.click()
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) setFile(file)
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) setFile(file)
}

function setFile(file: File) {
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = URL.createObjectURL(file)
  emit('update:modelValue', file)
}

function clear() {
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = null
  emit('update:modelValue', null)
  if (inputRef.value) inputRef.value.value = ''
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div
      class="relative group cursor-pointer select-none"
      :style="{ transform: isDragging ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.2s' }"
      @click="triggerInput"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="onDrop"
    >
      <!-- Drag ring -->
      <div
        class="absolute -inset-3 rounded-full border-2 border-dashed transition-opacity duration-200"
        :class="isDragging ? 'border-primary opacity-100' : 'border-transparent opacity-0'"
      />

      <!-- Avatar -->
      <div class="relative w-36 h-36 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-gray-800">
        <img
          v-if="displaySrc"
          :src="displaySrc"
          :alt="userName ?? 'Avatar'"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-4xl font-semibold text-primary"
        >
          {{ initials || '?' }}
        </div>

        <!-- Hover overlay -->
        <div
          class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <UIcon name="i-lucide-camera" class="text-white size-8" />
          <span class="text-white text-xs mt-1 font-medium">Alterar foto</span>
        </div>
      </div>

      <!-- New file badge -->
      <div
        v-if="modelValue"
        class="absolute -bottom-1 -right-1 w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-md ring-2 ring-white dark:ring-gray-800"
      >
        <UIcon name="i-lucide-check" class="text-white size-4" />
      </div>
    </div>

    <input ref="inputRef" type="file" accept="image/*" class="hidden" @change="onFileChange" />

    <div v-if="modelValue" class="flex flex-col items-center gap-1 text-center">
      <p class="text-sm font-medium text-highlighted truncate max-w-48">{{ modelValue.name }}</p>
      <p class="text-xs text-muted">{{ (modelValue.size / 1024).toFixed(0) }} KB selecionado</p>
      <UButton variant="ghost" size="xs" icon="i-lucide-x" class="mt-1 text-muted" @click.stop="clear">
        Remover seleção
      </UButton>
    </div>
    <p v-else class="text-sm text-muted text-center">
      Clique ou arraste uma imagem aqui
    </p>
  </div>
</template>
