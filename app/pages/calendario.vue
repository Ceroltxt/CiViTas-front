<script setup lang="ts">
definePageMeta({ sidebarWidget: 'none' })

const events = useCalendarEvents()

// Estado do mês exibido (inicia em Mai 2026, conforme referência).
const current = ref({ year: 2026, month: 4 })

const label = computed(() => formatMonthLabel(current.value.year, current.value.month))

function shift(delta: number) {
  const date = new Date(current.value.year, current.value.month + delta, 1)
  current.value = { year: date.getFullYear(), month: date.getMonth() }
}

function goToday() {
  const now = new Date()
  current.value = { year: now.getFullYear(), month: now.getMonth() }
}
</script>

<template>
  <div class="space-y-4 p-4 sm:p-6">
    <!-- Barra de navegação -->
    <div class="flex items-center justify-between">
      <h1 class="font-display text-lg font-semibold text-slate-700 dark:text-slate-200">{{ label }}</h1>
      <div class="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900">
        <UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-chevron-left" aria-label="Mês anterior" @click="shift(-1)" />
        <UButton variant="ghost" size="sm" label="Hoje" class="font-semibold text-violet-600" @click="goToday" />
        <UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-chevron-right" aria-label="Próximo mês" @click="shift(1)" />
      </div>
    </div>

    <CalendarioCalendarMonth :year="current.year" :month="current.month" :events="events" />
  </div>
</template>
