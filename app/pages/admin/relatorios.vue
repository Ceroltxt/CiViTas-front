<script setup lang="ts">
definePageMeta({ sidebarWidget: 'none' })

const logs = useAuditLogs(10)

const perPage = ref(10)
const page = ref(1)
const total = 100
const view = ref<'list' | 'grid'>('list')

const filters = [
  { key: 'projetos', label: 'Projetos' },
  { key: 'equipes', label: 'Equipes' },
  { key: 'gestores', label: 'Gestores' },
  { key: 'tarefas', label: 'Tarefas' },
  { key: 'periodo', label: 'Período' },
]
</script>

<template>
  <div class="space-y-5 p-4 sm:p-6 dark:bg-slate-900 h-full">
    <!-- Cabeçalho -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="flex items-center gap-2 font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        Logs Gerais
        <UIcon name="i-heroicons-user-group" class="size-6 text-violet-500" />
      </h1>

      <div class="flex items-center gap-3">
        <span class="text-sm text-slate-500">Itens Por Página</span>
        <USelect v-model="perPage" :items="[10, 25, 50]" class="w-20" />
        <div class="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            class="px-2.5 py-2"
            :class="view === 'list' ? 'bg-orange-500 text-white' : 'text-slate-400'"
            aria-label="Visualização em lista"
            @click="view = 'list'"
          >
            <UIcon name="i-heroicons-bars-3" class="size-4" />
          </button>
          <button
            type="button"
            class="px-2.5 py-2"
            :class="view === 'grid' ? 'bg-orange-500 text-white' : 'text-slate-400'"
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
      <div class="grid grid-cols-2 gap-4 p-5 md:grid-cols-3 lg:grid-cols-5">
        <div v-for="filter in filters" :key="filter.key">
          <label class="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
            {{ filter.label }}
          </label>
          <USelect
            :items="['Digite Para Buscar...']"
            model-value="Digite Para Buscar..."
            trailing-icon="i-heroicons-chevron-down"
            class="w-full"
          />
        </div>
      </div>

      <!-- Tabela -->
      <RelatoriosLogTable :logs="logs" />

      <!-- Paginação -->
      <div class="flex justify-end px-5 py-4">
        <UPagination v-model:page="page" :total="total" :items-per-page="perPage" />
      </div>
    </UiSectionCard>
  </div>
</template>
