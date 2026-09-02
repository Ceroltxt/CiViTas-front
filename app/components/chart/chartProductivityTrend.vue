<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import type { ProductivityTrendPoint } from '~/types'

const props = withDefaults(defineProps<{
  data?: ProductivityTrendPoint[]
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
    type: 'line',
    data: {
      labels: props.data.map(d => d.label),
      datasets: [
        {
          label: 'Produtividade (%)',
          data: props.data.map(d => d.value),
          borderColor: 'rgba(97, 70, 234, 1)',
          backgroundColor: 'rgba(97, 70, 234, 0.12)',
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: 'rgba(97, 70, 234, 1)',
          fill: true,
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
            label: ctx => ` ${ctx.parsed.y}%`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { size: 11 } },
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: 'rgba(148,163,184,0.12)' },
          ticks: {
            color: '#94a3b8',
            font: { size: 10 },
            stepSize: 25,
            callback: (v) => `${v}%`,
          },
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
  <div class="w-full h-44">
    <canvas ref="chartRef" />
  </div>
</template>
