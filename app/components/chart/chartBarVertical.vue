<script setup lang="ts">
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";

const chartRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (!chartRef.value) return;

  new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels: ["Marketing", "HR", "Developers", "Design"],
      datasets: [
        {
          data: [1, 5, 3, 10],
          label: "Desempenho de Equipes",
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: [
            "rgba(255, 217, 0)",
            "rgba(253, 128, 9)",
            "rgba(50, 132, 255)",
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