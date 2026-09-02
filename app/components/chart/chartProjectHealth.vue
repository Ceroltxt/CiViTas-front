<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import type { ProjectHealthStats } from '~/types'

const props = withDefaults(defineProps<{
  stats?: ProjectHealthStats
}>(), {
  stats: () => ({ noPrazo: 0, emRisco: 0, atrasado: 0, concluido: 0, total: 0 }),
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
      labels: ['No prazo', 'Em risco', 'Atrasado', 'Concluído'],
      datasets: [
        {
          data: [props.stats.noPrazo, props.stats.emRisco, props.stats.atrasado, props.stats.concluido],
          backgroundColor: [
            'rgba(34, 197, 94, 0.85)',
            'rgba(251, 191, 36, 0.85)',
            'rgba(239, 68, 68, 0.85)',
            'rgba(148, 163, 184, 0.85)',
          ],
          borderWidth: 0,
          borderRadius: 4,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed} projetos`,
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
  <div class="w-36 h-36">
    <canvas ref="chartRef" />
  </div>
</template>
