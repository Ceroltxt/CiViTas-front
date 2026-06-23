<script setup lang="ts">
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";

const chartRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
new Chart(chartRef.value, {
  type: "line",

  data: {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],

    datasets: [
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
  },
],
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,
    options: {
  plugins: {
    legend: {
      position: "bottom",

      labels: {
        color: "#0f172a",

        font: {
          size: 16,
          weight: "bold",
        },

        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
      },
    },
  },
}
  },
});
});
</script>

<template>
  <canvas ref="chartRef"></canvas>
</template>