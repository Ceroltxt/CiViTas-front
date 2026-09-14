<script setup lang="ts">
import type { Task, StatusKey } from '~/types'

const props = withDefaults(defineProps<{
  tasks?: Task[]
  interactive?: boolean
  allStatuses?: boolean
  columns?: StatusKey[]
}>(), {
  interactive: true,
  allStatuses: false,
})

const emit = defineEmits<{
  move: [taskId: string, status: StatusKey]
  edit: [task: Task]
  delete: [taskId: string]
}>()

const defaultTasks = useBoardData()
const boardTasks = computed(() => props.tasks ?? defaultTasks)

const activeColumns = computed<StatusKey[]>(() => {
  if (props.columns && props.columns.length > 0) return props.columns
  if (props.allStatuses) {
    return ['a-fazer', 'em-andamento', 'em-revisao', 'validar', 'atrasado', 'concluido', 'pausado', 'cancelado']
  }
  return ['a-fazer', 'em-andamento', 'em-revisao', 'validar', 'atrasado', 'concluido']
})

const grouped = computed(() => groupByStatus(boardTasks.value))
const draggedTaskId = ref<string | null>(null)

function onDragStart(taskId: string) {
  draggedTaskId.value = taskId
}

function onDrop(status: StatusKey, taskId?: string) {
  const targetId = taskId || draggedTaskId.value
  if (targetId) {
    emit('move', targetId, status)
  }
  draggedTaskId.value = null
}
</script>

<template>
  <div class="scroll-thin -mx-1 flex items-start gap-5 overflow-x-auto px-1 pb-2">
    <QuadrosKanbanColumn
      v-for="status in activeColumns"
      :key="status"
      :status="status"
      :tasks="grouped[status] ?? []"
      :interactive="interactive"
      @drag-start="onDragStart"
      @drop="onDrop"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    />
  </div>
</template>
