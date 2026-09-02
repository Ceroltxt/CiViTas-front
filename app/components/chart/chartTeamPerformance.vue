<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import type { TeamPerformancePoint } from '~/types'

const props = withDefaults(defineProps<{
  data?: TeamPerformancePoint[]
}>(), {
  data: () => [],
})

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function initChart() {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: props.data.map(d => d.teamName),
      datasets: [
        {
          data: props.data.map(d => d.value),
          backgroundColor: props.data.map(d => d.color),
          borderWidth: 0,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.y} tarefas`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(148,163,184,0.12)' },
          ticks: { color: '#94a3b8', font: { size: 11 }, stepSize: 5 },
        },
      },
    },
  })
}

onMounted(() => initChart())

watch(() => props.data, () => initChart(), { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<template>
  <div class="w-full h-48">
    <canvas ref="chartRef" />
  </div>
</template>
