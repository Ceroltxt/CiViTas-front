<script setup lang="ts">
import type { Task } from '~/types'

const props = defineProps<{
  tasks?: Task[]
}>()

const defaultTasks = useBoardData()
const boardTasks = computed(() => props.tasks ?? defaultTasks)
const columns = useStatusList()
const grouped = computed(() => groupByStatus(boardTasks.value))
</script>

<template>
  <div class="scroll-thin -mx-1 flex gap-5 overflow-x-auto px-1 pb-2">
    <QuadrosKanbanColumn
      v-for="status in columns"
      :key="status"
      :status="status"
      :tasks="grouped[status] ?? []"
    />
  </div>
</template>

