<script setup lang="ts">
import type { StatusKey, Task } from '~/types'

const props = defineProps<{ status: StatusKey; tasks: Task[] }>()

const meta = computed(() => useStatusMeta(props.status))

/** Fundo da área atrás dos cartões (não dos cards em si). */
const COLUMN_TRACK: Record<StatusKey, string> = {
  planejado: 'bg-blue-100/70 dark:bg-blue-950/25',
  'em-andamento': 'bg-amber-100/70 dark:bg-amber-950/25',
  'em-revisao': 'bg-violet-100/70 dark:bg-violet-950/25',
  bloqueado: 'bg-red-100/60 dark:bg-red-950/25',
  atrasado: 'bg-rose-100/60 dark:bg-rose-950/25',
  concluido: 'bg-emerald-100/70 dark:bg-emerald-950/25',
}

const trackClass = computed(() => COLUMN_TRACK[props.status])
</script>

<template>
  <div class="flex w-72 shrink-0 flex-col">
    <!-- Cabeçalho com linha colorida no topo -->
    <div
      class="mb-3 flex items-center justify-between rounded-lg border-t-2 bg-white px-3 py-2.5 shadow-sm dark:bg-slate-900"
      :class="meta.border"
    >
      <span class="flex min-w-0 items-center gap-2">
        <span class="size-2 shrink-0 rounded-full" :class="meta.dot" />
        <span class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {{ meta.label }}
        </span>
      </span>
      <span class="shrink-0 text-sm text-slate-400">{{ tasks.length }}</span>
    </div>

    <!-- Fundo marcado atrás dos cartões -->
    <div
      class="min-h-[12rem] flex-1 space-y-3 rounded-xl p-3"
      :class="trackClass"
    >
      <QuadrosTaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :done="status === 'concluido'"
      />

      <p
        v-if="tasks.length === 0"
        class="rounded-lg border border-dashed border-white/60 py-8 text-center text-xs text-slate-500 dark:border-slate-700"
      >
        Nenhuma tarefa nesta coluna
      </p>
    </div>

    <button
      type="button"
      class="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:border-violet-300 hover:text-violet-600 dark:border-slate-700"
    >
      <UIcon name="i-heroicons-plus" class="size-4" />
      Adicionar tarefa
    </button>
  </div>
</template>
