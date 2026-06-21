import type { PriorityKey, Task } from '~/types'
import { tasksSchema } from '~/schemas'
import { mockTasks } from '~/mocks'
import { ref } from 'vue'

const tasksRef = ref<Task[]>(tasksSchema.parse(mockTasks, 'tasks'))

/** Cor do "chip" de equipe/área. */
export function useTeamTagClass(team?: string): string {
  const map: Record<string, string> = {
    Backend: 'text-blue-600 bg-blue-50',
    Frontend: 'text-indigo-600 bg-indigo-50',
    DevOps: 'text-emerald-600 bg-emerald-50',
  }
  return (team && map[team]) || 'text-slate-600 bg-slate-100'
}

// Backend: `fetchTasks()` em `~/services`.
export function useTasksData(): Task[] {
  return tasksRef.value
}

/** Agrupa tarefas por prioridade preservando a ordem alta → média → baixa. */
export function groupTasksByPriority(tasks: Task[]) {
  const order: PriorityKey[] = ['critica', 'alta', 'media', 'baixa']
  return order
    .map((key) => ({ key, tasks: tasks.filter((t) => t.priority === key) }))
    .filter((group) => group.tasks.length > 0)
}
