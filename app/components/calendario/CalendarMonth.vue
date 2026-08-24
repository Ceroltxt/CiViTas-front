<script setup lang="ts">
import type { CalendarEvent } from '~/types'

const props = defineProps<{
  year: number
  month: number
  events: CalendarEvent[]
}>()

const DAY_MS = 86_400_000

const eventColors: Record<CalendarEvent['color'], { border: string; cell: string }> = {
  pink: { border: 'border-pink-500', cell: 'bg-pink-100 dark:bg-pink-900/30 text-slate-700 dark:text-slate-200' },
  blue: { border: 'border-blue-500', cell: 'bg-blue-100 dark:bg-blue-900/30 text-slate-700 dark:text-slate-200' },
  amber: { border: 'border-amber-500', cell: 'bg-amber-100 dark:bg-amber-900/30 text-slate-700 dark:text-slate-200' },
  violet: { border: 'border-violet-600', cell: 'bg-violet-200 dark:bg-violet-900/40 text-slate-800 dark:text-slate-200' },
  green: { border: 'border-emerald-500', cell: 'bg-emerald-100 dark:bg-emerald-900/30 text-slate-700 dark:text-slate-200' },
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
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex shadow-sm">
    <div class="flex-1">
      <!-- Dias da semana -->
      <div class="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
        <div
          v-for="weekday in WEEKDAYS"
          :key="weekday"
          class="px-4 py-3 text-left text-[13px] font-bold text-slate-600 dark:text-slate-300 capitalize"
        >
          {{ weekday.toLowerCase() }}
        </div>
      </div>

      <!-- Semanas -->
      <div
        v-for="(week, wi) in weeks"
        :key="wi"
        class="relative border-b border-slate-200 last:border-b-0 dark:border-slate-800"
      >
        <!-- Células -->
        <div class="grid grid-cols-7 h-32">
          <div
            v-for="cell in week"
            :key="cell.date.toISOString()"
            class="h-full border-r border-slate-100 last:border-r-0 dark:border-slate-800 relative group/cell hover:border-orange-400 hover:border-2 transition-all cursor-pointer bg-white dark:bg-slate-900 z-0"
            :class="[cell.isToday ? 'border-2 border-orange-400' : '']"
            @click="$emit('add-task', cell.date)"
          >
            <!-- Número do Dia (Top Right) -->
            <div class="absolute top-2 right-2">
              <span
                class="text-[13px] font-medium"
                :class="[
                  cell.inMonth ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600',
                  cell.isToday && 'flex size-6 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm font-bold',
                ]"
              >
                {{ cell.day }}
              </span>
            </div>

            <!-- Botão "+" no Hover (Bottom Right) -->
            <div class="absolute bottom-2 right-2 opacity-0 group-hover/cell:opacity-100 transition-opacity">
              <div class="bg-orange-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                <UIcon name="i-heroicons-plus" class="size-3" />
                <span>{{ cell.day }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pointer-events-none absolute inset-x-0 top-8 grid grid-cols-7 gap-px z-20">
          <div
            v-for="bar in weekBars[wi]"
            :key="bar.event.id"
            class="self-start border-l-4 py-1 px-2 shadow-sm"
            :class="[
              eventColors[bar.event.color].cell, 
              eventColors[bar.event.color].border,
              bar.event.editable ? 'pointer-events-auto cursor-pointer hover:brightness-95 transition-all' : 'pointer-events-none opacity-80'
            ]"
            :style="{
              gridColumn: `${bar.colStart} / span ${bar.colSpan}`,
              marginTop: `${bar.lane * 26}px`,
            }"
            @click.stop="bar.event.editable ? $emit('edit-task', bar.event) : null"
          >
            <span class="block truncate text-[12px] font-medium">
              {{ bar.event.title }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sidebar de Status (Placeholder Baseado na Imagem) -->
    <div class="w-10 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center py-2 shrink-0">
      <UIcon name="i-heroicons-bars-3" class="size-5 text-slate-400 mb-6 cursor-pointer hover:text-slate-600" />
      <div class="flex-1 flex flex-col items-center gap-10">
        <div class="text-[11px] font-medium text-slate-500 [writing-mode:vertical-lr] rotate-180 flex items-center gap-2 cursor-pointer hover:text-slate-700">
          <span class="bg-slate-200 dark:bg-slate-700 w-px h-6"></span>
          1 Não agendado
        </div>
        <div class="text-[11px] font-medium text-rose-500 [writing-mode:vertical-lr] rotate-180 flex items-center gap-2 cursor-pointer hover:text-rose-600">
          <span class="bg-rose-200 dark:bg-rose-900/50 w-px h-6"></span>
          3 Em atraso
        </div>
      </div>
    </div>
  </div>
</template>
