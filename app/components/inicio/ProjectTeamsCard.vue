<script setup lang="ts">
import { computed } from 'vue'
import type { TeamDetail, TeamProject } from '~/types'

const props = defineProps<{ teamDetails: TeamDetail[] }>()

interface ProjectGroup {
  project: TeamProject | null
  teams: TeamDetail[]
}

const groupedProjects = computed(() => {
  const map: Record<string, ProjectGroup> = {}
  
  props.teamDetails.forEach(team => {
    const pName = team.project?.name || 'Sem Projeto'
    if (!map[pName]) {
      map[pName] = { project: team.project || null, teams: [] }
    }
    map[pName].teams.push(team)
  })
  
  return Object.values(map)
})
</script>

<template>
  <ul class="space-y-6">
    <li v-for="(group, idx) in groupedProjects" :key="idx" class="flex flex-col gap-3">
      <!-- Cabeçalho do Projeto -->
      <div class="flex items-center gap-2.5">
        <div class="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500">
          <UIcon name="i-heroicons-folder-open" class="size-4" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{{ group.project?.name || 'Projetos Gerais' }}</p>
          <p v-if="group.project?.description" class="text-[11px] text-slate-400 truncate">{{ group.project.description }}</p>
        </div>
      </div>
      
      <!-- Equipes (Aparecendo Lateralmente) -->
      <div class="flex flex-wrap items-center gap-2 pl-[42px]">
        <div 
          v-for="team in group.teams" 
          :key="team.id" 
          class="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-colors rounded-full pr-3 pl-1 py-1 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer shadow-sm"
        >
          <span
            class="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
            :class="team.color"
          >
            {{ team.initial }}
          </span>
          <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{{ team.name }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>
