<script setup lang="ts">
import type { StatusKey } from '~/types'

const props = withDefaults(
  defineProps<{ status: StatusKey; dot?: boolean }>(),
  { dot: false },
)
const meta = computed(() => useStatusMeta(props.status))
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 text-xs font-semibold"
    :class="dot ? 'text-slate-600 dark:text-slate-300' : ['rounded-md px-2 py-0.5', meta.classes]"
  >
    <span v-if="dot" class="size-2 rounded-full" :class="meta.dot" />
    {{ meta.label }}
  </span>
</template>
