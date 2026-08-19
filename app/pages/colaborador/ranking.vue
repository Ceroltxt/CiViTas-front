<script setup lang="ts">
import { computed, ref } from 'vue'
import { getLeaderboard } from '~/composables/useRankingSystem'
import { useCurrentUser } from '~/composables/useCurrentUser'

definePageMeta({ sidebarWidget: 'none' })

const leaderboard = getLeaderboard()
const currentUser = useCurrentUser()

const top3 = computed(() => leaderboard.slice(0, 3))
const showAllRank = ref(false)
const remainingRank = computed(() => showAllRank.value ? leaderboard : leaderboard.slice(0, 5)) 

const myRank = computed(() => leaderboard.find(r => r.user.id === currentUser.id))
const showMyRankAtBottom = computed(() => {
  if (!myRank.value) return false
  return !showAllRank.value && myRank.value.position > 5
})

function getInitials(name: string) {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const filters = ['Semanal', 'Mensal', 'Trimestral', 'Por Projeto', 'Por Equipe']
const activeFilter = ref('Mensal')

function getMedalColor(position: number) {
  if (position === 1) return 'text-amber-500' // Ouro
  if (position === 2) return 'text-slate-400' // Prata
  if (position === 3) return 'text-orange-600' // Bronze
  return 'text-slate-300'
}

function getRankBarColor(position: number) {
  if (position === 1) return 'bg-gradient-to-r from-orange-400 to-rose-500'
  if (position === 2) return 'bg-gradient-to-r from-orange-400 to-rose-500'
  if (position === 3) return 'bg-gradient-to-r from-orange-400 to-rose-500'
  return 'bg-gradient-to-r from-orange-400 to-rose-500'
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <UIcon name="i-heroicons-trophy" class="size-7 text-orange-500" />
        Ranking de Desempenho
      </h1>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="f in filters"
        :key="f"
        class="px-4 py-1.5 text-sm font-semibold rounded-full border transition-colors"
        :class="activeFilter === f 
          ? 'bg-rose-500 text-white border-rose-500' 
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'"
        @click="activeFilter = f"
      >
        {{ f }}
      </button>
    </div>

    <!-- Top 3 Pódio -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
      <!-- 2º Lugar -->
      <div v-if="top3[1]" class="order-2 md:order-1 flex flex-col items-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden h-full">
        <UIcon name="i-heroicons-trophy" class="absolute -right-8 -top-8 size-48 text-slate-50 dark:text-slate-800/20 -rotate-12" />
        <UAvatar :src="top3[1].user.avatar" :alt="top3[1].user.name" size="3xl" class="ring-4 ring-slate-100 dark:ring-slate-800 relative z-10" />
        <div class="mt-5 text-center relative z-10 space-y-1">
          <UIcon name="i-heroicons-trophy" class="size-6 mx-auto text-slate-400" />
          <h2 class="text-[17px] font-bold text-slate-800 dark:text-slate-100">{{ top3[1].user.name }}</h2>
          <p class="text-[11px] text-slate-400 font-medium">#2 · {{ activeFilter }}</p>
          <div class="pt-3 flex items-center justify-center gap-1 text-orange-500 font-black text-3xl tracking-tight">
            <UIcon name="i-heroicons-star-solid" class="size-6" />
            <span>{{ top3[1].stars }}</span>
          </div>
        </div>
      </div>

      <!-- 1º Lugar -->
      <div v-if="top3[0]" class="order-1 md:order-2 flex flex-col items-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border-2 border-rose-200 dark:border-rose-900 relative overflow-hidden transform md:-translate-y-4 h-full">
        <div class="absolute inset-0 bg-gradient-to-b from-orange-50 to-transparent dark:from-orange-900"></div>
        <UAvatar :src="top3[0].user.avatar" :alt="top3[0].user.name" size="3xl" class="ring-4 ring-rose-200 dark:ring-rose-800 relative z-10" />
        <div class="mt-5 text-center relative z-10 space-y-1">
          <svg class="w-7 h-7 mx-auto text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
          </svg>
          <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ top3[0].user.name }}</h2>
          <p class="text-xs text-slate-400 font-medium">#1 · {{ activeFilter }}</p>
          <div class="pt-3 flex items-center justify-center gap-1 text-orange-500 font-black text-4xl tracking-tight">
            <UIcon name="i-heroicons-star-solid" class="size-7" />
            <span>{{ top3[0].stars }}</span>
          </div>
        </div>
      </div>

      <!-- 3º Lugar -->
      <div v-if="top3[2]" class="order-3 md:order-3 flex flex-col items-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden h-full">
        <UIcon name="i-heroicons-check-badge" class="absolute -right-8 -top-8 size-48 text-slate-50 dark:text-slate-800/20 -rotate-12" />
        <UAvatar :src="top3[2].user.avatar" :alt="top3[2].user.name" size="3xl" class="ring-4 ring-slate-100 dark:ring-slate-800 relative z-10" />
        <div class="mt-5 text-center relative z-10 space-y-1">
          <UIcon name="i-heroicons-check-badge" class="size-6 mx-auto text-slate-400" />
          <h2 class="text-[17px] font-bold text-slate-800 dark:text-slate-100">{{ top3[2].user.name }}</h2>
          <p class="text-[11px] text-slate-400 font-medium">#3 · {{ activeFilter }}</p>
          <div class="pt-3 flex items-center justify-center gap-1 text-orange-500 font-black text-3xl tracking-tight">
            <UIcon name="i-heroicons-star-solid" class="size-6" />
            <span>{{ top3[2].stars }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Container Inferior: Ranking Completo e Regras -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
      
      <!-- Ranking Restante -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Ranking completo</h3>
        <div class="space-y-4 flex-1">
          
          <div v-for="entry in remainingRank" :key="entry.user.id" class="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-slate-200">
            <span class="w-8 text-center text-sm font-bold text-slate-500">#{{ entry.position }}</span>
            <UAvatar :src="entry.user.avatar" :alt="entry.user.name" size="md" />
            <div class="flex-1 min-w-0 pr-4">
              <h4 class="text-[15px] font-bold text-slate-700 dark:text-slate-200 truncate">{{ entry.user.name }}</h4>
              <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                <div class="h-full rounded-full" :class="getRankBarColor(entry.position)" :style="{ width: `${(entry.stars / top3[0].stars) * 100}%` }"></div>
              </div>
            </div>
            <div class="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-black text-lg w-20 justify-end">
              <UIcon name="i-heroicons-star-solid" class="size-5 text-orange-400" />
              <span>{{ entry.stars }}</span>
            </div>
          </div>

          <!-- Posição do Usuário caso não esteja no Top 5 -->
          <div v-if="showMyRankAtBottom && myRank" class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-4 bg-rose-50 dark:bg-slate-800 p-4 rounded-2xl border border-rose-200 dark:border-slate-700 shadow-sm">
              <span class="w-8 text-center text-[15px] font-black text-rose-500">#{{ myRank.position }}</span>
              <UAvatar :src="myRank.user.avatar" :alt="myRank.user.name" size="md" />
              <div class="flex-1 min-w-0 pr-4">
                <h4 class="text-[15px] font-bold text-slate-800 dark:text-slate-100 truncate flex items-center gap-2">
                  {{ myRank.user.name }} 
                  <span class="bg-rose-200 text-rose-700 dark:bg-rose-900 dark:text-rose-300 text-[10px] px-2 py-0.5 rounded-lg uppercase tracking-wider font-bold">Você</span>
                </h4>
                <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-2.5 overflow-hidden">
                  <div class="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500" :style="{ width: `${(myRank.stars / top3[0].stars) * 100}%` }"></div>
                </div>
              </div>
              <div class="flex items-center gap-1 text-slate-800 dark:text-slate-100 font-black text-lg w-20 justify-end">
                <UIcon name="i-heroicons-star-solid" class="size-5 text-orange-400" />
                <span>{{ myRank.stars }}</span>
              </div>
            </div>
          </div>

          <div class="pt-4 flex justify-center">
            <UButton 
              v-if="!showAllRank"
              variant="ghost" 
              color="gray" 
              class="font-semibold text-slate-500 hover:text-slate-800"
              @click="showAllRank = true"
            >
              Ver mais posições
            </UButton>
            <UButton 
              v-else
              variant="ghost" 
              color="gray" 
              class="font-semibold text-slate-500 hover:text-slate-800"
              @click="showAllRank = false"
            >
              Mostrar menos
            </UButton>
          </div>

        </div>
      </div>

      <!-- Regras de Pontuação -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Regras de pontuação</h3>
        <div class="space-y-3">
          
          <div class="flex items-center justify-between border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30">
            <span class="text-sm text-slate-600 dark:text-slate-300 font-medium">Concluída <strong class="text-slate-800 dark:text-slate-100">ANTES</strong> do prazo</span>
            <div class="flex items-center gap-1 bg-rose-500 text-white px-2 py-0.5 rounded-lg text-xs font-bold shadow-sm">
              +3 <UIcon name="i-heroicons-star-solid" class="size-3" />
            </div>
          </div>
          
          <div class="flex items-center justify-between border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30">
            <span class="text-sm text-slate-600 dark:text-slate-300 font-medium">Concluída <strong class="text-slate-800 dark:text-slate-100">NO</strong> prazo</span>
            <div class="flex items-center gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold">
              +1 <UIcon name="i-heroicons-star-solid" class="size-3" />
            </div>
          </div>
          
          <div class="flex items-center justify-between border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30">
            <span class="text-sm text-slate-600 dark:text-slate-300 font-medium">Concluída <strong class="text-slate-800 dark:text-slate-100">APÓS</strong> o prazo</span>
            <div class="flex items-center gap-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-lg text-xs font-bold">
              0 <UIcon name="i-heroicons-star-solid" class="size-3" />
            </div>
          </div>

          <div class="flex items-center justify-between border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30">
            <span class="text-sm text-slate-600 dark:text-slate-300 font-medium">Reaberta após conclusão</span>
            <div class="flex items-center gap-1 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 px-2 py-0.5 rounded-lg text-xs font-bold">
              -2 <UIcon name="i-heroicons-star-solid" class="size-3" />
            </div>
          </div>

        </div>
        <p class="mt-6 text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
          A pontuação considera a cadeia de responsáveis: o sistema audita em qual momento houve o atraso para evitar injustiças após transferências.
        </p>
      </div>

    </div>
  </div>
</template>
