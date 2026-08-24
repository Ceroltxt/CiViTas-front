<script setup lang="ts">
import Chart from 'chart.js/auto'
import type { Task } from '~/types'

const props = defineProps<{ tasks: Task[] }>()
const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | undefined

const categories = computed(() => {
  const items = [
    { label: 'A fazer', color: '#3b82f6', match: (task: Task) => task.status === 'a-fazer' },
    { label: 'Em andamento', color: '#f59e0b', match: (task: Task) => task.status === 'em-andamento' },
    { label: 'Em revisão', color: '#8b5cf6', match: (task: Task) => task.status === 'em-revisao' },
    { label: 'A validar', color: '#06b6d4', match: (task: Task) => task.status === 'validar' },
    { label: 'Concluídas', color: '#22c55e', match: (task: Task) => task.status === 'concluido' },
    { label: 'Atrasadas', color: '#ef4444', match: (task: Task) => task.status === 'atrasado' },
    { label: 'Pausadas/canceladas', color: '#64748b', match: (task: Task) => ['pausado', 'cancelado'].includes(task.status) },
  ]
  return items.map((item) => ({ ...item, count: props.tasks.filter(item.match).length }))
})

function renderChart() {
  if (!canvas.value) return
  chart?.destroy()
  chart = new Chart(canvas.value, {
    type: 'doughnut',
    data: {
      labels: categories.value.map((item) => item.label),
      datasets: [{ data: categories.value.map((item) => item.count), backgroundColor: categories.value.map((item) => item.color), borderWidth: 0, spacing: 2 }],
    },
    options: { cutout: '66%', plugins: { legend: { display: false }, tooltip: { enabled: true } }, maintainAspectRatio: false },
  })
}

onMounted(renderChart)
watch(categories, renderChart, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <UiSectionCard class="min-h-[255px]">
    <template #header><h2 class="font-semibold text-slate-800 dark:text-slate-100">Tarefas por status</h2></template>
    <div class="flex h-48 items-center gap-5">
      <div class="relative size-36 shrink-0">
        <canvas ref="canvas" />
        <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <strong class="text-2xl text-slate-800 dark:text-slate-100">{{ categories.reduce((total, item) => total + item.count, 0) }}</strong>
          <span class="text-xs text-slate-400">Total</span>
        </div>
      </div>
      <ul class="min-w-0 flex-1 space-y-1.5">
        <li v-for="item in categories" :key="item.label" class="flex items-center gap-2 text-xs">
          <span class="size-2 rounded-full" :style="{ backgroundColor: item.color }" />
          <span class="min-w-0 flex-1 text-slate-500 dark:text-slate-400">{{ item.label }}</span>
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{ item.count }}</span>
        </li>
      </ul>
    </div>
  </UiSectionCard>
</template>
