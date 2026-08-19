<script setup lang="ts">
import type { StatusKey, Task } from '~/types'
import { isPersonalTaskOverdue, updatePersonalTask } from '~/composables/useTasksData'

const props = defineProps<{ task: Task, isPersonal?: boolean, isSelecting?: boolean, selected?: boolean, readonly?: boolean }>()

const isDone = computed(() => props.task.status === 'concluido')
const isOverdue = computed(() => props.isPersonal && isPersonalTaskOverdue(props.task))
const done = computed({
  get: () => isDone.value,
  set: (val) => {
    // Apenas para tarefas pessoais, altera status direto.
    // Tarefas normais dependem das subtarefas.
    if (props.isPersonal) {
      setPersonalStatus(val ? 'concluido' : 'a-fazer')
    }
  }
})

const personalStatusCycle: StatusKey[] = ['a-fazer', 'em-andamento', 'concluido']

/**
 * Cores explicitamente vinculadas ao status pessoal. Usar valores CSS aqui
 * evita que uma classe dinâmica deixe de existir no CSS após um reload/build.
 */
const personalStatusStyle = computed(() => {
  if (props.task.status === 'a-fazer') {
    return { color: '#2563eb', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }
  }
  if (props.task.status === 'em-andamento') {
    return { color: '#b45309', backgroundColor: '#fffbeb', borderColor: '#fde68a' }
  }
  if (props.task.status === 'atrasado') {
    return { color: '#e11d48', backgroundColor: '#fff1f2', borderColor: '#fecdd3' }
  }
  return { color: '#059669', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }
})

function setPersonalStatus(status: StatusKey) {
  if (!props.isPersonal) return
  if (isOverdue.value) {
    updatePersonalTask({ ...props.task, status: 'atrasado' })
    return
  }
  updatePersonalTask({ ...props.task, status })
}

function cyclePersonalStatus() {
  if (!props.isPersonal || isOverdue.value) return
  const currentIndex = personalStatusCycle.indexOf(props.task.status)
  const nextStatus = personalStatusCycle[(currentIndex + 1) % personalStatusCycle.length]
  setPersonalStatus(nextStatus)
}

function handleRowClick(e: Event) {
  if (props.readonly) return
  const target = e.target as HTMLElement
  if (target.closest('button') || target.closest('input')) return
  navigateTo(`/colaborador/tarefa/${props.task.id}`)
}

const emit = defineEmits(['edit', 'delete', 'toggle-select'])

const actions = [
  [{
    label: 'Editar',
    icon: 'i-heroicons-pencil-square',
    onSelect: () => emit('edit', props.task)
  }],
  [{
    label: 'Excluir',
    icon: 'i-heroicons-trash',
    color: 'error',
    onSelect: () => emit('delete', props.task.id)
  }]
]
</script>

<template>
  <tr
    class="group border-b border-slate-100 transition-colors odd:bg-white even:bg-slate-50/50 dark:border-slate-800 dark:odd:bg-slate-900 dark:even:bg-slate-800/30"
    :class="[
      isSelecting && selected ? 'bg-violet-50/80 dark:bg-violet-900/20 hover:bg-violet-100/50 dark:hover:bg-violet-900/40' : readonly ? '' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80'
    ]"
    @click="handleRowClick"
  >
    <!-- Seleção -->
    <td v-if="isSelecting" class="px-4 py-3 w-10 text-center" @click.stop>
      <UCheckbox :model-value="selected" @update:model-value="emit('toggle-select')" />
    </td>
    <!-- Tarefa -->
    <td class="px-4 py-3 text-sm">
      <div class="flex items-center gap-3">
        <UCheckbox 
          v-if="isPersonal" 
          v-model="done" 
          :ui="{ base: 'rounded-full' }" 
          color="success" 
          :disabled="isOverdue"
          @click.stop 
        />
        <span class="font-semibold text-slate-800 dark:text-slate-200">{{ task.title }}</span>
        <div v-if="task.subtasks && task.subtasks.length > 0" class="flex items-center gap-1 text-slate-400 mt-0.5">
          <UIcon name="i-heroicons-share" class="size-3.5" />
          <span class="text-xs">{{ task.subtasks.length }}</span>
        </div>
      </div>
    </td>
    <!-- Projeto -->
    <td v-if="!isPersonal" class="px-4 py-3 text-sm text-slate-600 whitespace-nowrap dark:text-slate-400">
      <div v-if="task.project" class="flex items-center gap-2">
        <div class="size-2 rounded-full" :class="useProjectDotColor(task.project)" />
        <span>{{ task.project }}</span>
      </div>
      <span v-else class="text-slate-400">-</span>
    </td>
    <!-- Status -->
    <td class="px-4 py-3 text-sm whitespace-nowrap">
      <button
        v-if="isPersonal"
        type="button"
        class="rounded-md transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
        :class="isOverdue && 'cursor-not-allowed opacity-90'"
        :disabled="isOverdue"
        :title="isOverdue ? 'Altere o prazo para mudar o status desta tarefa atrasada' : 'Clique para avançar o status'"
        @click.stop="cyclePersonalStatus"
      >
        <span
          class="inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold"
          :style="personalStatusStyle"
        >
          {{ useStatusMeta(task.status).label }}
        </span>
      </button>
      <UiStatusBadge v-else :status="task.status" />
    </td>
    <!-- Prioridade -->
    <td class="px-4 py-3 text-sm whitespace-nowrap">
      <span class="font-medium" :class="usePriorityMeta(task.priority).text">
        {{ usePriorityMeta(task.priority).label }}
      </span>
    </td>
    <!-- Responsável -->
    <td v-if="!isPersonal" class="px-4 py-3 text-sm whitespace-nowrap">
      <div v-if="task.assignees && task.assignees.length > 0" class="flex items-center gap-2">
        <UAvatar :src="task.assignees[0]?.avatar" :alt="task.assignees[0]?.name" size="xs" />
        <span class="text-slate-600 dark:text-slate-400">{{ task.assignees[0]?.name }}</span>
      </div>
      <span v-else class="text-slate-400">-</span>
    </td>
    <!-- Prazo -->
    <td class="px-4 py-3 text-sm whitespace-nowrap">
      <span v-if="task.dueDate" :class="isOverdue || task.status === 'atrasado' ? 'font-semibold text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'">
        {{ task.dueDate }}
      </span>
      <span v-else class="text-slate-400">-</span>
    </td>
    <!-- Estrelas -->
    <td v-if="!isPersonal" class="px-4 py-3 text-right text-sm whitespace-nowrap">
      <span v-if="task.stars && task.stars > 0" class="font-medium text-amber-500 dark:text-amber-400">
        +{{ task.stars }}
      </span>
      <span v-else class="text-slate-400">0</span>
    </td>
    <!-- Actions -->
    <td v-if="isPersonal" class="px-4 py-3 text-right text-sm whitespace-nowrap">
      <UDropdownMenu :items="actions">
        <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-vertical" />
      </UDropdownMenu>
    </td>
  </tr>
</template>
