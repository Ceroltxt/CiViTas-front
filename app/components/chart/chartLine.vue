<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from "vue";
import Chart from "chart.js/auto";

const props = withDefaults(defineProps<{
  labels?: string[]
  datasets?: any[]
}>(), {
  labels: () => ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
  datasets: () => [
    {
      label: "Demanda de projetos",
      data: [8, 10, 8, 6, 8, 6, 10],
      borderColor: "rgba(253, 128, 9)",
      backgroundColor: "rgba(253, 128, 9)",
      tension: 0.4,
    },
    {
      label: "Projetos entregues",
      data: [6, 8, 10, 8, 4, 9, 7],
      borderColor:"rgba(97, 70, 234)",
      backgroundColor:"rgba(97, 70, 234)",
      tension: 0.4,
    }
  ]
})

const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

function initChart() {
  if (!chartRef.value) return;
  
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  chartInstance = new Chart(chartRef.value, {
    type: "line",
    data: {
      labels: props.labels,
      datasets: props.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#64748b",
            font: {
              size: 12,
              weight: "bold",
            },
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
          },
        },
      },
    },
  });
}

onMounted(() => {
  initChart();
});

watch(() => [props.labels, props.datasets], () => {
  initChart();
}, { deep: true });

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<template>
  <div class="w-full h-full">
    <canvas ref="chartRef"></canvas>
  </div>
</template>