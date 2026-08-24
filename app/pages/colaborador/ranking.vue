<script setup lang="ts">
import { computed, ref } from 'vue'
import { getLeaderboard } from '~/composables/useRankingSystem'
import { useCurrentUser } from '~/composables/useCurrentUser'

definePageMeta({ sidebarWidget: 'none' })

const leaderboard = getLeaderboard()
const currentUser = useCurrentUser()
const top3 = computed(() => leaderboard.slice(0, 3))
const showAllRank = ref(false)
const tableRank = computed(() => showAllRank.value ? leaderboard : leaderboard.slice(0, 5))
const myRank = computed(() => leaderboard.find(r => r.user.id === currentUser.id))
const showMyRankAtBottom = computed(() => !showAllRank.value && myRank.value && myRank.value.position > 5)

const filters = ['Semanal', 'Mensal', 'Trimestral', 'Por Projeto', 'Por Equipe']
const activeFilter = ref('Mensal')
const achievementsOpen = ref(false)

// Mock evolution data
const evolution: Record<string, { value: number; direction: 'up' | 'down' | 'same' }> = {
  0: { value: 2, direction: 'up' }, 1: { value: 1, direction: 'up' }, 2: { value: 1, direction: 'down' },
  3: { value: 0, direction: 'same' }, 4: { value: 3, direction: 'up' }, 5: { value: 1, direction: 'down' },
  6: { value: 2, direction: 'up' }, 7: { value: 0, direction: 'same' }, 8: { value: 1, direction: 'up' },
  9: { value: 2, direction: 'down' },
}
function getEvolution(pos: number) { return evolution[pos] ?? { value: 0, direction: 'same' as const } }

