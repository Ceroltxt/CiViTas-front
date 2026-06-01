import { mockProjects } from '~/mocks'

/** Mapa nome do projeto → progresso geral (0–100). */
const PROJECT_PROGRESS: Record<string, number> = {
  ...Object.fromEntries(mockProjects.map((p) => [p.name, p.progress])),
  'App de Gestão Produtiva Corp.': 45,
  'Sistema de Logística': 62,
  'Portal do Cliente': 30,
  'Data Warehouse': 50,
}

/** Retorna o progresso do projeto para exibição na linha de tarefa. */
export function useProjectProgressForTask(project?: string, override?: number): number {
  if (override !== undefined) return override
  if (!project) return 0
  return PROJECT_PROGRESS[project] ?? 0
}
