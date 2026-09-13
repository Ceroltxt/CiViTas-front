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

const PRIORITY_WEIGHT: Record<PriorityKey, number> = { critica: 4, alta: 3, media: 2, baixa: 1 }

const STAT_PRESENTATION = {
  'a-fazer': {
    icon: 'i-heroicons-clipboard-document-list',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-blue-500 to-sky-600',
  },
  andamento: {
    icon: 'i-heroicons-play',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
  revisao: {
    icon: 'i-heroicons-eye',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-violet-500 to-purple-600',
  },
  validar: {
    icon: 'i-heroicons-shield-check',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-cyan-500 to-sky-600',
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
  pausadas: {
    icon: 'i-heroicons-pause-circle',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-slate-500 to-slate-600',
  },
  produtividade: {
    icon: 'i-heroicons-chart-bar',
    iconClass: 'text-white',
    bgClass: 'bg-gradient-to-br from-violet-500 to-indigo-500',
  },
}

export function useDashboardStats(_dateFrom: Ref<string>, _dateTo: Ref<string>, userId?: Ref<string> | ComputedRef<string>) {
  const tasksRef = useTasksRef()

  const filteredTasks = computed<Task[]>(() => {
    const tasks = tasksRef.value || []

    return tasks.filter((task: Task) => {
      const belongsToUser = userId
        // O dashboard do colaborador mostra a carteira de trabalho. Tarefas
        // pessoais vivem na aba própria e não devem inflar os indicadores.
        ? !task.personal && task.assignees?.some((assignee) => String(assignee.id) === String(unref(userId)))
        : !task.personal
      return belongsToUser
    })
  })

  const statCards = computed<DashboardStatCard[]>(() => {
    let aFazerCount = 0
    let andamentoCount = 0
    let revisaoCount = 0
    let validarCount = 0
    let atrasoCount = 0
    let concluidaCount = 0
    let pausadaCount = 0

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

      if (task.status === 'em-revisao') {
        revisaoCount++
      }

      if (task.status === 'validar') {
        validarCount++
      }
      
      // 4. Concluídas
      if (task.status === 'concluido') {
        concluidaCount++
      }

      if (['pausado', 'cancelado'].includes(task.status)) {
        pausadaCount++
      }

      // 3. Atrasadas
      const isOverdue = task.status === 'atrasado'
      if (isOverdue) {
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
        id: 'revisao',
        label: 'Em revisão',
        value: String(revisaoCount),
        ...STAT_PRESENTATION.revisao,
      },
      {
        id: 'validar',
        label: 'A validar',
        value: String(validarCount),
        ...STAT_PRESENTATION.validar,
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
        id: 'pausadas',
        label: 'Pausadas/canceladas',
        value: String(pausadaCount),
        ...STAT_PRESENTATION.pausadas,
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
