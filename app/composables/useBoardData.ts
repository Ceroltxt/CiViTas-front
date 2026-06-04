import type { StatusKey, Task, TimelineGroup } from '~/types'
import { tasksSchema, timelineGroupsSchema } from '~/schemas'
import { mockBoardTasks, mockTimeline } from '~/mocks'

// Backend: `fetchBoardTasks()` em `~/services`.
export function useBoardData(): Task[] {
  return tasksSchema.parse(mockBoardTasks, 'boardTasks')
}

export function groupByStatus(tasks: Task[]): Record<StatusKey, Task[]> {
  return tasks.reduce(
    (acc, task) => {
      ;(acc[task.status] ||= []).push(task)
      return acc
    },
    {} as Record<StatusKey, Task[]>,
  )
}

/** Régua de dias da timeline (21 Mai → 19 Jun de 2026). */
export function useTimelineRuler() {
  const months = [
    { label: 'Mai 2026', days: range(21, 31) },
    { label: 'Jun 2026', days: range(1, 19) },
  ]
  const totalDays = months.reduce((n, m) => n + m.days.length, 0)
  return { months, totalDays }
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// Backend: `fetchTimeline()` em `~/services`.
export function useTimelineData(): { groups: TimelineGroup[] } {
  return { groups: timelineGroupsSchema.parse(mockTimeline, 'timeline') }
}
