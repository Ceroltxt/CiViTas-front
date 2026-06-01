<script setup lang="ts">
import { brandGradient } from '~/utils/tw'

const props = withDefaults(
  defineProps<{
    value: number
    /** classe de cor do preenchimento (ex.: 'bg-blue-500') */
    color?: string
    /** usa o gradiente da marca */
    gradient?: boolean
    height?: string
  }>(),
  {
    color: 'bg-pink-500',
    gradient: false,
    height: 'h-1.5',
  },
)

const clamped = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <div
    class="w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
    :class="height"
    role="progressbar"
    :aria-valuenow="clamped"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full rounded-full transition-[width] duration-500 w-[var(--progress)]"
      :class="[gradient ? brandGradient : color]"
      :style="{ '--progress': `${clamped}%` }"
    />
  </div>
</template>
