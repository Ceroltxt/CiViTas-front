<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import type { DeliveryPerformancePoint } from '~/types'

const props = withDefaults(defineProps<{
  data?: DeliveryPerformancePoint[]
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
          label: 'Concluídas',
          data: props.data.map(d => d.concluidas),
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: 'rgba(34, 197, 94, 1)',
          fill: false,
        },
        {
          label: 'Em andamento',
          data: props.data.map(d => d.emAndamento),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          fill: false,
        },
        {
          label: 'Atrasadas',
          data: props.data.map(d => d.atrasadas),
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: 'rgba(239, 68, 68, 1)',
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            color: '#64748b',
            font: { size: 11 },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { size: 10 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(148,163,184,0.12)' },
          ticks: { color: '#94a3b8', font: { size: 10 }, stepSize: 5 },
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
  <div class="w-full h-52">
    <canvas ref="chartRef" />
  </div>
</template>
