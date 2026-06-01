<script setup lang="ts">
import type { Task } from '~/types'

defineProps<{ task: Task; done?: boolean }>()
</script>

<template>
  <article
    class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
  >
    <div class="flex items-start justify-between gap-2">
      <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ task.title }}</h3>
      <UIcon
        v-if="done"
        name="i-heroicons-check-circle-solid"
        class="size-5 shrink-0 text-emerald-500"
      />
    </div>

    <div class="mt-2">
      <UiPriorityBadge :priority="task.priority" />
    </div>

    <p v-if="task.note" class="mt-2 text-xs text-slate-400">{{ task.note }}</p>

    <div v-if="task.progress != null" class="mt-3">
      <UiProgressBar :value="task.progress" gradient />
      <p class="mt-1 text-right text-xs font-medium text-slate-500">{{ task.progress }}%</p>
    </div>

    <div class="mt-3 flex items-center justify-between">
      <UAvatar :src="task.assignees[0]?.avatar" :alt="task.assignees[0]?.name" size="2xs" />
      <span class="flex items-center gap-1 text-xs text-slate-400">
        <UIcon name="i-heroicons-calendar-days" class="size-3.5" />
        {{ task.dueDate }}
      </span>
    </div>
  </article>
</template>
