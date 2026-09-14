<script setup lang="ts">
import type { StatusKey, Task } from '~/types'

const props = defineProps<{ status: StatusKey; tasks: Task[]; interactive?: boolean }>()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [taskId: string]
  dragStart: [taskId: string]
  drop: [status: StatusKey, taskId?: string]
}>()

const meta = computed(() => useStatusMeta(props.status))

const currentUser = useCurrentUser()
const isColaborador = computed(() => currentUser.role === 'Colaborador')

/** Fundo da área atrás dos cartões (não dos cards em si). */
const COLUMN_TRACK: Record<StatusKey, string> = {
  'a-fazer': 'bg-blue-100/70 dark:bg-blue-950/25',
  'em-andamento': 'bg-amber-100/70 dark:bg-amber-950/25',
  'em-revisao': 'bg-violet-100/70 dark:bg-violet-950/25',
  'validar': 'bg-cyan-100/70 dark:bg-cyan-950/25',
  bloqueado: 'bg-red-100/60 dark:bg-red-950/25',
  atrasado: 'bg-rose-100/60 dark:bg-rose-950/25',
  concluido: 'bg-emerald-100/70 dark:bg-emerald-950/25',
  'pausado': 'bg-slate-100/70 dark:bg-slate-950/25',
  'cancelado': 'bg-gray-100/70 dark:bg-gray-950/25',
}

const trackClass = computed(() => COLUMN_TRACK[props.status] || 'bg-slate-100/70 dark:bg-slate-950/25')

function handleDrop(e: DragEvent) {
  if (!props.interactive) return
  e.preventDefault()
  const taskId = e.dataTransfer?.getData('text/plain')
  emit('drop', props.status, taskId || undefined)
}
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
      class="space-y-3 rounded-xl p-3 min-h-28 transition-colors"
      :class="[trackClass, interactive && 'outline outline-1 outline-transparent hover:outline-violet-300 dark:hover:outline-violet-700']"
      @dragover.prevent
      @dragenter.prevent
      @drop="handleDrop"
    >
      <QuadrosTaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :done="status === 'concluido'"
        :interactive="interactive"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @drag-start="emit('dragStart', $event)"
      />

      <p
        v-if="tasks.length === 0"
        class="rounded-lg border border-dashed border-white/60 py-8 text-center text-xs text-slate-500 dark:border-slate-700"
      >
        Nenhuma tarefa nesta coluna
      </p>
    </div>
  </div>
</template>
