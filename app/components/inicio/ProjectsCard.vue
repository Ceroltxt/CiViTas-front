<script setup lang="ts">
import type { ProjectProgress } from '~/types'

defineProps<{ projects: ProjectProgress[] }>()
defineEmits<{ select: [projectId: string] }>()
</script>

<template>
  <ul class="space-y-4">
    <li
      v-for="project in projects"
      :key="project.id"
      class="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 -mx-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
      @click="$emit('select', project.id)"
    >
      <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
        <UIcon name="i-heroicons-folder" class="size-5 text-slate-400" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="mb-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
          {{ project.name }}
        </p>
        <UiProgressBar :value="project.progress" :color="project.color" />
      </div>
      <span class="text-sm font-semibold text-slate-500">{{ project.progress }}%</span>
    </li>
  </ul>
</template>
