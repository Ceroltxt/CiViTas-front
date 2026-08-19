<script setup lang="ts">
import type { Task } from '~/types'

const props = defineProps<{
  tasks?: Task[]
  interactive?: boolean
  allStatuses?: boolean
}>()
const emit = defineEmits<{
  move: [taskId: string, status: import('~/types').StatusKey]
  edit: [task: Task]
  delete: [taskId: string]
}>()

const defaultTasks = useBoardData()
const boardTasks = computed(() => props.tasks ?? defaultTasks)
const columns = computed(() => props.interactive
  ? ['a-fazer', 'em-andamento', 'concluido'] as const
  : props.allStatuses
    ? ['a-fazer', 'em-andamento', 'em-revisao', 'validar', 'atrasado', 'concluido', 'pausado', 'cancelado'] as const
    : useStatusList(),
)
const grouped = computed(() => groupByStatus(boardTasks.value))
const draggedTaskId = ref<string | null>(null)

function moveTask(status: import('~/types').StatusKey) {
  if (draggedTaskId.value) emit('move', draggedTaskId.value, status)
  draggedTaskId.value = null
}
</script>

<template>
  <div class="scroll-thin -mx-1 flex items-start gap-5 overflow-x-auto px-1 pb-2">
    <QuadrosKanbanColumn
      v-for="status in columns"
      :key="status"
      :status="status"
      :tasks="grouped[status] ?? []"
      :interactive="interactive"
      @drag-start="draggedTaskId = $event"
      @drop="moveTask"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    />
  </div>
</template>

