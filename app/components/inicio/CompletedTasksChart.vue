<script setup lang="ts">
import Chart from 'chart.js/auto'
import type { Task } from '~/types'

const props = defineProps<{ tasks: Task[] }>()
const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | undefined

const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const completedSeries = computed(() => {
  const counts = Array.from({ length: 7 }, () => 0)
  let datedCompleted = 0
  props.tasks.forEach((task) => {
    if (task.status !== 'concluido' || !task.completedDate) return
    const [day, month, year] = task.completedDate.split('/').map(Number)
    const date = new Date(year, month - 1, day)
    if (!Number.isNaN(date.getTime())) {
      counts[(date.getDay() + 6) % 7]++
      datedCompleted++
    }
  })

  // Tarefas concluídas sem data registrada também entram no gráfico, para que
  // o total visual seja sempre igual ao indicador superior.
  const completedTotal = props.tasks.filter((task) => task.status === 'concluido').length
  counts[6] += completedTotal - datedCompleted
  return counts
})

function renderChart() {
  if (!canvas.value) return
  chart?.destroy()
  chart = new Chart(canvas.value, {
    type: 'line',
    data: { labels: weekdays, datasets: [{ data: completedSeries.value, borderColor: '#635bff', backgroundColor: 'rgba(99, 91, 255, .12)', fill: true, tension: .38, pointBackgroundColor: '#fff', pointBorderColor: '#635bff', pointBorderWidth: 2, pointRadius: 3.5 }] },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } }, y: { beginAtZero: true, ticks: { precision: 0, color: '#94a3b8', font: { size: 11 } }, border: { display: false }, grid: { color: '#e2e8f0' } } },
    },
  })
}

onMounted(renderChart)
watch(completedSeries, renderChart)
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <UiSectionCard class="min-h-[255px]">
    <template #header>
      <h2 class="font-semibold text-slate-800 dark:text-slate-100">Tarefas concluídas</h2>
    </template>
    <div class="h-48"><canvas ref="canvas" /></div>
  </UiSectionCard>
</template>
