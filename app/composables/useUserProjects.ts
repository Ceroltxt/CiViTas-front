import type { ProjectProgress } from '~/types'
import { projectProgressSchema } from '~/schemas'
import { v } from '~/utils/validation'
import { mockProjects } from '~/mocks'

/** Projetos em que o colaborador está envolvido (dropdown de Quadros etc.). */
export function useUserProjects(): ProjectProgress[] {
  const projects = v.array(projectProgressSchema).parse(mockProjects, 'userProjects')
  const user = useCurrentUser()
  
  if (user.role === 'Gestor') {
    return projects.filter(p => 
      p.teams?.some(t => t.leader === 'Milani Ribeiro')
    )
  }
  
  return projects
}
