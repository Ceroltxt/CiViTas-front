<script setup lang="ts">
import { computed, ref } from 'vue'
import { fetchRanking } from '~/services'
import { useCurrentUser } from '~/composables/useCurrentUser'
import type { RankingEntry } from '~/types'

// Busca o ranking mensal no backend.
const {
  data: rankingData,
  pending,
  error,
  refresh,
} = await useAsyncData(
  'colaborador-ranking',
  () => fetchRanking(),
)

const leaderboard = computed<RankingEntry[]>(() => rankingData.value ?? [])
const currentUser = useCurrentUser()

const currentUserId = computed(() => String(currentUser.id))

const top3 = computed(() => leaderboard.value.slice(0, 3))

const showAllRank = ref(false)

const tableRank = computed(() =>
  showAllRank.value
    ? leaderboard.value
    : leaderboard.value.slice(0, 5),
)

const myRank = computed(() =>
  leaderboard.value.find(
    entry => String(entry.user.id) === currentUserId.value,
  ),
)

const showMyRankAtBottom = computed(() =>
  !showAllRank.value
  && !!myRank.value
  && myRank.value.position > 5,
)

// O backend disponibiliza somente o ranking mensal.
const activeFilter = 'Mensal'

type EvolutionDirection = 'up' | 'down' | 'same'

interface Evolution {
  value: number
  direction: EvolutionDirection
}

function getEvolution(_index: number): Evolution {
  return {
    value: 0,
    direction: 'same',
  }
}

// Evita divisão por zero quando não há pontuação.
const maxStars = computed(() => leaderboard.value[0]?.stars ?? 0)

function getRankBarWidth(entry: RankingEntry) {
  if (maxStars.value <= 0) return '0%'

  return `${Math.max(0, entry.stars) / maxStars.value * 100}%`
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

        <span class="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
          Mensal
        </span>
      </div>

      <!-- Carregamento -->
      <div v-if="pending" class="flex flex-col items-center justify-center px-5 py-12">
        <UIcon name="i-heroicons-arrow-path" class="size-8 animate-spin text-orange-500" />
        <p class="mt-3 text-sm text-slate-500">Carregando ranking...</p>
      </div>

      <!-- Erro -->
      <div v-else-if="error" class="flex flex-col items-center justify-center px-5 py-12 text-center">
        <UIcon name="i-heroicons-exclamation-circle" class="size-8 text-rose-500" />
        <p class="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Não foi possível carregar o ranking.
        </p>
        <p class="mt-1 text-xs text-slate-500">
          Verifique sua conexão e tente novamente.
        </p>
        <button
          type="button"
          class="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600"
          @click="refresh()"
        >
          Tentar novamente
        </button>
      </div>

      <!-- Ranking vazio -->
      <div v-else-if="leaderboard.length === 0" class="px-5 py-12 text-center">
        <UIcon name="i-heroicons-trophy" class="mx-auto size-9 text-slate-300" />
        <p class="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
          Ainda não há pontuações neste período.
        </p>
        <p class="mt-1 text-xs text-slate-400">
          As pontuações aparecerão aqui quando houver registros.
        </p>
      </div>

      <!-- Top 3 com pedestais -->
      <div v-else class="flex items-end justify-center gap-4 px-5 pb-0 pt-8 sm:gap-8">
        <!-- 2º -->
        <div v-if="top3[1]" class="flex w-28 flex-col items-center sm:w-32">
          <div class="relative">
            <UAvatar :src="top3[1].user.avatar" :alt="top3[1].user.name" size="xl" class="ring-3 ring-slate-300" />
            <span class="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-slate-400 text-xs font-black text-white shadow">2</span>
          </div>
          <p class="mt-2 truncate text-center text-sm font-bold text-slate-700 dark:text-slate-200 w-full">{{ top3[1].user.name }}</p>
          <p class="flex items-center gap-1 text-sm font-bold text-orange-500">
            <UIcon name="i-heroicons-star-solid" class="size-3.5" />{{ top3[1].stars }} pontos
          </p>
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
          <p class="flex items-center gap-1 text-sm font-bold text-orange-500">
            <UIcon name="i-heroicons-star-solid" class="size-3.5" />{{ top3[0].stars }} pontos
          </p>
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
          <p class="flex items-center gap-1 text-sm font-bold text-orange-500">
            <UIcon name="i-heroicons-star-solid" class="size-3.5" />{{ top3[2].stars }} pontos
          </p>
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
            :class="String(entry.user.id) === currentUserId ? 'bg-orange-50/40 dark:bg-orange-500/5' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'"
          >
            <!-- Posição -->
            <span class="w-14 text-base font-black" :class="entry.position <= 3 ? 'text-orange-500' : 'text-slate-400'">{{ entry.position }}</span>

            <!-- Avatar + Nome + Barra -->
            <div class="flex flex-1 items-center gap-3 min-w-0 pr-4">
              <UAvatar :src="entry.user.avatar" :alt="entry.user.name" size="sm" />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="truncate text-sm font-bold text-slate-700 dark:text-slate-200">{{ entry.user.name }}</span>
                  <span v-if="String(entry.user.id) === currentUserId" class="shrink-0 rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">Você</span>
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
                <span class="text-sm text-slate-300">—</span>
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
              { label: 'Concluída <strong>ANTES</strong> do prazo', value: '+2', bg: 'bg-orange-500 text-white' },
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
      </div>
    </div>
  </div>
</template>