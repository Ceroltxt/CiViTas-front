<script setup lang="ts">
import type { PriorityKey, Task } from '~/types'

const props = defineProps<{
  priority: PriorityKey
  tasks: Task[]
  showAccent?: boolean
}>()

const open = ref(true)
const meta = computed(() => usePriorityMeta(props.priority))
</script>

<template>
  <section>
    <button
      type="button"
      class="mb-3 flex items-center gap-2 text-sm font-semibold"
      :class="meta.text"
      :aria-expanded="open"
      @click="open = !open"
    >
      <UIcon
        name="i-heroicons-chevron-down"
        class="size-4 transition-transform"
        :class="{ '-rotate-90': !open }"
      />
      {{ meta.label }} prioridade ({{ tasks.length }})
    </button>

    <div v-show="open" class="space-y-2">
      <TarefasTaskListRow
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :show-accent="showAccent"
      />
    </div>
  </section>
</template>
