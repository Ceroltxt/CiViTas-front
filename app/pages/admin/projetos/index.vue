<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchAllProjectsFromSupabase } from '~/composables/useUserProjects'

definePageMeta({ sidebarWidget: 'none' })

// ─── Estado ──────────────────────────────────────────────────────────────────
const projects = ref<any[]>([])
const isLoading = ref(true)
const globalFilter = ref('')
const newProjectOpen = ref(false)

// ─── Busca dos projetos ───────────────────────────────────────────────────────
async function loadProjects() {
  isLoading.value = true
  const data = await fetchAllProjectsFromSupabase()
  projects.value = data
  isLoading.value = false
}

onMounted(loadProjects)

// ─── Métricas derivadas do banco ─────────────────────────────────────────────
const total = computed(() => projects.value.length)
const ativos = computed(() => projects.value.filter(p => p.ativo !== false).length)
const concluidos = computed(() => projects.value.filter(p => p.status === 'concluido').length)

// Gestores únicos entre todas as equipes
const gestoresAtivos = computed(() => {
  const set = new Set<string>()
  projects.value.forEach(p => {
    p.teams?.forEach((t: any) => {
      if (t.leader) set.add(t.leader)
    })
  })
  return set.size
})

// ─── Tabela formatada ─────────────────────────────────────────────────────────
const priorityClass: Record<string, string> = {
  alta: 'text-red-600 bg-red-50 dark:bg-red-500/10 ring-red-200 dark:ring-red-500/30',
  media: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 ring-amber-200 dark:ring-amber-500/30',
  baixa: 'text-green-600 bg-green-50 dark:bg-green-500/10 ring-green-200 dark:ring-green-500/30',
}

const priorityLabel: Record<string, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
}

const tableRows = computed(() => {
  const term = globalFilter.value.trim().toLowerCase()
  return projects.value
    .filter(p => !term || p.name?.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term))
    .map(p => {
      const leaders = Array.from(new Set(p.teams?.map((t: any) => t.leader).filter(Boolean)))
      return {
        id: p.id,
        name: p.name,
        gestores: leaders.length ? leaders.join(', ') : 'Sem gestor',
        equipes: p.teams?.length || 0,
        prioridade: p.prioridade || 'media',
        progress: p.progress || 0,
      }
    })
})

// Paginação local simples
const page = ref(0)
const pageSize = 10
const totalPages = computed(() => Math.ceil(tableRows.value.length / pageSize) || 1)
const pageRows = computed(() => {
  const start = page.value * pageSize
  return tableRows.value.slice(start, start + pageSize)
})

