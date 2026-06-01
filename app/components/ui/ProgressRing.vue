<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number
    size?: number
    stroke?: number
    /** classes Tailwind de cor (ex.: text-violet-500) */
    colorClass?: string
    trackClass?: string
  }>(),
  {
    size: 120,
    stroke: 10,
    colorClass: 'text-violet-500',
    trackClass: 'text-slate-200 dark:text-slate-700',
  },
)

const clamped = computed(() => Math.min(100, Math.max(0, props.value)))
const radius = computed(() => props.size / 2 - props.stroke / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value * (1 - clamped.value / 100))
</script>

<template>
  <div
    class="relative inline-flex items-center justify-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="progressbar"
    :aria-valuenow="clamped"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <svg :width="size" :height="size" class="-rotate-90">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        stroke="currentColor"
        :stroke-width="stroke"
        fill="none"
        :class="trackClass"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        stroke="currentColor"
        :stroke-width="stroke"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        :class="[colorClass, 'transition-[stroke-dashoffset] duration-700']"
      />
    </svg>
    <span class="absolute text-2xl font-bold" :class="colorClass">{{ clamped }}%</span>
  </div>
</template>
