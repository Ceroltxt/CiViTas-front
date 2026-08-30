import { computed } from 'vue'
import { useTasksRef } from '~/composables/useTasksData'

export interface TeamActivityEntry {
  id: string
  icon: string
  message: string
  user: string
  timestamp: string
  taskId: string
  taskTitle: string
}

export function useTeamActivity(projectName: string, teamName?: string) {
  const tasks = useTasksRef()

  return computed<TeamActivityEntry[]>(() => {
    const logs: TeamActivityEntry[] = []
    
    for (const task of tasks.value) {
      if (task.project === projectName && (!teamName || task.team === teamName)) {
        if (task.auditLog) {
          for (const log of task.auditLog) {
            logs.push({
              ...log,
              taskId: task.id,
              taskTitle: task.title,
            })
          }
        }
      }
    }

    // Sort descending by timestamp
    logs.sort((a, b) => {
      const parseDate = (dStr: string) => {
        try {
          const parts = dStr.split(' às ')
          if (parts.length !== 2) return 0
          const [day, month, year] = parts[0].split('/')
          const [hour, min] = parts[1].split(':')
          return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(min)).getTime()
        } catch {
          return 0
        }
      }
      return parseDate(b.timestamp) - parseDate(a.timestamp)
    })

    return logs
  })
}
