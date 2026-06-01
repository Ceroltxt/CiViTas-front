<script setup lang="ts">
import type { CalendarEvent } from '~/types'

const props = defineProps<{
  year: number
  month: number
  events: CalendarEvent[]
}>()

const DAY_MS = 86_400_000

const eventColors: Record<CalendarEvent['color'], { bar: string; cell: string }> = {
  pink: { bar: 'bg-pink-400', cell: 'bg-pink-100' },
  blue: { bar: 'bg-blue-400', cell: 'bg-blue-50' },
  amber: { bar: 'bg-amber-300', cell: 'bg-amber-50' },
  violet: { bar: 'bg-violet-400', cell: 'bg-violet-50' },
  green: { bar: 'bg-emerald-400', cell: 'bg-emerald-50' },
}

const weeks = computed(() => buildMonthGrid(props.year, props.month))

interface Bar {
  event: CalendarEvent
  colStart: number
  colSpan: number
  lane: number
}

/** Para cada semana, calcula as barras de evento (coluna inicial + extensão). */
const weekBars = computed<Bar[][]>(() =>
  weeks.value.map((week) => {
    const weekStart = week[0]!.date.getTime()
    const weekEnd = week[6]!.date.getTime()
    const bars: Bar[] = []

    props.events.forEach((event) => {
      const eventStart = new Date(props.year, props.month, event.startDay).getTime()
      const eventEnd = eventStart + (event.length - 1) * DAY_MS
      if (eventEnd < weekStart || eventStart > weekEnd) return

      const segStart = Math.max(eventStart, weekStart)
      const segEnd = Math.min(eventEnd, weekEnd)
      bars.push({
        event,
        colStart: Math.round((segStart - weekStart) / DAY_MS) + 1,
        colSpan: Math.round((segEnd - segStart) / DAY_MS) + 1,
        lane: bars.length,
      })
    })

    return bars
  }),
)
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <!-- Dias da semana -->
    <div class="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
      <div
        v-for="weekday in WEEKDAYS"
        :key="weekday"
        class="px-2 py-2 text-center text-xs font-medium text-slate-400"
      >
        {{ weekday }}
      </div>
    </div>

    <!-- Semanas -->
    <div
      v-for="(week, wi) in weeks"
      :key="wi"
      class="relative border-b border-slate-200 last:border-b-0 dark:border-slate-800"
    >
      <!-- Células -->
      <div class="grid grid-cols-7">
        <div
          v-for="cell in week"
          :key="cell.date.toISOString()"
          class="min-h-28 border-r border-slate-100 px-2 py-1.5 last:border-r-0 dark:border-slate-800"
        >
          <div class="flex justify-center">
            <span
              class="text-xs font-medium"
              :class="[
                cell.inMonth ? 'text-slate-500' : 'text-slate-300',
                cell.isToday && 'flex size-6 items-center justify-center rounded-full bg-violet-500 text-white',
              ]"
            >
              {{ String(cell.day).padStart(2, '0') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Barras de evento sobrepostas -->
      <div class="pointer-events-none absolute inset-x-0 top-8 grid grid-cols-7 gap-px px-1">
        <div
          v-for="bar in weekBars[wi]"
          :key="bar.event.id"
          class="pointer-events-auto self-start rounded-md px-2 py-1"
          :class="eventColors[bar.event.color].cell"
          :style="{
            gridColumn: `${bar.colStart} / span ${bar.colSpan}`,
            marginTop: `${bar.lane * 34}px`,
          }"
        >
          <span class="mb-1 block h-1 w-full rounded-full" :class="eventColors[bar.event.color].bar" />
          <span class="block truncate rounded bg-white/80 px-1.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
            {{ bar.event.title }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
