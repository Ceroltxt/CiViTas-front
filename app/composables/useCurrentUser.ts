import { reactive, watchEffect } from 'vue'
import type { CurrentProject, ProjectDetail, UserSummary } from '~/types'
import { currentProjectSchema, projectDetailSchema } from '~/schemas'
import { mockCurrentProject, mockProjectDetail } from '~/mocks'

const project = currentProjectSchema.parse(mockCurrentProject, 'currentProject')
const projectDetail = projectDetailSchema.parse(mockProjectDetail, 'projectDetail')

const currentUser = reactive<UserSummary>({
  id: 'u-costa',
  name: 'Costa Neves',
  role: 'Colaborador',
  avatar: 'https://i.pravatar.cc/80?img=47',
})

export function useCurrentUser(): UserSummary {
  try {
    const route = useRoute()
    watchEffect(() => {
      const path = route.path
      if (path.startsWith('/admin')) {
        currentUser.id = 'u-admin'
        currentUser.name = 'Costa Neves'
        currentUser.role = 'Administrador'
      } else if (path.startsWith('/gestor')) {
        currentUser.id = 'u-gestor'
        currentUser.name = 'Costa Neves'
        currentUser.role = 'Gestor'
      } else {
        currentUser.id = 'u-costa'
        currentUser.name = 'Costa Neves'
        currentUser.role = 'Colaborador'
      }
    })
  } catch (e) {
    // Evita erros em SSR ou fora de contexto setup
  }

  return currentUser
}

export function useCurrentProject(): CurrentProject {
  return project
}

export function useProjectDetail(): ProjectDetail {
  return projectDetail
}

