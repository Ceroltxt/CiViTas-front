<script setup lang="ts">
import type { Task, UserSummary } from '~/types'
import { computed, ref, onMounted } from 'vue'

const props = defineProps<{
  tasks?: Task[]
  selectedIds?: string[]
  isSelecting?: boolean
}>()

const emit = defineEmits(['edit', 'add-task', 'update:selectedIds', 'selection-started'])

const currentUser = useCurrentUser()

const localSelected = computed({
  get: () => props.selectedIds || [],
  set: (val) => {
    emit('update:selectedIds', val)
    if (val.length > 0) emit('selection-started')
  }
})

// Agrupamento por projeto
const groupedTasks = computed(() => {
  if (!props.tasks) return []
  
  const groups: Record<string, Task[]> = {}
  props.tasks.forEach(task => {
    const groupName = task.project || 'Sem Projeto'
    if (!groups[groupName]) {
      groups[groupName] = []
    }
    groups[groupName].push(task)
  })
  
  return Object.entries(groups).map(([title, tasks]) => ({
    title,
    tasks,
    expanded: ref(true)
  }))
})

// Gerar a régua de dias baseada numa janela de tempo (ex: 4 semanas começando do último domingo)
const startDate = new Date(2026, 7, 9) // Começa num domingo, aprox na data do projeto
const weeksCount = 4
const daysCount = weeksCount * 7

interface DayInfo {
  date: Date
  dayLabel: string
  dayOfMonth: number
  isWeekend: boolean
  isToday: boolean
}

interface WeekInfo {
  label: string
  days: DayInfo[]
}

const today = new Date(2026, 7, 20) // "Hoje" mockado para a demo (20 Ago 2026)

const timelineWeeks = computed<WeekInfo[]>(() => {
  const weeks: WeekInfo[] = []
  const shortDays = ['do', '2ª', '3ª', '4ª', '5ª', '6ª', 'sá']
  const monthsShort = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  
  for (let w = 0; w < weeksCount; w++) {
    const weekDays: DayInfo[] = []
    
    for (let d = 0; d < 7; d++) {
      const current = new Date(startDate)
      current.setDate(startDate.getDate() + (w * 7) + d)
      
      const isWeekend = current.getDay() === 0 || current.getDay() === 6
      const isToday = current.getDate() === today.getDate() && current.getMonth() === today.getMonth() && current.getFullYear() === today.getFullYear()
      
      weekDays.push({
        date: current,
        dayLabel: shortDays[current.getDay()],
        dayOfMonth: current.getDate(),
        isWeekend,
        isToday
      })
    }
    
    // Pegar o primeiro e ultimo dia da semana para o label
    const firstDay = weekDays[0].date
    const lastDay = weekDays[6].date
    
    // Label estilo "W33 ago 17 - 23"
    const firstDayOfYear = new Date(firstDay.getFullYear(), 0, 1)
    const pastDaysOfYear = (firstDay.getTime() - firstDayOfYear.getTime()) / 86400000
    const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
    
    const monthLabel = monthsShort[firstDay.getMonth()]
    const label = `W${weekNum} ${monthLabel} ${firstDay.getDate()} - ${lastDay.getDate()}`
    
    weeks.push({
      label,
      days: weekDays
    })
  }
  return weeks
})

const allDays = computed(() => timelineWeeks.value.flatMap(w => w.days))

