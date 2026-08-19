<script setup lang="ts">
definePageMeta({ sidebarWidget: 'project' })

const user = useCurrentUser()
const { agenda, ranking, currentUserRank, teams } = useInicioData()
const teamDetails = useTeamsData()
const teamsModalOpen = ref(false)
const rankingOpen = ref(false)

// Filtro de período do Dashboard
const COSTA_ENTRY_DATE = '2026-06-01'
const todayISO = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})
const dateFrom = ref(todayISO.value)
const dateTo = ref(todayISO.value)

const dateLabel = computed(() => {
  if (dateFrom.value === todayISO.value && dateTo.value === todayISO.value) {
    return 'Hoje'
  }
  const format = (iso: string) => iso.split('-').reverse().join('/')
  const f = format(dateFrom.value)
  const t = format(dateTo.value)
  if (f === t) return f
  return `De ${f} até ${t}`
})

const isRange = ref(false)

watch(isRange, (range) => {
  if (!range) dateTo.value = dateFrom.value
})

watch(dateFrom, (v) => {
  if (!isRange.value) {
    dateTo.value = v
  } else {
    if (v > dateTo.value) dateTo.value = v
  }
  if (v < COSTA_ENTRY_DATE) dateFrom.value = COSTA_ENTRY_DATE
})

watch(dateTo, (v) => {
  if (!isRange.value) return
  if (v > todayISO.value) dateTo.value = todayISO.value
  if (v < dateFrom.value) dateFrom.value = v
})

const { statCards } = useDashboardStats(dateFrom, dateTo)

function resetFilter() {
  isRange.value = false
  dateFrom.value = todayISO.value
  dateTo.value = todayISO.value
}

// Tarefas a fazer para o resumo da home
const allTasks = useTasksData()
const myTasks = computed(() =>
  allTasks.filter((t) => !t.personal && t.status !== 'concluido' && t.status !== 'atrasado').slice(0, 4),
)
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
    <!-- Saudação + Filtro de Período -->
    <div class="flex flex-wrap items-end justify-between gap-3">
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        Olá, {{ user.name.split(' ')[0] }}!
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <UPopover :popper="{ placement: 'bottom-end' }">
          <UButton
            color="white"
            icon="i-heroicons-calendar-days"
            :label="dateLabel"
            class="shadow-sm font-medium text-slate-700 dark:text-slate-200 min-w-32 justify-between"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          />
          <template #content>
            <div class="p-4 space-y-4 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div class="flex items-center">
                <UCheckbox v-model="isRange" label="Selecionar um período" />
              </div>
              <div class="border-t border-slate-100 dark:border-slate-800 pt-3">
                <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {{ isRange ? 'Data inicial' : 'Data específica' }}
                </label>
                <UInput type="date" v-model="dateFrom" :min="COSTA_ENTRY_DATE" :max="todayISO" />
              </div>
              <div v-if="isRange">
                <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Data final</label>
                <UInput type="date" v-model="dateTo" :min="COSTA_ENTRY_DATE" :max="todayISO" />
              </div>
            </div>
          </template>
        </UPopover>
        <button
          type="button"
          class="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-violet-600 hover:border-violet-300 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
          @click="resetFilter"
        >
          Limpar filtro
        </button>
      </div>
    </div>

    <!-- Cartões de estatística -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      <InicioStatCard v-for="s in statCards" :key="s.id" v-bind="s" />
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
          to="/colaborador/quadros"
          variant="link"
          trailing-icon="i-heroicons-arrow-right"
          label="Ver visualização de tarefas"
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
                to="/colaborador/ranking"
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
