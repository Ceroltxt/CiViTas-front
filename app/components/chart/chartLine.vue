<script setup lang="ts">
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";

const chartRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (!chartRef.value) return;

  new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels: ["Atrasadas", "Entregues"],
      datasets: [
        {
          data: [1, 5],
          label: "Desempenho de entregas",
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: [
            "rgba(255, 217, 0)",
            "rgba(97, 70, 234)",
            
          ],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
</script>

<template>
  <canvas ref="chartRef"></canvas>
</template>