const DAY_WIDTH = 48 // Largura de cada dia na régua
const timelineWidth = computed(() => ({ width: `${allDays.value.length * DAY_WIDTH}px` }))
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${allDays.value.length}, ${DAY_WIDTH}px)`,
}))

const barColorMap: Record<string, string> = {
  critica: 'bg-rose-500',
  alta: 'bg-violet-500',
  media: 'bg-amber-500',
  baixa: 'bg-blue-500',
}

const statusIconMap: Record<string, string> = {
  'a-fazer': 'i-heroicons-clock',
  'em-andamento': 'i-heroicons-arrow-path',
  'concluido': 'i-heroicons-check-circle',
  'atrasado': 'i-heroicons-exclamation-circle'
}

function toggleGroup(group: any) {
  group.expanded.value = !group.expanded.value
}

// Simulador de cálculo da posição da barra
function getTaskTimelineStyle(task: Task) {
  const charSum = task.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const startIndex = (charSum % (allDays.value.length - 8)) + 1
  const span = (charSum % 5) + 2 // duração entre 2 e 6 dias
  
  return {
    gridColumn: `${startIndex + 1} / span ${span}`
  }
}

// Sincronização de Scroll
onMounted(() => {
  const leftPane = document.getElementById('left-pane-scroll')
  const rightPane = document.getElementById('right-pane-scroll')
  const rightHeader = document.getElementById('right-pane-header-scroll')
  
  if (leftPane && rightPane) {
    let isLeftHover = false
    let isRightHover = false

    leftPane.addEventListener('mouseenter', () => isLeftHover = true)
    leftPane.addEventListener('mouseleave', () => isLeftHover = false)
    rightPane.addEventListener('mouseenter', () => isRightHover = true)
    rightPane.addEventListener('mouseleave', () => isRightHover = false)

    leftPane.addEventListener('scroll', () => {
      if (isLeftHover) {
        rightPane.scrollTop = leftPane.scrollTop
      }
    })
    
    rightPane.addEventListener('scroll', () => {
      if (isRightHover) {
        leftPane.scrollTop = rightPane.scrollTop
      }
      if (rightHeader) {
        rightHeader.scrollLeft = rightPane.scrollLeft
      }
    })
  }
})
</script>

<template>
  <div class="flex flex-col sm:flex-row h-[700px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
    
    <!-- PAINEL ESQUERDO: Lista de Tarefas -->
    <div class="w-full sm:w-[420px] lg:w-[480px] xl:w-[540px] shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-800 z-10 bg-white dark:bg-slate-900">
      
      <!-- Cabeçalho do Painel Esquerdo -->
      <div class="h-14 flex items-center border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
        <div class="flex-1 px-4 flex items-center">
          <span class="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Nome</span>
        </div>
        <div class="w-24 px-2 flex items-center justify-start border-l border-slate-200 dark:border-slate-800 h-full">
          <span class="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Data final</span>
        </div>
        <div class="w-28 px-2 flex items-center justify-start border-l border-slate-200 dark:border-slate-800 h-full">
          <span class="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Responsável</span>
        </div>
        <div class="w-10 flex items-center justify-center border-l border-slate-200 dark:border-slate-800 h-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" @click="$emit('add-task')">
          <UIcon name="i-heroicons-plus-circle" class="size-4 text-slate-400" />
        </div>
      </div>

      <!-- Corpo do Painel Esquerdo -->
      <div class="flex-1 overflow-y-auto scroll-thin pb-20 relative" id="left-pane-scroll">
        <template v-for="(group, idx) in groupedTasks" :key="group.title">
          
          <!-- Cabeçalho do Grupo -->
          <div 
            class="flex items-center gap-2 px-3 py-2.5 sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mt-2 first:mt-0"
            @click="toggleGroup(group)"
          >
            <UIcon 
              :name="group.expanded.value ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'" 
              class="size-3.5 text-slate-400 transition-transform" 
            />
            <UIcon name="i-heroicons-list-bullet" class="size-4 text-slate-500 dark:text-slate-400" />
            <span class="text-[14px] font-bold text-slate-700 dark:text-slate-200">{{ group.title }}</span>
          </div>

          <!-- Linhas de Tarefas -->
          <div v-show="group.expanded.value">
            <div 
              v-for="task in group.tasks" 
              :key="task.id"
              class="flex items-center h-[42px] border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 group/row transition-colors"
              draggable="true"
            >
              <!-- Nome da Tarefa -->
              <div class="flex-1 px-2 flex items-center gap-1.5 truncate">
                <UIcon name="i-heroicons-bars-2" class="size-3.5 text-slate-400 opacity-0 group-hover/row:opacity-100 cursor-move transition-opacity shrink-0" />
                <UCheckbox 
                  v-model="localSelected" 
                  :value="task.id"
                  class="transition-opacity shrink-0" 
                  :class="{'opacity-0 group-hover/row:opacity-100': !localSelected.includes(task.id), 'opacity-100': localSelected.includes(task.id) || props.isSelecting}"
                  :ui="{ base: 'w-4 h-4' }" 
                />
                
                <UIcon 
                  :name="statusIconMap[task.status] || 'i-heroicons-check-circle'" 
                  class="size-[15px] shrink-0 ml-1" 
                  :class="{'text-blue-500': task.status === 'a-fazer', 'text-amber-500': task.status === 'em-andamento', 'text-emerald-500': task.status === 'concluido', 'text-rose-500': task.status === 'atrasado', 'text-slate-400': !task.status}"
                />
                <span 
                  class="text-[13px] text-slate-700 dark:text-slate-300 truncate cursor-pointer group-hover/row:text-violet-600 dark:group-hover/row:text-violet-400 transition-colors font-medium"
                  @click="task.personal ? $emit('edit', task) : null"
                >
                  {{ task.title }}
                </span>

                <!-- Opções de hover à direita do nome -->
                <div class="ml-auto flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                  <template v-if="task.personal">
                    <UPopover>
                      <UButton color="neutral" variant="ghost" size="xs" icon="i-heroicons-plus" class="text-slate-400 hover:text-slate-600 p-1" />
                      <template #content>
                        <div class="p-2 w-56 flex flex-col gap-2 shadow-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span class="text-xs font-semibold text-slate-500">Criar subtask</span>
                          <div class="flex gap-1">
                            <UInput placeholder="Inserir nome" size="sm" class="flex-1" />
                            <UButton label="Criar" color="primary" size="sm" class="bg-orange-400 hover:bg-orange-500 text-white border-orange-500 font-medium" />
                          </div>
                        </div>
                      </template>
                    </UPopover>
                    <UButton color="neutral" variant="ghost" size="xs" icon="i-heroicons-pencil" class="text-slate-400 hover:text-slate-600 p-1" @click="$emit('edit', task)" />
                  </template>
                </div>
              </div>
              
              <!-- Data Final -->
              <div class="w-24 px-2 flex items-center justify-start border-l border-slate-100/50 dark:border-slate-800/50 h-full">
                <span class="text-[12px] text-rose-500 font-medium truncate" :class="{'text-slate-500': task.status === 'concluido'}">{{ task.dueDate || 'Sem prazo' }}</span>
              </div>
              
              <!-- Responsável -->
              <div class="w-28 px-2 flex items-center gap-1.5 border-l border-slate-100/50 dark:border-slate-800/50 h-full truncate">
                <template v-if="task.personal && currentUser">
                  <span class="text-[12px] text-slate-600 dark:text-slate-400 truncate">{{ currentUser.name }}</span>
                </template>
                <template v-else-if="task.assignees && task.assignees.length">
                  <span class="text-[12px] text-slate-600 dark:text-slate-400 truncate">{{ task.assignees[0].name }}</span>
                </template>
                <template v-else>
                  <span class="text-[12px] text-slate-400">Não atribuído</span>
                </template>
              </div>
            </div>
            
            <!-- Botão Add Task -->
            <div class="flex items-center h-[42px] border-b border-slate-50 dark:border-slate-800/30 group/add cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors" @click="$emit('add-task')">
              <div class="flex-1 pl-[38px] px-4 flex items-center gap-2">
                <UIcon name="i-heroicons-plus" class="size-[14px] text-slate-400 group-hover/add:text-violet-500 transition-colors" />
                <span class="text-[13px] text-slate-400 group-hover/add:text-violet-500 transition-colors font-medium">Add Task</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- PAINEL DIREITO: Timeline de Gantt -->
    <div class="flex-1 flex flex-col bg-slate-50/20 dark:bg-slate-900/50 overflow-hidden relative border-l border-slate-200 dark:border-slate-800">
      
      <!-- Cabeçalho da Timeline -->
      <div class="flex flex-col h-14 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 sticky top-0 z-30">
        <div class="flex-1 overflow-hidden">
          <div class="scroll-thin overflow-x-auto h-full overflow-y-hidden" id="right-pane-header-scroll">
            <div class="min-w-max flex flex-col h-full" :style="timelineWidth">
              <!-- Linha Superior (Semanas) -->
              <div class="flex h-7 bg-slate-50/80 dark:bg-slate-900/80">
                <div 
                  v-for="week in timelineWeeks" 
                  :key="week.label"
                  class="flex items-center justify-center border-r border-slate-200/80 dark:border-slate-700/80 text-[11px] font-bold text-slate-500 tracking-wider"
                  :style="{ width: `${week.days.length * DAY_WIDTH}px` }"
                >
                  {{ week.label }}
                </div>
              </div>
              <!-- Linha Inferior (Dias) -->
              <div class="flex h-7 border-t border-slate-200/60 dark:border-slate-800/60">
                <div 
                  v-for="day in allDays" 
                  :key="day.date.toISOString()"
                  class="flex items-center justify-center border-r border-slate-200/50 dark:border-slate-800/60 text-[10px] text-slate-400 flex-col leading-none pt-0.5"
                  :style="{ width: `${DAY_WIDTH}px` }"
                  :class="{'bg-slate-100/60 dark:bg-slate-800/40': day.isWeekend}"
                >
                  <span :class="{'text-rose-500 font-bold': day.isToday}">{{ day.dayLabel }}</span>
                  <span class="text-[11px] mt-[1px]" :class="{'text-rose-500 font-bold': day.isToday, 'text-slate-600 dark:text-slate-300 font-medium': !day.isToday}">{{ day.dayOfMonth }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Corpo da Timeline (Área do Gráfico) -->
      <div class="flex-1 overflow-auto scroll-thin relative" id="right-pane-scroll">
        <!-- Fundo de Grade e Fins de Semana -->
        <div class="absolute inset-0 pointer-events-none min-w-max h-full" :style="timelineWidth">
          <div class="grid h-full" :style="gridStyle">
            <div 
              v-for="(day, i) in allDays" 
              :key="'bg-'+i"
              class="border-r border-slate-200/40 dark:border-slate-800/50 h-full transition-colors relative"
              :class="{
                'bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.015)_4px,rgba(0,0,0,0.015)_8px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.015)_4px,rgba(255,255,255,0.015)_8px)] bg-slate-100/30 dark:bg-slate-800/20': day.isWeekend
              }"
            >
              <!-- Marcador de Hoje -->
              <div v-if="day.isToday" class="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-rose-500/80 z-0">
                <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-500"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Renderização das Barras de Tarefas (Sincronizado com as linhas do painel esquerdo) -->
        <div class="relative min-w-max pb-20" :style="timelineWidth">
          <template v-for="group in groupedTasks" :key="group.title">
            
            <!-- Espaço do Cabeçalho do Grupo (altura equivalente ao left pane) -->
            <div class="h-[45px] mt-2 first:mt-0 flex items-center relative border-b border-slate-100 dark:border-slate-800">
               <!-- Hint para criar tarefa (visível no hover da linha toda) -->
            </div>

            <!-- Barras do Grupo -->
            <div v-show="group.expanded.value">
              <div 
                v-for="task in group.tasks" 
                :key="'bar-'+task.id"
                class="h-[42px] border-b border-transparent relative group/bar hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors flex items-center"
              >
                <!-- Grid interno para alinhar as barras nos dias -->
                <div class="grid absolute inset-0 w-full" :style="gridStyle">
                  <!-- A Barra -->
                  <div 
                    class="h-[22px] rounded-full shadow-sm relative flex items-center px-2.5 cursor-pointer transition-all hover:brightness-110 z-10 self-center"
                    :class="[barColorMap[task.priority] || 'bg-violet-400']"
                    :style="getTaskTimelineStyle(task)"
                    @click="task.personal ? $emit('edit', task) : null"
                  >
                    <!-- Tooltip Hover -->
                    <div class="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] px-2.5 py-1 rounded-md shadow-lg pointer-events-none whitespace-nowrap transition-all duration-200 z-50 font-medium">
                      {{ task.title }}
                      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45"></div>
                    </div>
                  </div>

                  <!-- Info ao lado da barra (Avatar) -->
                  <div class="absolute flex items-center gap-2 z-10 self-center" 
                       :style="{ 
                         gridColumnStart: parseInt(getTaskTimelineStyle(task).gridColumn.split('/')[0].trim()) + parseInt(getTaskTimelineStyle(task).gridColumn.split('span')[1].trim()), 
                         marginLeft: '8px' 
                       }">
                    <template v-if="task.personal && currentUser">
                      <UAvatar :src="currentUser.avatar" :alt="currentUser.name" size="3xs" class="ring-2 ring-white dark:ring-slate-900 shadow-sm" />
                      <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{{ currentUser.name }}</span>
                    </template>
                    <template v-else-if="task.assignees && task.assignees.length">
                      <UAvatar :src="task.assignees[0].avatar" :alt="task.assignees[0].name" size="3xs" class="ring-2 ring-white dark:ring-slate-900 shadow-sm" />
                      <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{{ task.assignees[0].name }}</span>
                    </template>
                  </div>
                </div>
              </div>
              
              <!-- Espaço do botão Add Task na Timeline -->
              <div class="h-[42px] relative flex items-center border-b border-transparent group/timelineadd cursor-pointer" @click="$emit('add-task')">
                <div class="grid absolute inset-0 w-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none" :style="gridStyle">
                  <div class="col-start-1 col-span-full flex items-center justify-center">
                    <span class="bg-slate-900 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg font-medium backdrop-blur animate-pulse">
                      Clique ou arraste para criar uma tarefa
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbars personalizadas e sincronizadas */
.scroll-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scroll-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.dark .scroll-thin::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
