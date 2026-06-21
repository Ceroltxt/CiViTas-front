<script setup lang="ts">
definePageMeta({ sidebarWidget: 'project' })

const user = useCurrentUser()
const { stats, agenda, ranking, currentUserRank, teams } = useInicioData()
const teamDetails = useTeamsData()
const teamsModalOpen = ref(false)
const rankingOpen = ref(false)

// Quatro tarefas a fazer para o resumo da home.
const allTasks = useTasksData()
const myTasks = computed(() =>
  allTasks.filter((t) => !t.personal && t.status !== 'concluido' && t.status !== 'atrasado').slice(0, 4),
)
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
    <!-- Saudação -->
    <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
      Olá, {{ user.name.split(' ')[0] }}!
    </h1>

    <!-- Cartões de estatística -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <InicioStatCard v-for="s in stats" :key="s.id" v-bind="s" />
    </div>

    <!-- Hoje + Ranking -->
    <div class="flex gap-4 items-stretch">
      <UiSectionCard class="flex-1 min-w-0">
        <template #header>
          <div class="flex items-start gap-2.5">
            <UIcon name="i-heroicons-calendar" class="mt-0.5 size-5 text-slate-800 dark:text-slate-100" />
            <div>
              <h2 class="font-semibold text-slate-800 dark:text-slate-100">Suas prioridades hoje</h2>
            </div>
          </div>
        </template>
        <InicioAgendaList :items="agenda" />
        <UButton
          to="/colaborador/calendario"
          variant="link"
          trailing-icon="i-heroicons-arrow-right"
          label="Ver calendário"
          class="mt-4 !p-0 font-semibold text-indigo-500"
        />
      </UiSectionCard>

      <!-- Barra lateral de Ranking de Colaboradores -->
      <div
        class="w-12 sm:w-16 shrink-0 flex flex-col items-center justify-between py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        @click="rankingOpen = true"
      >
        <UIcon name="i-heroicons-trophy" class="size-6 text-slate-500 dark:text-slate-400" />
        <span class="font-display font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase select-none [writing-mode:vertical-lr] rotate-180 my-auto py-4 text-xs sm:text-sm">
          RANKING
        </span>
        <UIcon name="i-heroicons-chevron-left" class="size-5 text-slate-500 dark:text-slate-400" />
      </div>
    </div>

    <!-- USlideover para o Ranking -->
    <USlideover v-model:open="rankingOpen" side="right" :ui="{ content: 'w-80 sm:w-96' }">
      <template #content>
        <div class="flex h-full flex-col p-5 bg-white dark:bg-slate-900">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
            <h3 class="font-display text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <UIcon name="i-heroicons-trophy" class="size-5 text-orange-500" />
              Ranking de Colaboradores
            </h3>
            <UButton
              size="sm"
              color="neutral"
              variant="ghost"
              class="size-8 p-0 flex items-center justify-center"
              @click="rankingOpen = false"
            >
              <UIcon name="i-heroicons-x-mark" class="size-5 text-slate-500" />
            </UButton>
          </div>
          
          <div class="flex-1 overflow-y-auto min-h-0">
            <InicioRankingList :entries="ranking" :me="currentUserRank" />
          </div>

          <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <UButton
              block
              color="neutral"
              variant="outline"
              size="md"
              class="w-full flex justify-center py-2 text-indigo-500 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900 font-semibold"
              label="Ver mais"
            />
          </div>
        </div>
      </template>
    </USlideover>

    <!-- Projetos + Equipes -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <UiSectionCard title="Minhas Tarefas">
        <template #action>
          <UButton to="/colaborador/minhas-tarefas" variant="link" trailing-icon="i-heroicons-arrow-right" label="Ver Todos" class="!p-0 text-indigo-500" />
        </template>
        <InicioTasksCard :tasks="myTasks" />
      </UiSectionCard>

      <UiSectionCard title="Minhas Equipes">
        <template #action>
          <UButton
            variant="link"
            trailing-icon="i-heroicons-arrow-right"
            label="Ver Todos"
            class="!p-0 text-indigo-500"
            @click="teamsModalOpen = true"
          />
        </template>
        <InicioTeamsCard :teams="teams" />
      </UiSectionCard>
    </div>

    <InicioTeamsModal v-model:open="teamsModalOpen" :teams="teamDetails" />
  </div>
</template>
