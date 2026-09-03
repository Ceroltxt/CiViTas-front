<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { fetchUserProjectsFromSupabase, useGestorProjectsRef } from '~/composables/useUserProjects'

definePageMeta({ sidebarWidget: 'project' })

const currentUser = useCurrentUser()

// Projetos alocados ao gestor logado (mesma ref reativa usada em /gestor/projetos)
const gestorProjectsRef = useGestorProjectsRef()

onMounted(async () => {
  await fetchUserProjectsFromSupabase(true)
})

const leadershipProjects = computed<any[]>(() => gestorProjectsRef.value)

// Controle de abrir/fechar as equipes de cada projeto
const collapsed = ref<Record<string, boolean>>({})

function toggleProject(id: string) {
  collapsed.value[id] = !collapsed.value[id]
}

function projectTone(color: string) {
  const tones: Record<string, string> = {
    'bg-blue-500': 'bg-blue-500',
    'bg-violet-500': 'bg-violet-500',
    'bg-amber-400': 'bg-amber-400',
    'bg-pink-500': 'bg-pink-500',
    'bg-cyan-500': 'bg-cyan-500',
    'bg-indigo-500': 'bg-indigo-500',
    'bg-violet-600': 'bg-violet-600',
    'bg-emerald-500': 'bg-emerald-500',
    'bg-orange-500': 'bg-orange-500',
  }
  return tones[color] ?? 'bg-slate-500'
}

function projectSurface(color: string) {
  const surfaces: Record<string, string> = {
    'bg-blue-500': 'from-blue-50 via-white to-sky-50/70 dark:from-blue-950/30 dark:via-slate-900 dark:to-sky-950/20',
    'bg-pink-500': 'from-pink-50 via-white to-fuchsia-50/70 dark:from-pink-950/30 dark:via-slate-900 dark:to-fuchsia-950/20',
    'bg-cyan-500': 'from-cyan-50 via-white to-teal-50/70 dark:from-cyan-950/30 dark:via-slate-900 dark:to-teal-950/20',
  }
  return surfaces[color] ?? 'from-slate-50 via-white to-violet-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/20'
}

function getTeamStatus(teamId: string) {
  // Gerando um status mockado e estável baseado no final do ID da equipe
  // para exibir as opções pedidas ("ativa", "concluida", "atrasados")
  const val = teamId.charCodeAt(teamId.length - 1)
  if (val % 3 === 0) return { label: 'Concluída', class: 'text-emerald-700 bg-emerald-50 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30' }
  if (val % 3 === 1) return { label: 'Atrasada', class: 'text-rose-700 bg-rose-50 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30' }
  return { label: 'Ativa', class: 'text-violet-700 bg-violet-50 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30' }
}

const newTeamOpen = ref(false)
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
          Minhas Equipes
        </h1>
        <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Acompanhe as equipes e alocações de gestores e membros.
        </p>
      </div>

      <UButton
        color="primary"
        icon="i-heroicons-plus-circle"
        label="Nova Equipe"
        class="bg-violet-600 hover:bg-violet-700 text-white"
        @click="newTeamOpen = true"
      />
    </div>

    <!-- Lista de Projetos -->
    <div class="space-y-6">
      <section 
        v-for="project in leadershipProjects" 
        :key="project.id" 
        class="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800"
        :class="projectSurface(project.color)"
      >
        <div class="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-10 blur-2xl" :class="projectTone(project.color)" />
        <!-- Cabeçalho do projeto (Clicável para esconder/mostrar equipes) -->
        <div 
          class="relative flex cursor-pointer select-none items-center justify-between pb-2"
          :class="!collapsed[project.id] ? 'mb-4 border-b border-slate-100 dark:border-slate-800 pb-4' : ''"
          @click="toggleProject(project.id)"
        >
          <div class="flex items-center gap-3">
            <button 
              type="button" 
              class="grid size-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <UIcon :name="collapsed[project.id] ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-down'" class="size-5" />
            </button>
            <span class="size-3 rounded-full" :class="projectTone(project.color)" />
            <h2 class="font-bold text-lg text-slate-800 dark:text-slate-100">{{ project.name }}</h2>
            
            <!-- Informações extras do projeto -->
            <div class="ml-2 hidden items-center gap-2 sm:flex">
              <span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <UIcon name="i-heroicons-chart-pie" class="mr-1.5 size-3.5 opacity-70" />
                {{ project.progress }}% concluído
              </span>
              <span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <UIcon name="i-heroicons-user-group" class="mr-1.5 size-3.5 opacity-70" />
                {{ project.teams?.length || 0 }} equipes
              </span>
            </div>
          </div>
        </div>

        <!-- Equipes horizontais (Escondidas se collapsed for true) -->
        <div v-show="!collapsed[project.id]" class="relative grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="team in project.teams"
            :key="team.id"
            :to="`/gestor/projetos/${project.id}/equipe/${team.id}`"
            class="group flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-3 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-slate-600"
          >
            <!-- Letras maiúsculas da equipe -->
            <span class="grid size-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-white shadow-sm" :class="projectTone(team.color)">
              {{ team.initial }}
            </span>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="truncate text-sm font-bold text-slate-700 dark:text-slate-200" :title="team.name">
                  {{ team.name }}
                </h3>
                <!-- Status da equipe -->
                <span 
                  class="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1"
                  :class="getTeamStatus(team.id).class"
                >
                  {{ getTeamStatus(team.id).label }}
                </span>
              </div>
              
              <div class="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span class="truncate">
                  Líder: <strong class="font-medium text-slate-700 dark:text-slate-300">{{ team.leader || 'Nenhum' }}</strong>
                </span>
                <span class="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span class="flex shrink-0 items-center gap-1 font-medium">
                  <UIcon name="i-heroicons-users" class="size-3.5 opacity-70" />
                  {{ team.memberCount }}
                </span>
              </div>
            </div>

            <!-- Seta indicativa -->
            <UIcon name="i-heroicons-arrow-right" class="size-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </NuxtLink>

          <!-- Se não houver equipes no projeto -->
          <div v-if="!project.teams?.length" class="col-span-full rounded-xl border border-dashed border-slate-300 py-4 text-center text-sm text-slate-500 dark:border-slate-700">
            Nenhuma equipe vinculada a este projeto.
          </div>
        </div>
      </section>

      <!-- Se não houver nenhum projeto associado -->
      <div v-if="!leadershipProjects.length" class="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
        <UIcon name="i-heroicons-folder-open" class="mx-auto size-8 text-slate-300" />
        <p class="mt-3 text-sm font-medium text-slate-500">Você ainda não lidera nenhuma equipe.</p>
      </div>
    </div>

    <EquipesNewTeamModal v-model:open="newTeamOpen" />
  </div>
</template>
