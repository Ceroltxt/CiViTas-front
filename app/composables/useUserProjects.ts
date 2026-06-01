import type { ProjectProgress } from '~/types'
import { projectProgressSchema } from '~/schemas'
import { v } from '~/utils/validation'
import { mockProjects } from '~/mocks'

/** Projetos em que o colaborador está envolvido (dropdown de Quadros etc.). */
export function useUserProjects(): ProjectProgress[] {
  return v.array(projectProgressSchema).parse(mockProjects, 'userProjects')
}
