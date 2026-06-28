<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({ sidebarWidget: 'none' })

const perPage = ref(10)
const view = ref<'list' | 'grid'>('list')

const selectedProjeto = ref('Todos')
const selectedEquipe = ref('Todas')
const selectedGestor = ref('Todos')
const selectedTarefa = ref('Todas')
const selectedPeriodo = ref('Todos')

const projetoItems = ['Todos', 'Plataforma E-commerce', 'Civitas Mobile', 'Sistema de Logística', 'Plataforma MEI', 'Portal do Cliente']
const equipeItems = ['Todas', 'FrontEnd', 'BackEnd', 'DataBase', 'Criptografia']
const gestorItems = ['Todos', 'Beatriz Milani', 'Pedro Nascimento']
const tarefaItems = ['Todas', 'Dashboard Admin', 'Ajuste na API', 'Definição de Métricas', 'diagrama.png', 'Levantamento']
const periodoItems = ['Todos', 'Últimos 7 dias', 'Últimos 30 dias']

// Logs showing both collaborator (Costa Neves) and gestor actions
const baseLogs = [
  {
    date: '06/06/2026',
    user: 'Pedro Nascimento',
    action: 'Nova Tarefa',
    actionColor: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    details: 'Criou a tarefa "Ajuste na API"',
    project: 'Civitas Mobile',
    team: 'BackEnd',
    manager: 'Pedro Nascimento',
    status: 'Pendentes',
    statusColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    date: '05/06/2026',
    user: 'Costa Neves',
    action: 'Status Atualizado',
    actionColor: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    details: 'Enviou a tarefa "Layout Tela Inicial" para Revisão',
    project: 'Plataforma E-commerce',
    team: 'FrontEnd',
    manager: 'Beatriz Milani',
    status: 'Concluídas',
    statusColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    date: '04/06/2026',
    user: 'Pedro Nascimento',
    action: 'Prazo Alterado',
    actionColor: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    details: 'Alterou o vencimento da tarefa "Levantamento" para 20/06',
    project: 'Portal do Cliente',
    team: 'Criptografia',
    manager: 'Pedro Nascimento',
    status: 'Atrasadas',
    statusColor: 'text-rose-600 dark:text-rose-400'
  },
  {
    date: '02/06/2026',
    user: 'Costa Neves',
    action: 'Comentário Adicionado',
    actionColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    details: 'Comentou na tarefa "Ajuste na API"',
    project: 'Civitas Mobile',
    team: 'BackEnd',
    manager: 'Pedro Nascimento',
    status: 'Pendentes',
    statusColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    date: '30/05/2026',
    user: 'Beatriz Milani',
    action: 'Nova Tarefa',
    actionColor: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    details: 'Criou a tarefa "Definição de Métricas"',
    project: 'Sistema de Logística',
    team: 'DataBase',
    manager: 'Pedro Nascimento',
    status: 'Pendentes',
    statusColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    date: '27/05/2026',
    user: 'Costa Neves',
    action: 'Arquivo Anexado',
    actionColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    details: 'Adicionou o arquivo "diagrama.png" ao projeto',
    project: 'Plataforma MEI',
    team: 'FrontEnd',
    manager: 'Beatriz Milani',
    status: 'Pendentes',
    statusColor: 'text-amber-600 dark:text-amber-400'
  }
]

// Duplicate mock logs list to showcase pagination up to 50 items
const logs = [
  ...baseLogs,
  ...baseLogs.map((l) => ({ ...l, date: '21/05/2026', details: l.details + ' (histórico)' })),
  ...baseLogs.map((l) => ({ ...l, date: '15/05/2026', details: l.details + ' (anterior)' })),
  ...baseLogs.map((l) => ({ ...l, date: '10/05/2026', details: l.details + ' (antigo)' })),
  ...baseLogs.map((l) => ({ ...l, date: '01/05/2026', details: l.details + ' (arquivado)' }))
]

const filteredLogs = computed(() => {
  return logs.filter((l) => {
    if (selectedProjeto.value !== 'Todos' && l.project !== selectedProjeto.value) return false
    if (selectedEquipe.value !== 'Todas' && l.team !== selectedEquipe.value) return false
    if (selectedGestor.value !== 'Todos' && l.manager !== selectedGestor.value) return false
    if (selectedTarefa.value !== 'Todas' && !l.details.toLowerCase().includes(selectedTarefa.value.toLowerCase())) return false
    return true
  })
})

const paginatedLogs = computed(() => {
  return filteredLogs.value.slice(0, Number(perPage.value))
})

function exportLogs() {
  alert('Logs exportados com sucesso!')
}
</script>

