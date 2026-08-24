<script setup lang="ts">
const projects = useUserProjects()
const expandedProjectId = ref<string | null>(null)

function toggleProject(projectId: string) {
  expandedProjectId.value = expandedProjectId.value === projectId ? null : projectId
}
</script>

<template>
  <section v-if="projects.length" class="flex h-full min-h-0 flex-col">
    <div class="mb-2 flex items-center justify-between px-2">
      <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Projetos</p>
      <div class="flex items-center gap-2 text-slate-300 dark:text-slate-600">
        <UIcon name="i-heroicons-plus" class="size-3.5" />
        <UIcon name="i-heroicons-chevron-down" class="size-3.5" />
      </div>
    </div>

    <div class="scroll-thin min-h-0 flex-1 snap-y snap-mandatory space-y-0.5 overflow-y-auto pr-1">
      <div v-for="project in projects" :key="project.id" class="group snap-start">
        <NuxtLink
          :to="`/colaborador/projetos/${project.id}`"
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
            :aria-expanded="expandedProjectId === project.id"
            @click="toggleProject(project.id)"
          >
            <UIcon
              name="i-heroicons-chevron-down"
              class="size-3.5 transition-transform"
              :class="expandedProjectId === project.id ? 'rotate-180' : ''"
            />
          </button>
        </NuxtLink>

        <div
          v-if="expandedProjectId === project.id"
          class="mb-1 ml-8 mr-2 rounded-md border border-dashed border-slate-200 px-2.5 py-2 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500"
        >
          Sem equipes
        </div>
      </div>
    </div>
  </section>
</template>
