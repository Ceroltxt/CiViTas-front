<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import type { CollaboratorStats } from '~/types'

const props = withDefaults(defineProps<{
  stats?: CollaboratorStats
}>(), {
  stats: () => ({ total: 0, active: 0, inactive: 0 }),
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
    type: 'doughnut',
    data: {
      labels: ['Ativos', 'Inativos'],
      datasets: [
        {
          data: [props.stats.active, props.stats.inactive],
          backgroundColor: ['rgba(97, 70, 234, 0.9)', 'rgba(226, 232, 240, 0.8)'],
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed} colaboradores`,
          },
        },
      },
    },
  })
}

onMounted(() => initChart())

watch(() => props.stats, () => initChart(), { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<template>
  <div class="w-40 h-40">
    <canvas ref="chartRef" />
  </div>
</template>
