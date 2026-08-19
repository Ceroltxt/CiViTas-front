import { computed, unref, type Ref, type ComputedRef } from 'vue'
import type { Task, PriorityKey } from '~/types'
import { useTasksRef } from '~/composables/useTasksData'

export interface DashboardStatCard {
  id: string
  label: string
  value: string
  icon: string
  iconClass: string
  bgClass: string
}

const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function parseFullDate(str: string): Date | null {
  const parts = str.split('/')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[2], 10)
  return new Date(year, month, day)
}

function parseShortDate(str: string, year = 2026): Date | null {
  const parts = str.split(' ')
  if (parts.length !== 2) return null
  const day = parseInt(parts[0], 10)
  const monthIndex = MONTHS_SHORT.findIndex(m => m.toLowerCase() === parts[1].toLowerCase())
  if (monthIndex === -1) return null
  return new Date(year, monthIndex, day)
}

function isInPeriod(task: Task, from: Date, to: Date): boolean {
  const f = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()
  const t = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime()
  
  if (task.status === 'concluido' && task.completedDate) {
    const completed = parseFullDate(task.completedDate)
    if (completed && completed.getTime() < f) {
      return false
    }
  }

  if (task.startDate) {
    const start = parseFullDate(task.startDate)
    if (start && start.getTime() > t) {
      return false
    }
  }

  return true
}

const PRIORITY_WEIGHT: Record<PriorityKey, number> = { critica: 4, alta: 3, media: 2, baixa: 1 }

const STAT_PRESENTATION = {
  'a-fazer': {
    icon: 'i-heroicons-clipboard-document-list',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-pink-500 to-rose-500',
  },
  andamento: {
    icon: 'i-heroicons-play',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
  atraso: {
    icon: 'i-heroicons-exclamation-triangle',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-red-500 to-rose-600',
  },
  concluidas: {
    icon: 'i-heroicons-check-circle',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-emerald-500 to-green-600',
  },
  produtividade: {
    icon: 'i-heroicons-chart-bar',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-violet-500 to-indigo-500',
  },
}

export function useDashboardStats(dateFrom: Ref<string>, dateTo: Ref<string>) {
  const tasksRef = useTasksRef()

  const filteredTasks = computed<Task[]>(() => {
    if (!dateFrom.value || !dateTo.value) return []
    const from = new Date(dateFrom.value + 'T00:00:00')
    const to = new Date(dateTo.value + 'T23:59:59')
    
    const tasks = tasksRef.value || []
    
    return tasks.filter((task: Task) => {
      return !task.personal && isInPeriod(task, from, to)
    })
  })

  const statCards = computed<DashboardStatCard[]>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let aFazerCount = 0
    let andamentoCount = 0
    let atrasoCount = 0
    let concluidaCount = 0

    let earned = 0
    let maxPossible = 0

    filteredTasks.value.forEach(task => {
      // 1. A fazer
      if (task.status === 'a-fazer') {
        aFazerCount++
      }
      
      // 2. Em andamento (estrito)
      if (task.status === 'em-andamento') {
        andamentoCount++
      }
      
      // 4. Concluídas
      if (task.status === 'concluido') {
        concluidaCount++
      }
      
      let parsedDueDate: Date | null = null
      if (task.dueDate) {
        parsedDueDate = parseShortDate(task.dueDate)
      }

      // 3. Atrasadas
      const isOverdue = parsedDueDate && parsedDueDate.getTime() < today.getTime()
      if (isOverdue && !['concluido', 'cancelado', 'pausado'].includes(task.status)) {
        atrasoCount++
      }
      
      // 5. Productivity
      if (task.status === 'concluido' || isOverdue) {
        const weight = PRIORITY_WEIGHT[task.priority] || 0
        maxPossible += weight
        
        if (task.status === 'concluido' && task.completedDate && task.dueDate) {
          const completed = parseFullDate(task.completedDate)
          const due = parseShortDate(task.dueDate)
          
          if (completed && due) {
            const completedTime = completed.getTime()
            const dueTime = due.getTime()
            
            if (completedTime < dueTime) {
              earned += weight * 1.0
            } else if (completedTime === dueTime) {
              earned += weight * 0.85
            } else {
              earned += weight * 0.5
            }
          }
        } else if (task.status === 'concluido') {
          earned += weight * 0.7
        }
      }
    })

    const productivity = maxPossible > 0 ? Math.round((earned / maxPossible) * 100) : 0

    return [
      {
        id: 'a-fazer',
        label: 'A Fazer',
        value: String(aFazerCount),
        ...STAT_PRESENTATION['a-fazer']
      },
      {
        id: 'andamento',
        label: 'Andamento',
        value: String(andamentoCount),
        ...STAT_PRESENTATION['andamento']
      },
      {
        id: 'atraso',
        label: 'Atrasadas',
        value: String(atrasoCount),
        ...STAT_PRESENTATION['atraso']
      },
      {
        id: 'concluidas',
        label: 'Concluídas',
        value: String(concluidaCount),
        ...STAT_PRESENTATION['concluidas']
      },
      {
        id: 'produtividade',
        label: 'Produtividade',
        value: `${productivity}%`,
        ...STAT_PRESENTATION['produtividade']
      }
    ]
  })

  return {
    statCards,
    filteredTasks
  }
}
