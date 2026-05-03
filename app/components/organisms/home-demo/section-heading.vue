<script setup lang="ts">
const props = defineProps<{
  headingId: string
  title: string
  subtitle?: string
  icon: string
  tone: 'wine' | 'ember' | 'editorial'
}>()

const toneClass = computed(() => {
  const map = {
    wine: 'bg-wine-100 text-wine-700 dark:bg-wine-950 dark:text-wine-300',
    ember: 'bg-ember-100 text-ember-800 dark:bg-ember-950 dark:text-ember-200',
    editorial: 'bg-editorial-200 text-editorial-800 dark:bg-editorial-800 dark:text-editorial-100',
  }
  return map[props.tone]
})
</script>

<template>
  <div class="mb-4 flex items-center gap-3">
    <span class="flex size-10 shrink-0 items-center justify-center rounded-lg" :class="toneClass" aria-hidden="true">
      <Icon :name="icon" class="size-5 shrink-0" />
    </span>
    <div>
      <h2 :id="headingId" class="text-xl font-semibold text-highlighted md:text-2xl">{{ title }}</h2>
      <p v-if="$slots.subtitle" class="text-sm text-muted">
        <slot name="subtitle" />
      </p>
      <p v-else class="text-sm text-muted">{{ subtitle }}</p>
    </div>
  </div>
</template>
