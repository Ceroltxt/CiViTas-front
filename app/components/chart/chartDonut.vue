<script setup lang="ts">
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";

const chartRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (!chartRef.value) return;

  new Chart(chartRef.value, {
    type: "doughnut",
    data: {
      labels: ["Marketing", "RH", "Developers", "Design"],
      datasets: [
        {
          data: [1, 5, 3, 10],
          circumference: 360,
          borderWidth: 0,
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
  <div class="w-full h-56 items-center justify-center">
      <canvas ref="chartRef"></canvas>

  </div>
</template>