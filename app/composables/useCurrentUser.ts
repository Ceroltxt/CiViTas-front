import type { CurrentProject, ProjectDetail, UserSummary } from '~/types'
import { currentProjectSchema, projectDetailSchema, userSummarySchema } from '~/schemas'
import { mockCurrentProject, mockCurrentUser, mockProjectDetail } from '~/mocks'

// Backend: `fetchCurrentUser()` / `fetchCurrentProject()` em `~/services`.
// Os dados mock são validados pelo mesmo schema usado nas respostas da API.
const user = userSummarySchema.parse(mockCurrentUser, 'currentUser')
const project = currentProjectSchema.parse(mockCurrentProject, 'currentProject')
const projectDetail = projectDetailSchema.parse(mockProjectDetail, 'projectDetail')

export function useCurrentUser(): UserSummary {
  return user
}

export function useCurrentProject(): CurrentProject {
  return project
}

export function useProjectDetail(): ProjectDetail {
  return projectDetail
}
