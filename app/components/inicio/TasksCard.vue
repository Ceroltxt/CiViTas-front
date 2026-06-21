<script setup lang="ts">
import type { Task } from '~/types'

defineProps<{ tasks: Task[] }>()

function projectProgress(task: Task) {
  return useProjectProgressForTask(task.project, task.projectProgress)
}
</script>

<template>
  <ul class="space-y-3">
    <li v-for="task in tasks" :key="task.id" class="flex items-center gap-3">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
        <UIcon name="i-heroicons-clipboard-document-list" class="size-5 text-slate-400" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
          {{ task.title }}
        </p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <div class="w-20">
          <UiProgressBar :value="projectProgress(task)" />
        </div>
        <span class="w-9 text-right text-sm font-semibold text-slate-500">{{ projectProgress(task) }}%</span>
      </div>
    </li>
  </ul>
</template>
