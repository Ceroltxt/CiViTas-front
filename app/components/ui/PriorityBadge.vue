<script setup lang="ts">
import type { PriorityKey } from '~/types'

const props = defineProps<{ priority: PriorityKey }>()
const meta = computed(() => usePriorityMeta(props.priority))
</script>

<template>
  <span
    class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold"
    :class="meta.classes"
  >
    {{ meta.label }}
  </span>
</template>
