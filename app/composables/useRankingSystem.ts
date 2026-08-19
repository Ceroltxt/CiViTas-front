import type { RankingEntry, UserStats, UserSummary } from '~/types'
import { mockCurrentUser } from '~/mocks'
import { useTasksData } from '~/composables/useTasksData'

// Helper para gerar um número aleatório (usado apenas nos mocks)
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 20 usuários fictícios para preencher o ranking (apenas para exibição estática base).
export const FICTITIOUS_USERS: UserSummary[] = [
  { id: 'u1', name: 'Vital Costa', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 'u2', name: 'Marina Reis', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 'u3', name: 'André Luz', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: 'u4', name: 'Beatriz Sá', avatar: 'https://i.pravatar.cc/150?img=20' },
  { id: 'u5', name: 'Rafael Tavares', avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: 'u6', name: 'Carla Dias', avatar: 'https://i.pravatar.cc/150?img=24' },
  { id: 'u7', name: 'Eduardo Lima', avatar: 'https://i.pravatar.cc/150?img=51' },
  { id: 'u8', name: 'Fernanda Souza', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 'u9', name: 'Gabriel Alves', avatar: 'https://i.pravatar.cc/150?img=60' },
  { id: 'u10', name: 'Helena Moraes', avatar: 'https://i.pravatar.cc/150?img=31' },
  { id: 'u11', name: 'Igor Santos', avatar: 'https://i.pravatar.cc/150?img=53' },
  { id: 'u12', name: 'Juliana Castro', avatar: 'https://i.pravatar.cc/150?img=42' },
  { id: 'u13', name: 'Lucas Mendes', avatar: 'https://i.pravatar.cc/150?img=68' },
  { id: 'u14', name: 'Mônica Silva', avatar: 'https://i.pravatar.cc/150?img=10' },
  { id: 'u15', name: 'Nelson Freitas', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 'u16', name: 'Olívia Nunes', avatar: 'https://i.pravatar.cc/150?img=28' },
  { id: 'u17', name: 'Paulo Ramos', avatar: 'https://i.pravatar.cc/150?img=55' },
  { id: 'u18', name: 'Quintino Moura', avatar: 'https://i.pravatar.cc/150?img=61' },
  { id: 'u19', name: 'Renata Valim', avatar: 'https://i.pravatar.cc/150?img=35' },
  { id: 'u20', name: 'Sérgio Nogueira', avatar: 'https://i.pravatar.cc/150?img=14' },
]

/**
 * Retorna estatísticas fictícias para os 20 usuários do topo.
 */
function getMockUserStats(userId: string): UserStats {
  const index = FICTITIOUS_USERS.findIndex(u => u.id === userId)
  if (index === -1) {
    return { completedBeforeDeadline: 0, completedOnTime: 0, completedLate: 0, reopened: 0 }
  }
  
  const baseStarsTarget = 150 - (index * 5)
  const beforeDeadline = Math.floor(baseStarsTarget / 3)
  const remainder = baseStarsTarget % 3
  
  return {
    completedBeforeDeadline: beforeDeadline,
    completedOnTime: remainder + randomInt(0, 5),
    completedLate: randomInt(0, 10),
    reopened: randomInt(0, 1),
  }
}

/**
 * Calcula a pontuação real a partir do histórico de tarefas.
 */
export function calculateStarsFromStats(stats: UserStats): number {
  return (stats.completedBeforeDeadline * 3) + 
         (stats.completedOnTime * 1) + 
         (stats.completedLate * 0) - 
         (stats.reopened * 2)
}

/**
 * Analisa as tarefas do usuário atual e retorna suas estatísticas.
 */
export function calculateCurrentUserStats(): UserStats {
  const tasks = useTasksData()
  const stats: UserStats = {
    completedBeforeDeadline: 0,
    completedOnTime: 0,
    completedLate: 0,
    reopened: 0
  }
  
  tasks.forEach(task => {
    if (task.auditLog) {
      const reopenCount = task.auditLog.filter(log => log.message.toLowerCase().includes('reabert')).length
      stats.reopened += reopenCount
    }

    if (task.status === 'concluido') {
      if (task.stars === 3) {
        stats.completedBeforeDeadline++
      } else if (task.stars === 0) {
        stats.completedLate++
      } else {
        stats.completedOnTime++
      }
    } else if (task.status === 'atrasado') {
        stats.completedLate++
    }
  })
  
  return stats
}

/**
 * Gera e retorna a lista dinâmica completa do Ranking (Leaderboard).
 */
export function getLeaderboard(): RankingEntry[] {
  const leaderboard: RankingEntry[] = []

  FICTITIOUS_USERS.forEach(user => {
    const stats = getMockUserStats(user.id)
    leaderboard.push({
      position: 0,
      user,
      stars: calculateStarsFromStats(stats),
      stats
    })
  })

  const myStats = calculateCurrentUserStats()
  leaderboard.push({
    position: 0,
    user: mockCurrentUser,
    stars: calculateStarsFromStats(myStats),
    stats: myStats
  })

  leaderboard.sort((a, b) => b.stars - a.stars)
  
  leaderboard.forEach((entry, index) => {
    entry.position = index + 1
  })

  return leaderboard
}
