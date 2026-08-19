<script setup lang="ts">
import type { TimelineBarColor, Task } from '~/types'
import { computed } from 'vue'

const props = defineProps<{
  tasks?: Task[]
}>()

const { months, totalDays } = useTimelineRuler()
const { groups } = useTimelineData()

const chartGroups = computed(() => {
  if (props.tasks) {
    const groupsMap: Record<string, any[]> = {}
    
    props.tasks.forEach(task => {
      const statusLabel = task.status === 'a-fazer' ? 'A Fazer' 
                          : task.status === 'em-andamento' ? 'Em Desenvolvimento'
                          : task.status === 'em-revisao' ? 'Em Revisão'
                          : task.status === 'concluido' ? 'Concluídas'
                          : 'Outros'
                          
      if (!groupsMap[statusLabel]) {
        groupsMap[statusLabel] = []
      }
      
      const charSum = task.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const startIndex = (charSum % 18) + 2
      const span = (charSum % 6) + 4
      
      const priorityColorMap: Record<string, string> = {
        critica: 'pink',
        alta: 'violet',
        media: 'blue',
        baixa: 'neutral'
      }
      const color = priorityColorMap[task.priority] || 'neutral'
      
      groupsMap[statusLabel].push({
        id: task.id,
        title: task.title,
        assignee: task.assignees?.[0] || { id: 'u-costa', name: 'Costa Neves', avatar: 'https://i.pravatar.cc/80?img=47' },
        startIndex,
        span,
        color
      })
    })
    
    return Object.entries(groupsMap).map(([title, tasks]) => ({
      title,
      tasks
    }))
  }
  return groups
})

const zoom = ref<'Dias' | 'Semana' | 'Meses'>('Semana')
const DAY_WIDTH = 30

const barColor: Record<TimelineBarColor, string> = {
  neutral: 'bg-slate-400',
  amber: 'bg-amber-400',
  blue: 'bg-blue-400',
  violet: 'bg-violet-500',
  pink: 'bg-pink-400',
}

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${totalDays}, ${DAY_WIDTH}px)`,
}))
const timelineWidth = computed(() => ({ width: `${totalDays * DAY_WIDTH}px` }))
</script>

<template>
  <UiSectionCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-bars-3-bottom-left" class="size-5 text-slate-500" />
        <div>
          <h2 class="font-semibold text-slate-800 dark:text-slate-100">Timeline (Gantt)</h2>
          <p class="text-xs text-slate-400">Visão geral do cronograma do projeto</p>
        </div>
      </div>
    </template>
    <template #action>
      <div class="flex items-center gap-2 text-sm text-slate-400">
        <span>Zoom:</span>
        <div class="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            v-for="option in (['Dias', 'Semana', 'Meses'] as const)"
            :key="option"
            type="button"
            class="px-3 py-1 text-sm font-medium transition-colors"
            :class="zoom === option ? 'bg-violet-50 text-violet-600' : 'text-slate-500 hover:bg-slate-50'"
            @click="zoom = option"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </template>

    <div class="scroll-thin overflow-x-auto">
      <div class="min-w-max">
        <!-- Cabeçalho: rótulos + régua -->
        <div class="flex border-b border-slate-200 dark:border-slate-800">
          <div class="grid w-[290px] shrink-0 grid-cols-2 pb-2">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Tarefa</span>
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Responsável</span>
          </div>
          <div :style="timelineWidth">
            <!-- meses -->
            <div class="flex">
              <div
                v-for="month in months"
                :key="month.label"
                class="border-l border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 dark:border-slate-800"
                :style="{ width: `${month.days.length * DAY_WIDTH}px` }"
              >
                {{ month.label }}
              </div>
            </div>
            <!-- dias -->
            <div class="grid" :style="gridStyle">
              <span
                v-for="month in months"
                :key="`days-${month.label}`"
                class="contents"
              >
                <span
                  v-for="day in month.days"
                  :key="`${month.label}-${day}`"
                  class="border-l border-slate-100 py-1 text-center text-[11px] text-slate-400 dark:border-slate-800"
                >
                  {{ day }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Linhas -->
        <template v-for="(group, gi) in chartGroups" :key="gi">
          <div
            v-if="group.title"
            class="flex items-center gap-1 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <UIcon name="i-heroicons-chevron-down" class="size-4" />
            {{ group.title }}
          </div>

          <div
            v-for="task in group.tasks"
            :key="task.id"
            class="flex items-center"
          >
            <div class="grid w-[290px] shrink-0 grid-cols-2 items-center py-2.5 pr-3">
              <span class="truncate text-sm text-slate-600 dark:text-slate-300">{{ task.title }}</span>
              <span class="flex items-center gap-2">
                <UAvatar :src="task.assignee.avatar" :alt="task.assignee.name" size="2xs" />
                <span class="truncate text-sm text-slate-500">{{ task.assignee.name }}</span>
              </span>
            </div>

            <div class="grid items-center border-l border-slate-100 dark:border-slate-800" :style="[gridStyle, timelineWidth]">
              <div
                v-if="task.span > 0"
                class="h-5 rounded-full"
                :class="barColor[task.color]"
                :style="{ gridColumn: `${task.startIndex + 1} / span ${task.span}` }"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </UiSectionCard>
</template>
