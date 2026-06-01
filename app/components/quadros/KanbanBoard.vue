<script setup lang="ts">
const tasks = useBoardData()
const columns = useStatusList()
const grouped = computed(() => groupByStatus(tasks))
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
