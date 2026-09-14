<script setup lang="ts">
import type { Task } from '~/types'

const props = defineProps<{ task: Task; done?: boolean; interactive?: boolean }>()
const currentUser = useCurrentUser()
const route = useRoute()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [taskId: string]
  dragStart: [taskId: string]
}>()

function openTask() {
  if (route.path.startsWith('/admin')) {
    navigateTo(`/admin/projetos`)
  } else if (route.path.startsWith('/gestor')) {
    navigateTo(`/gestor/tarefa/${props.task.id}`)
  } else {
    navigateTo(`/colaborador/tarefa/${props.task.id}`)
  }
}

function onDragStart(e: DragEvent) {
  e.dataTransfer?.setData('text/plain', String(props.task.id))
  emit('dragStart', String(props.task.id))
}

const actions = computed(() => [[
  { label: 'Editar', icon: 'i-heroicons-pencil-square', onSelect: () => emit('edit', props.task) },
  { label: 'Excluir', icon: 'i-heroicons-trash', color: 'error', onSelect: () => emit('delete', props.task.id) },
]])

const assignee = computed(() => props.task.personal ? currentUser : props.task.assignees?.[0])
</script>

<template>
  <article
    class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 cursor-grab active:cursor-grabbing hover:border-violet-300 dark:hover:border-violet-700"
    :draggable="interactive !== false"
    @click="openTask"
    @dragstart="onDragStart"
  >
    <div class="flex items-start justify-between gap-2">
      <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ task.title }}</h3>
      <UIcon
        v-if="done || task.status === 'concluido'"
        name="i-heroicons-check-circle-solid"
        class="size-5 shrink-0 text-emerald-500"
      />
      <UDropdownMenu v-if="interactive" :items="actions">
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-heroicons-ellipsis-vertical"
          aria-label="Ações da tarefa"
          class="-mr-1 -mt-1 text-slate-400 hover:text-violet-600"
          @click.stop
        />
      </UDropdownMenu>
    </div>

    <div class="mt-2 flex items-center gap-2">
      <UiPriorityBadge :priority="task.priority" />
      <span v-if="task.project" class="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded truncate max-w-[120px]">
        {{ task.project }}
      </span>
    </div>

    <p v-if="task.note" class="mt-2 text-xs text-rose-500 font-medium">{{ task.note }}</p>

    <div v-if="task.progress != null" class="mt-3">
      <UiProgressBar :value="task.progress" gradient />
      <p class="mt-1 text-right text-xs font-medium text-slate-500">{{ task.progress }}%</p>
    </div>

    <div class="mt-3 flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <UAvatar :src="assignee?.avatar" :alt="assignee?.name" size="2xs" />
        <span class="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[100px]">{{ assignee?.name }}</span>
      </div>
      <span class="flex items-center gap-1 text-xs text-slate-400">
        <UIcon name="i-heroicons-calendar-days" class="size-3.5" />
        {{ task.dueDate || '-' }}
      </span>
    </div>
  </article>
</template>
