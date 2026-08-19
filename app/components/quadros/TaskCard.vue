<script setup lang="ts">
import type { Task } from '~/types'

const props = defineProps<{ task: Task; done?: boolean; interactive?: boolean }>()
const currentUser = useCurrentUser()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [taskId: string]
  dragStart: [taskId: string]
}>()

function openTask() {
  if (props.interactive) navigateTo(`/colaborador/tarefa/${props.task.id}`)
}

const actions = computed(() => [[
  { label: 'Editar', icon: 'i-heroicons-pencil-square', onSelect: () => emit('edit', props.task) },
  { label: 'Excluir', icon: 'i-heroicons-trash', color: 'error', onSelect: () => emit('delete', props.task.id) },
]])

const assignee = computed(() => props.task.personal ? currentUser : props.task.assignees[0])
</script>

<template>
  <article
    class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    :class="interactive && 'cursor-grab active:cursor-grabbing hover:border-violet-300 dark:hover:border-violet-700'"
    :draggable="interactive"
    @click="openTask"
    @dragstart="emit('dragStart', task.id)"
  >
    <div class="flex items-start justify-between gap-2">
      <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ task.title }}</h3>
      <UIcon
        v-if="done"
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

    <div class="mt-2">
      <UiPriorityBadge :priority="task.priority" />
    </div>

    <p v-if="task.note" class="mt-2 text-xs text-slate-400">{{ task.note }}</p>

    <div v-if="task.progress != null" class="mt-3">
      <UiProgressBar :value="task.progress" gradient />
      <p class="mt-1 text-right text-xs font-medium text-slate-500">{{ task.progress }}%</p>
    </div>

    <div class="mt-3 flex items-center justify-between">
      <UAvatar :src="assignee?.avatar" :alt="assignee?.name" size="2xs" />
      <span class="flex items-center gap-1 text-xs text-slate-400">
        <UIcon name="i-heroicons-calendar-days" class="size-3.5" />
        {{ task.dueDate }}
      </span>
    </div>
  </article>
</template>
