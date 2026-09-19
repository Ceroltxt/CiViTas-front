<script setup lang="ts">
const props = defineProps<{
  projectsFirst?: boolean
  isSecondary?: boolean
}>()
const emit = defineEmits<{ togglePosition: [] }>()

// Mantém a ref, em vez de uma cópia do array. Após o login a busca substitui
// o array de projetos; uma cópia só seria atualizada quando a sidebar remontasse.
const projects = useGestorProjectsRef()
const expandedCookie = useCookie<string[]>('civitas_expanded_projects', { default: () => [] })
const route = useRoute()
const basePath = computed(() => {
  if (route.path.startsWith('/gestor')) return '/gestor'
  if (route.path.startsWith('/admin')) return '/admin'
  return '/colaborador'
})

// Create a reactive Set from the cookie for easy manipulation in memory
const expandedProjectIds = ref<Set<string>>(new Set(expandedCookie.value))

// Sync changes back to cookie
watch(expandedProjectIds, (newSet) => {
  expandedCookie.value = Array.from(newSet)
}, { deep: true })

function toggleProject(projectId: string) {
  if (expandedProjectIds.value.has(projectId)) {
    expandedProjectIds.value.delete(projectId)
  } else {
    expandedProjectIds.value.add(projectId)
  }
}
</script>

<template>
  <section v-if="projects.length" class="flex h-full min-h-0 flex-col">
    <div class="mb-2 flex items-center justify-between px-2">
      <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Projetos</p>
      <div class="flex items-center gap-2 text-slate-300 dark:text-slate-600">
        <UIcon name="i-heroicons-plus" class="size-3.5 hover:text-orange-500 cursor-pointer transition-colors" />
      </div>
    </div>

    <div class="scroll-thin min-h-0 flex-1 snap-y snap-mandatory space-y-0.5 overflow-y-auto pr-1">
      <div v-for="project in projects" :key="project.id" class="group snap-start">
        <NuxtLink
          :to="`${basePath}/projetos/${project.id}`"
          class="flex h-9 items-center gap-3 rounded-lg px-2.5 transition-colors hover:bg-orange-50/70 dark:hover:bg-slate-800 cursor-pointer"
        >
          <span class="size-2.5 shrink-0 rounded-full" :class="project.color" />
          <span class="min-w-0 flex-1 truncate text-sm font-medium text-slate-600 dark:text-slate-300">
            {{ project.name }}
          </span>
          <button
            type="button"
            class="grid size-6 shrink-0 place-items-center rounded-md text-slate-400 opacity-0 transition-all hover:bg-white hover:text-violet-600 group-hover:opacity-100 focus:opacity-100 dark:hover:bg-slate-700"
            :aria-label="`Ver equipes de ${project.name}`"
            :aria-expanded="expandedProjectIds.has(project.id)"
            @click.prevent="toggleProject(project.id)"
          >
            <UIcon
              name="i-heroicons-chevron-down"
              class="size-3.5 transition-transform"
              :class="expandedProjectIds.has(project.id) ? 'rotate-180' : ''"
            />
          </button>
        </NuxtLink>

        <div
          v-if="expandedProjectIds.has(project.id)"
          class="mb-1 ml-5 mr-2 space-y-0.5"
        >
          <template v-if="project.teams?.length">
            <NuxtLink
              v-for="team in project.teams"
              :key="team.id"
              :to="`${basePath}/projetos/${project.id}/equipe/${team.id}`"
              class="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-slate-500 transition-colors hover:bg-orange-50/70 hover:text-slate-700 dark:hover:bg-slate-800"
            >
              <span class="grid size-5 shrink-0 place-items-center rounded text-[8px] font-bold text-white" :class="team.color">{{ team.initial }}</span>
              <span class="truncate">{{ team.name }}</span>
            </NuxtLink>
          </template>
          <div v-else class="rounded-md border border-dashed border-slate-200 px-2.5 py-2 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
            Sem equipes
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