function onProjectCreated() {
  loadProjects()
}
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
    <!-- Topo -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Projetos</h1>
        <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Gerencie todos os projetos e suas equipes alocadas.</p>
      </div>
      <UButton
        label="Criar novo projeto"
        trailing-icon="i-heroicons-plus"
        size="md"
        class="bg-violet-600 hover:bg-violet-700 text-white cursor-pointer"
        @click="newProjectOpen = true"
      />
    </div>

    <!-- Métricas (dados reais) -->
    <ul class="mt-4 flex flex-wrap gap-4">
      <!-- Total -->
      <li>
        <div class="flex items-center gap-4 border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 border-t-violet-600 border-t-4 dark:border-t-violet-600 hover:translate-y-1 transition-transform duration-300 hover:shadow-lg w-52 h-28">
          <UIcon name="i-heroicons-inbox-stack" class="size-12 rounded-full bg-[#bd52c9] p-2 text-fuchsia-100 shadow-lg shadow-fuchsia-800/40 shrink-0" />
          <div class="flex flex-col">
            <p class="font-medium text-slate-700 dark:text-slate-300 text-sm">Total de projetos</p>
            <p v-if="isLoading" class="h-7 w-10 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mt-1" />
            <h2 v-else class="text-2xl font-bold text-violet-600">{{ total }}</h2>
          </div>
        </div>
      </li>

      <!-- Em andamento -->
      <li>
        <div class="flex items-center gap-4 border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 border-t-orange-400 border-t-4 dark:border-t-orange-400 hover:translate-y-1 transition-transform duration-300 hover:shadow-lg w-52 h-28">
          <UIcon name="i-heroicons-play-circle" class="size-12 text-yellow-200 bg-orange-400 rounded-full p-2 shadow-lg shadow-orange-800/50 shrink-0" />
          <div class="flex flex-col">
            <p class="font-medium text-slate-700 dark:text-slate-300 text-sm">Em andamento</p>
            <p v-if="isLoading" class="h-7 w-10 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mt-1" />
            <h2 v-else class="text-2xl font-bold text-orange-500">{{ ativos }}</h2>
          </div>
        </div>
      </li>

      <!-- Concluídos -->
      <li>
        <div class="flex items-center gap-4 border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 border-t-green-600 border-t-4 dark:border-t-green-600 hover:translate-y-1 transition-transform duration-300 hover:shadow-lg w-52 h-28">
          <UIcon name="i-heroicons-check-badge" class="size-12 text-emerald-200 bg-green-600 rounded-full p-2 shadow-lg shadow-emerald-800/50 shrink-0" />
          <div class="flex flex-col">
            <p class="font-medium text-slate-700 dark:text-slate-300 text-sm">Concluídos</p>
            <p v-if="isLoading" class="h-7 w-10 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mt-1" />
            <h2 v-else class="text-2xl font-bold text-green-600">{{ concluidos }}</h2>
          </div>
        </div>
      </li>

      <!-- Gestores ativos -->
      <li>
        <div class="flex items-center gap-4 border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 border-t-blue-600 border-t-4 dark:border-t-blue-600 hover:translate-y-1 transition-transform duration-300 hover:shadow-lg w-52 h-28">
          <UIcon name="i-heroicons-user-group" class="size-12 text-sky-300 bg-blue-600 rounded-full p-2 shadow-lg shadow-sky-800/50 shrink-0" />
          <div class="flex flex-col">
            <p class="font-medium text-slate-700 dark:text-slate-300 text-sm">Gestores ativos</p>
            <p v-if="isLoading" class="h-7 w-10 animate-pulse rounded bg-slate-200 dark:bg-slate-700 mt-1" />
            <h2 v-else class="text-2xl font-bold text-blue-600">{{ gestoresAtivos }}</h2>
          </div>
        </div>
      </li>
    </ul>

    <!-- Tabela de projetos -->
    <div class="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <!-- Filtro -->
      <div class="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
        <UInput
          v-model="globalFilter"
          icon="i-heroicons-magnifying-glass"
          class="max-w-xs w-full"
          placeholder="Filtrar projetos..."
          @input="page = 0"
        />
        <span class="text-xs text-slate-400">{{ tableRows.length }} projeto(s)</span>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="p-6 space-y-3">
        <div v-for="n in 4" :key="n" class="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>

      <!-- Tabela real -->
      <template v-else>
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Projeto</th>
              <th class="px-5 py-3 text-left">Gestor(es)</th>
              <th class="px-5 py-3 text-center">Equipes</th>
              <th class="px-5 py-3 text-center">Prioridade</th>
              <th class="px-5 py-3 text-center">Progresso</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr
              v-for="row in pageRows"
              :key="row.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-100">
                {{ row.name }}
              </td>
              <td class="px-5 py-3.5 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                {{ row.gestores }}
              </td>
              <td class="px-5 py-3.5 text-center text-slate-600 dark:text-slate-300">
                {{ row.equipes }}
              </td>
              <td class="px-5 py-3.5 text-center">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1"
                  :class="priorityClass[row.prioridade] || priorityClass.media"
                >
                  {{ priorityLabel[row.prioridade] || 'Média' }}
                </span>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      class="h-full rounded-full bg-violet-500 transition-all duration-500"
                      :style="{ width: `${row.progress}%` }"
                    />
                  </div>
                  <span class="text-xs text-slate-500 w-8 text-right">{{ row.progress }}%</span>
                </div>
              </td>
            </tr>
            <tr v-if="pageRows.length === 0">
              <td colspan="5" class="py-12 text-center text-slate-400 text-sm">
                <UIcon name="i-heroicons-folder-open" class="mx-auto size-8 mb-2" />
                <p>Nenhum projeto cadastrado ainda.</p>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginação -->
        <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3">
          <span class="text-xs text-slate-400">Página {{ page + 1 }} de {{ totalPages }}</span>
          <div class="flex gap-2">
            <UButton
              size="xs"
              variant="outline"
              icon="i-heroicons-chevron-left"
              :disabled="page === 0"
              @click="page--"
            />
            <UButton
              size="xs"
              variant="outline"
              icon="i-heroicons-chevron-right"
              :disabled="page >= totalPages - 1"
              @click="page++"
            />
          </div>
        </div>
      </template>
    </div>

    <!-- Modal de criação -->
    <ProjetosNewProjectModal v-model:open="newProjectOpen" @created="onProjectCreated" />
  </div>
</template>