<template>
  <div class="space-y-5 p-4 sm:p-6">
    <!-- Cabeçalho -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="flex items-center gap-2 font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        Relatórios do Gestor
        <UIcon name="i-heroicons-document-chart-bar" class="size-6 text-violet-500" />
      </h1>

      <div class="flex items-center gap-3">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-down-tray"
          label="Exportar Logs"
          class="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-semibold"
          @click="exportLogs"
        />

        <div class="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        <span class="text-sm text-slate-500 font-medium">Itens:</span>
        <USelect v-model="perPage" :items="[5, 10, 25, 50]" class="w-18 bg-white" />

        <div class="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            class="px-2.5 py-1.5"
            :class="view === 'list' ? 'bg-orange-500 text-white' : 'text-slate-400 bg-white dark:bg-slate-900'"
            aria-label="Visualização em lista"
            @click="view = 'list'"
          >
            <UIcon name="i-heroicons-bars-3" class="size-4" />
          </button>
          <button
            type="button"
            class="px-2.5 py-1.5"
            :class="view === 'grid' ? 'bg-orange-500 text-white' : 'text-slate-400 bg-white dark:bg-slate-900'"
            aria-label="Visualização em grade"
            @click="view = 'grid'"
          >
            <UIcon name="i-heroicons-squares-2x2" class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <UiSectionCard class="!p-0">
      <!-- Filtros -->
      <div class="grid grid-cols-2 gap-4 p-5 md:grid-cols-3 lg:grid-cols-5 border-b border-slate-100 dark:border-slate-800">
        <!-- Projetos -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400">Projetos</label>
          <USelect
            v-model="selectedProjeto"
            :items="projetoItems"
            trailing-icon="i-heroicons-chevron-down"
            class="w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
          />
        </div>

        <!-- Equipes -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400">Equipes</label>
          <USelect
            v-model="selectedEquipe"
            :items="equipeItems"
            trailing-icon="i-heroicons-chevron-down"
            class="w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
          />
        </div>

        <!-- Gestores -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400">Gestores</label>
          <USelect
            v-model="selectedGestor"
            :items="gestorItems"
            trailing-icon="i-heroicons-chevron-down"
            class="w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
          />
        </div>

        <!-- Tarefas -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400">Tarefas</label>
          <USelect
            v-model="selectedTarefa"
            :items="tarefaItems"
            trailing-icon="i-heroicons-chevron-down"
            class="w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
          />
        </div>

        <!-- Período -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-500 dark:text-slate-400">Período</label>
          <USelect
            v-model="selectedPeriodo"
            :items="periodoItems"
            trailing-icon="i-heroicons-chevron-down"
            class="w-full text-slate-600 bg-white border border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>

      <!-- Tabela / Lista -->
      <div v-if="view === 'list'" class="overflow-x-auto">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="text-left text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th class="px-6 py-4">Data</th>
              <th class="px-6 py-4">Usuário</th>
              <th class="px-6 py-4">Ação</th>
              <th class="px-6 py-4">Detalhes</th>
              <th class="px-6 py-4">Contexto</th>
              <th class="px-6 py-4">Gestão</th>
              <th class="px-6 py-4"><span class="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(log, index) in paginatedLogs"
              :key="index"
              class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
            >
              <!-- Data -->
              <td class="px-6 py-5 text-slate-600 dark:text-slate-300 font-medium">
                {{ log.date }}
              </td>
              <!-- Usuário -->
              <td class="px-6 py-5 text-slate-600 dark:text-slate-300">
                {{ log.user }}
              </td>
              <!-- Ação -->
              <td class="px-6 py-5">
                <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" :class="log.actionColor">
                  {{ log.action }}
                </span>
              </td>
              <!-- Detalhes -->
              <td class="px-6 py-5 text-slate-600 dark:text-slate-300 max-w-xs font-medium">
                {{ log.details }}
              </td>
              <!-- Contexto -->
              <td class="px-6 py-5 text-slate-500 dark:text-slate-400 space-y-1 text-xs font-semibold">
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-heroicons-briefcase" class="size-4 shrink-0 text-slate-400" />
                  <span>{{ log.project }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-heroicons-user-group" class="size-4 shrink-0 text-slate-400" />
                  <span>{{ log.team }}</span>
                </div>
              </td>
              <!-- Gestão -->
              <td class="px-6 py-5 text-slate-500 dark:text-slate-400 space-y-1 text-xs font-semibold">
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-heroicons-user" class="size-4 shrink-0 text-slate-400" />
                  <span>{{ log.manager }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-heroicons-tag" class="size-4 shrink-0" :class="log.statusColor" />
                  <span>{{ log.status }}</span>
                </div>
              </td>
              <!-- Ações -->
              <td class="px-6 py-5 text-right">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                  @click="exportLogs"
                >
                  <UIcon name="i-heroicons-arrow-down-tray" class="size-4" />
                  Exportar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Grade / Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
        <div
          v-for="(log, index) in paginatedLogs"
          :key="index"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <span class="text-xs font-bold text-slate-400">{{ log.date }}</span>
            <span class="text-xs font-bold text-slate-500">{{ log.user }}</span>
          </div>
          <div class="mb-3">
            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="log.actionColor">
              {{ log.action }}
            </span>
          </div>
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">{{ log.details }}</p>
          <div class="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Projeto:</span>
              <span>{{ log.project }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Equipe:</span>
              <span>{{ log.team }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Gestor:</span>
              <span>{{ log.manager }}</span>
            </div>
            <div class="flex items-center justify-between pb-2">
              <span class="text-slate-400">Status:</span>
              <span :class="log.statusColor">{{ log.status }}</span>
            </div>
            <UButton
              color="neutral"
              variant="outline"
              size="xs"
              block
              icon="i-heroicons-arrow-down-tray"
              label="Exportar"
              @click="exportLogs"
            />
          </div>
        </div>
      </div>
    </UiSectionCard>
  </div>
</template>
