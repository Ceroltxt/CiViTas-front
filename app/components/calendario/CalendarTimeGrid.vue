<script setup lang="ts">
import type { CalendarEvent } from '~/types'

const props = defineProps<{
  date: Date
  daysCount: number // 1, 4 ou 7
  events: CalendarEvent[]
}>()

defineEmits(['add-task', 'edit-task'])

const eventColors: Record<CalendarEvent['color'], { border: string; cell: string }> = {
  pink: { border: 'border-pink-500', cell: 'bg-pink-100 dark:bg-pink-900/30 text-slate-700 dark:text-slate-200' },
  blue: { border: 'border-blue-500', cell: 'bg-blue-100 dark:bg-blue-900/30 text-slate-700 dark:text-slate-200' },
  amber: { border: 'border-amber-500', cell: 'bg-amber-100 dark:bg-amber-900/30 text-slate-700 dark:text-slate-200' },
  violet: { border: 'border-violet-600', cell: 'bg-violet-200 dark:bg-violet-900/40 text-slate-800 dark:text-slate-200' },
  green: { border: 'border-emerald-500', cell: 'bg-emerald-100 dark:bg-emerald-900/30 text-slate-700 dark:text-slate-200' },
}

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Computa os dias que serão exibidos nas colunas
const displayedDays = computed(() => {
  const days = []
  let startDate = new Date(props.date)
  
  if (props.daysCount === 7) {
    const dayOfWeek = startDate.getDay()
    startDate.setDate(startDate.getDate() - dayOfWeek)
  }

  for (let i = 0; i < props.daysCount; i++) {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    days.push({
      dateObj: d,
      day: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      weekday: WEEKDAYS_SHORT[d.getDay()],
      isToday: d.toDateString() === new Date().toDateString()
    })
  }
  return days
})

// Pega os eventos
const eventsByDay = computed(() => {
  return displayedDays.value.map(day => {
    return props.events.filter(event => {
      return event.startDay === day.day
    })
  })
})
</script>

<template>
  <div class="flex flex-col h-[700px] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
    <!-- Cabeçalho (Dias) -->
    <div class="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div class="w-16 shrink-0 border-r border-slate-200 dark:border-slate-800"></div>
      
      <div class="flex-1 grid" :style="{ gridTemplateColumns: `repeat(${daysCount}, minmax(0, 1fr))` }">
        <div 
          v-for="day in displayedDays" 
          :key="day.dateObj.toISOString()"
          class="flex flex-col items-center justify-center py-3 border-r border-slate-200 dark:border-slate-800 last:border-r-0"
        >
          <span class="text-[12px] font-medium text-slate-500 uppercase">{{ day.weekday }}</span>
          <div 
            class="mt-1 flex items-center justify-center size-8 rounded-full text-lg cursor-pointer transition-colors"
            :class="day.isToday ? 'bg-orange-500 text-white font-bold shadow-sm' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'"
          >
            {{ day.day }}
          </div>
        </div>
      </div>
    </div>

    <!-- Área de Dia Todo (All Day) -->
    <div class="flex border-b-2 border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
      <div class="w-16 shrink-0 border-r border-slate-200 dark:border-slate-800 flex items-center justify-center">
        <span class="text-[10px] text-slate-400 font-medium">Dia todo</span>
      </div>
      <div class="flex-1 grid" :style="{ gridTemplateColumns: `repeat(${daysCount}, minmax(0, 1fr))` }">
        <div 
          v-for="(day, i) in displayedDays" 
          :key="'allday-' + i"
          class="border-r border-slate-200 dark:border-slate-800 last:border-r-0 min-h-[60px] p-1 flex flex-col gap-1 relative group/allday hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
          @click="$emit('add-task', day.dateObj)"
        >
          <div
            v-for="evt in eventsByDay[i]"
            :key="evt.id"
            class="self-start w-full border-l-4 py-1 px-2 shadow-sm rounded-r-md truncate z-10"
            :class="[
              eventColors[evt.color].cell, 
              eventColors[evt.color].border,
              evt.editable ? 'pointer-events-auto cursor-pointer hover:brightness-95 transition-all' : 'pointer-events-none opacity-80'
            ]"
            @click.stop="evt.editable ? $emit('edit-task', evt) : null"
          >
            <span class="text-[11px] font-medium">{{ evt.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Corpo (Grade de Horas) -->
    <div class="flex-1 flex overflow-y-auto relative scroll-thin">
      <!-- Eixo de tempo -->
      <div class="w-16 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative">
        <div 
          v-for="hour in hours" 
          :key="hour"
          class="h-16 relative flex justify-center"
        >
          <span class="text-[11px] text-slate-400 -translate-y-2.5 bg-white dark:bg-slate-900 px-1">{{ hour }}</span>
        </div>
      </div>
      
      <!-- Grade -->
      <div class="flex-1 grid relative" :style="{ gridTemplateColumns: `repeat(${daysCount}, minmax(0, 1fr))` }">
        <div 
          v-for="(day, i) in displayedDays" 
          :key="'grid-' + i"
          class="border-r border-slate-100 dark:border-slate-800 last:border-r-0 relative"
          :class="{'bg-slate-50/30 dark:bg-slate-800/20': day.isToday}"
        >
          <div 
            v-for="hour in hours" 
            :key="'grid-hour-' + hour"
            class="h-16 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            @click="$emit('add-task', day.dateObj)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-thin::-webkit-scrollbar {
  width: 8px;
}
.scroll-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark .scroll-thin::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
