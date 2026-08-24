<script setup lang="ts">
import type { Task, ProjectTeam } from '~/types'

const selectedIds = defineModel<string[]>('selectedIds', { default: () => [] })
const props = defineProps<{ tasks: Task[], isPersonal?: boolean, isSelecting?: boolean, readonly?: boolean, teamMode?: boolean, teams?: ProjectTeam[] }>()

const allSelected = computed({
  get: () => props.tasks.length > 0 && selectedIds.value.length === props.tasks.length,
  set: (val) => {
    selectedIds.value = val ? props.tasks.map(t => t.id) : []
  }
})

function toggleSelection(id: string) {
  const idx = selectedIds.value.indexOf(id)
  if (idx > -1) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <table class="w-full text-left">
      <thead>
        <tr class="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-900/50">
          <th v-if="isSelecting" class="px-4 py-3 w-10 text-center">
            <UCheckbox v-model="allSelected" />
          </th>
          <th class="px-4 py-3">Tarefa</th>
          <th v-if="!isPersonal" class="px-4 py-3">{{ teamMode ? 'Equipe' : 'Projeto' }}</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3">Prioridade</th>
          <th v-if="!isPersonal" class="px-4 py-3">Responsável</th>
          <th class="px-4 py-3">Prazo</th>
          <th v-if="!isPersonal" class="px-4 py-3 text-right text-amber-500 dark:text-amber-400">★</th>
          <th v-if="isPersonal" class="px-4 py-3 text-right">
            <span class="sr-only">Ações</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <TarefasTaskTableRow 
          v-for="task in tasks" 
          :key="task.id" 
          :task="task" 
          :is-personal="isPersonal"
          :is-selecting="isSelecting"
          :readonly="readonly"
          :selected="selectedIds.includes(task.id)"
          :team-mode="teamMode"
          :teams="teams"
          @toggle-select="toggleSelection(task.id)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </tbody>
    </table>
  </div>
</template>

