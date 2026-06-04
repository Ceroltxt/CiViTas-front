<script setup lang="ts">
definePageMeta({ sidebarWidget: 'project' })

const user = useCurrentUser()
const { stats, agenda, ranking, currentUserRank, teams } = useInicioData()
const teamDetails = useTeamsData()
const teamsModalOpen = ref(false)

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
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <UiSectionCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-start gap-2.5">
            <UIcon name="i-heroicons-calendar" class="mt-0.5 size-5 text-slate-800 dark:text-slate-100" />
            <div>
              <h2 class="font-semibold text-slate-800 dark:text-slate-100">Hoje</h2>
              <p class="text-xs text-slate-400">Suas Prioridades De Hoje</p>
            </div>
          </div>
        </template>
        <template #action>
          <UButton
            to="/colaborador/calendario"
            variant="link"
            color="primary"
            trailing-icon="i-heroicons-arrow-right"
            label="Ver Meu Calendário"
            class="p-0 text-indigo-500"
          />
        </template>
        <InicioAgendaList :items="agenda" />
        <UButton
          to="/colaborador/minhas-tarefas"
          variant="link"
          trailing-icon="i-heroicons-arrow-right"
          label="Ver Todas As Tarefas de Hoje"
          class="mt-4 p-0 font-semibold text-indigo-500"
        />
      </UiSectionCard>

      <UiSectionCard title="Ranking de Colaboradores" class="flex h-full flex-col">
        <div class="flex min-h-0 flex-1 flex-col">
          <InicioRankingList :entries="ranking" :me="currentUserRank" />
        </div>
      </UiSectionCard>
    </div>

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