interface Achievement { id: string; icon: string; name: string; rule: string; howTo: string; count: number; requirement: number; color: string }
const achievements: Achievement[] = [
  { id: 'a1', icon: 'i-heroicons-bolt', name: 'Entrega', rule: 'A cada 3 tarefas concluídas antes do prazo.', howTo: 'Conclua tarefas antes da data de vencimento.', count: 2, requirement: 3, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
  { id: 'a2', icon: 'i-heroicons-clock', name: 'Prazo', rule: 'A cada 5 tarefas entregues dentro do prazo.', howTo: 'Entregue tarefas sem ultrapassar a data limite.', count: 5, requirement: 5, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
  { id: 'a3', icon: 'i-heroicons-fire', name: 'Sequência', rule: 'A cada 10 tarefas seguidas sem atraso.', howTo: 'Mantenha uma sequência de entregas pontuais.', count: 4, requirement: 10, color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' },
  { id: 'a4', icon: 'i-heroicons-star', name: 'Destaque', rule: 'A cada vez que ficar no Top 1 mensal.', howTo: 'Termine o mês na 1ª posição do ranking.', count: 0, requirement: 1, color: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10' },
]

function getRankBarWidth(entry: typeof leaderboard[0]) {
  return `${(entry.stars / top3.value[0].stars) * 100}%`
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          🏆 Ranking de Responsáveis
        </h1>
        <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Reconhecendo quem faz a diferença todos os dias!</p>
      </div>
    </div>

    <!-- Pódio -->
    <div class="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <!-- Filtro de período -->
      <div class="flex items-center gap-3 border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <span class="text-xs font-medium text-slate-500">Período</span>
        <div class="flex gap-1.5 overflow-x-auto">
          <button
            v-for="f in filters" :key="f" type="button"
            class="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
            :class="activeFilter === f ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200'"
            @click="activeFilter = f"
          >{{ f }}</button>
        </div>
      </div>

      <!-- Top 3 com pedestais -->
      <div class="flex items-end justify-center gap-4 px-5 pb-0 pt-8 sm:gap-8">
        <!-- 2º -->
        <div v-if="top3[1]" class="flex w-28 flex-col items-center sm:w-32">
          <div class="relative">
            <UAvatar :src="top3[1].user.avatar" :alt="top3[1].user.name" size="xl" class="ring-3 ring-slate-300" />
            <span class="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-slate-400 text-xs font-black text-white shadow">2</span>
          </div>
          <p class="mt-2 truncate text-center text-sm font-bold text-slate-700 dark:text-slate-200 w-full">{{ top3[1].user.name }}</p>
          <p class="flex items-center gap-1 text-sm font-bold text-orange-500"><UIcon name="i-heroicons-star-solid" class="size-3.5" />{{ top3[1].stars }} pontos</p>
          <div class="mt-3 flex h-20 w-full items-end justify-center rounded-t-2xl bg-slate-200/60 dark:bg-slate-700/40">
            <span class="mb-3 text-3xl">🥈</span>
          </div>
        </div>

        <!-- 1º -->
        <div v-if="top3[0]" class="flex w-28 flex-col items-center sm:w-36">
          <div class="relative">
            <UAvatar :src="top3[0].user.avatar" :alt="top3[0].user.name" size="3xl" class="ring-4 ring-orange-300 dark:ring-orange-700" />
            <span class="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-orange-500 text-xs font-black text-white shadow">1</span>
          </div>
          <p class="mt-2 truncate text-center text-base font-bold text-slate-800 dark:text-slate-100 w-full">{{ top3[0].user.name }}</p>
          <p class="flex items-center gap-1 text-sm font-bold text-orange-500"><UIcon name="i-heroicons-star-solid" class="size-3.5" />{{ top3[0].stars }} pontos</p>
          <div class="mt-3 flex h-28 w-full items-end justify-center rounded-t-2xl bg-orange-100/70 dark:bg-orange-900/20">
            <span class="mb-3 text-4xl">🥇</span>
          </div>
        </div>

        <!-- 3º -->
        <div v-if="top3[2]" class="flex w-28 flex-col items-center sm:w-32">
          <div class="relative">
            <UAvatar :src="top3[2].user.avatar" :alt="top3[2].user.name" size="xl" class="ring-3 ring-orange-300/60" />
            <span class="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-orange-700 text-xs font-black text-white shadow">3</span>
          </div>
          <p class="mt-2 truncate text-center text-sm font-bold text-slate-700 dark:text-slate-200 w-full">{{ top3[2].user.name }}</p>
          <p class="flex items-center gap-1 text-sm font-bold text-orange-500"><UIcon name="i-heroicons-star-solid" class="size-3.5" />{{ top3[2].stars }} pontos</p>
          <div class="mt-3 flex h-16 w-full items-end justify-center rounded-t-2xl bg-orange-100/40 dark:bg-orange-900/10">
            <span class="mb-3 text-3xl">🥉</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <!-- Tabela de Ranking -->
      <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <!-- Header da tabela -->
        <div class="flex items-center border-b border-slate-100 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800">
          <span class="w-14">Posição</span>
          <span class="flex-1">Responsável</span>
          <span class="w-28 text-center hidden sm:block">Pontuação</span>
          <span class="w-20 text-center">Evolução</span>
        </div>

        <!-- Linhas -->
        <div>
          <div
            v-for="entry in tableRank" :key="entry.user.id"
            class="flex items-center border-b border-slate-50 px-5 py-3 transition-colors last:border-b-0 dark:border-slate-800/50"
            :class="entry.user.id === currentUser.id ? 'bg-orange-50/40 dark:bg-orange-500/5' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'"
          >
            <!-- Posição -->
            <span class="w-14 text-base font-black" :class="entry.position <= 3 ? 'text-orange-500' : 'text-slate-400'">{{ entry.position }}</span>

            <!-- Avatar + Nome + Barra -->
            <div class="flex flex-1 items-center gap-3 min-w-0 pr-4">
              <UAvatar :src="entry.user.avatar" :alt="entry.user.name" size="sm" />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="truncate text-sm font-bold text-slate-700 dark:text-slate-200">{{ entry.user.name }}</span>
                  <span v-if="entry.user.id === currentUser.id" class="shrink-0 rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">Você</span>
                </div>
                <div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div class="h-full rounded-full bg-orange-400 transition-all" :style="{ width: getRankBarWidth(entry) }" />
                </div>
              </div>
            </div>

            <!-- Pontuação -->
            <div class="w-28 text-center hidden sm:block">
              <span class="text-lg font-black text-slate-700 dark:text-slate-200">{{ entry.stars }}</span>
              <p class="text-[10px] text-slate-400">pontos</p>
            </div>

            <!-- Evolução -->
            <div class="w-20 flex justify-center">
              <span
                v-if="getEvolution(entry.position - 1).direction === 'up'"
                class="flex items-center gap-0.5 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              >
                <UIcon name="i-heroicons-arrow-up" class="size-3" />{{ getEvolution(entry.position - 1).value }}
              </span>
              <span
                v-else-if="getEvolution(entry.position - 1).direction === 'down'"
                class="flex items-center gap-0.5 rounded-lg bg-rose-50 px-2 py-1 text-xs font-bold text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"
              >
                <UIcon name="i-heroicons-arrow-down" class="size-3" />{{ getEvolution(entry.position - 1).value }}
              </span>
              <span v-else class="text-sm text-slate-300">—</span>
            </div>
          </div>

          <!-- Usuário fora do top -->
          <div v-if="showMyRankAtBottom && myRank" class="border-t-2 border-dashed border-slate-200 dark:border-slate-700">
            <div class="flex items-center bg-orange-50/40 px-5 py-3 dark:bg-orange-500/5">
              <span class="w-14 text-base font-black text-orange-500">{{ myRank.position }}</span>
              <div class="flex flex-1 items-center gap-3 min-w-0 pr-4">
                <UAvatar :src="myRank.user.avatar" :alt="myRank.user.name" size="sm" />
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{{ myRank.user.name }}</span>
                    <span class="shrink-0 rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">Você</span>
                  </div>
                  <div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div class="h-full rounded-full bg-orange-400" :style="{ width: getRankBarWidth(myRank) }" />
                  </div>
                </div>
              </div>
              <div class="w-28 text-center hidden sm:block">
                <span class="text-lg font-black text-slate-800 dark:text-slate-100">{{ myRank.stars }}</span>
                <p class="text-[10px] text-slate-400">pontos</p>
              </div>
              <div class="w-20 flex justify-center">
                <span class="flex items-center gap-0.5 rounded-lg bg-rose-50 px-2 py-1 text-xs font-bold text-rose-500 dark:bg-rose-500/10 dark:text-rose-400">
                  <UIcon name="i-heroicons-arrow-down" class="size-3" />2
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center border-t border-slate-100 py-3 dark:border-slate-800">
          <button type="button" class="text-xs font-semibold text-slate-400 transition-colors hover:text-orange-600" @click="showAllRank = !showAllRank">
            {{ showAllRank ? 'Mostrar menos' : 'Ver mais posições' }}
          </button>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-5">
        <!-- Regras -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-3">Regras de pontuação</h3>
          <div class="space-y-2">
            <div v-for="rule in [
              { label: 'Concluída <strong>ANTES</strong> do prazo', value: '+3', bg: 'bg-orange-500 text-white' },
              { label: 'Concluída <strong>NO</strong> prazo', value: '+1', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
              { label: 'Concluída <strong>APÓS</strong> o prazo', value: '0', bg: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
              { label: 'Reaberta após conclusão', value: '-2', bg: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
            ]" :key="rule.label" class="flex items-center justify-between rounded-lg p-2.5">
              <span class="text-xs font-medium text-slate-600 dark:text-slate-300" v-html="rule.label" />
              <span class="flex items-center gap-0.5 rounded-md px-2 py-0.5 text-[11px] font-bold" :class="rule.bg">{{ rule.value }} <UIcon name="i-heroicons-star-solid" class="size-2.5" /></span>
            </div>
          </div>
          <p class="mt-3 text-[11px] leading-relaxed text-slate-400">O sistema audita a cadeia de responsáveis para evitar injustiças.</p>
        </div>

        <!-- Conquistas -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div class="mb-4">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Conquistas</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">{{ achievements.reduce((s, a) => s + Math.floor(a.count / a.requirement), 0) }} conquistas obtidas</p>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="a in achievements" :key="a.id" type="button"
              class="flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all hover:border-orange-200 relative"
              :class="a.count >= a.requirement ? `border-transparent ${a.color}` : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30'"
              @click="achievementsOpen = true"
            >
              <UIcon :name="a.icon" class="size-5" :class="a.count >= a.requirement ? '' : 'text-slate-300 dark:text-slate-600'" />
              <span class="text-[9px] font-semibold leading-tight text-center" :class="a.count >= a.requirement ? 'text-slate-600 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'">{{ a.name }}</span>
              <span v-if="Math.floor(a.count / a.requirement) > 0" class="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-orange-500 text-[8px] font-bold text-white">{{ Math.floor(a.count / a.requirement) }}</span>
            </button>
          </div>
          <button type="button" class="mt-4 flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-300" @click="achievementsOpen = true">
            Ver minhas conquistas <UIcon name="i-heroicons-arrow-right" class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Conquistas -->
    <UModal v-model:open="achievementsOpen">
      <template #content>
        <div class="max-h-[80vh] overflow-y-auto p-6">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">Minhas Conquistas</h2>
              <p class="mt-0.5 text-xs text-slate-400">{{ achievements.reduce((s, a) => s + Math.floor(a.count / a.requirement), 0) }} conquistas obtidas no total</p>
            </div>
            <button type="button" class="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" @click="achievementsOpen = false">
              <UIcon name="i-heroicons-x-mark" class="size-5" />
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="a in achievements" :key="a.id" class="flex gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div class="grid size-10 shrink-0 place-items-center rounded-xl" :class="a.count >= a.requirement ? a.color : 'bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600'">
                <UIcon :name="a.icon" class="size-5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ a.name }}</h4>
                  <span v-if="Math.floor(a.count / a.requirement) > 0" class="rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">×{{ Math.floor(a.count / a.requirement) }}</span>
                </div>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ a.rule }}</p>
                <!-- Barra de progresso para a próxima -->
                <div class="mt-2 flex items-center gap-2">
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div class="h-full rounded-full bg-orange-400 transition-all" :style="{ width: `${Math.min((a.count % a.requirement) / a.requirement * 100, 100)}%` }" />
                  </div>
                  <span class="text-[10px] font-semibold text-slate-400">{{ a.count % a.requirement }}/{{ a.requirement }}</span>
                </div>
                <p class="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400"><UIcon name="i-heroicons-light-bulb" class="size-3" />{{ a.howTo }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
