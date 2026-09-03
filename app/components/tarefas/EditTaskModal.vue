<script setup lang="ts">
import type { PriorityKey, Task } from '~/types'
import { updateTaskInSupabase, deleteTaskFromSupabase } from '~/composables/useTasksData'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ task?: Task | null; taskToEdit?: Task | null }>()
const currentTask = computed(() => props.task || props.taskToEdit || null)

const emit = defineEmits<{ updated: []; deleted: [] }>()

const title = ref('')
const description = ref('')
const priority = ref<PriorityKey>('media')
const deadline = ref('')
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

watch(currentTask, (task) => {
  if (task) {
    title.value = task.title || ''
    description.value = task.description || ''
    priority.value = task.priority || 'media'
    
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    deadline.value = `${year}-${month}-${day}`
  }
}, { immediate: true })

function closeModal() {
  open.value = false
  errorMessage.value = null
}

async function handleSave() {
  if (!currentTask.value?.id) return
  if (!title.value.trim()) {
    errorMessage.value = 'O título da tarefa é obrigatório.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  const success = await updateTaskInSupabase(currentTask.value.id, {
    nome: title.value.trim(),
    descricao: description.value.trim(),
    prioridade: priority.value,
    data_prazo: deadline.value,
  })

  isSubmitting.value = false

  if (success) {
    emit('updated')
    closeModal()
  } else {
    errorMessage.value = 'Erro ao salvar alterações na tarefa no Supabase.'
  }
}

async function handleDelete() {
  if (!currentTask.value?.id) return
  if (!confirm('Tem certeza que deseja excluir esta tarefa permanentemente?')) return

  isSubmitting.value = true
  const success = await deleteTaskFromSupabase(currentTask.value.id)
  isSubmitting.value = false

  if (success) {
    emit('deleted')
    closeModal()
  } else {
    errorMessage.value = 'Erro ao excluir tarefa no Supabase.'
  }
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'max-w-lg' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">
          Editar Tarefa
        </h2>
        <button
          type="button"
          class="flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          @click="closeModal"
        >
          <UIcon name="i-heroicons-x-mark" class="size-5" />
        </button>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <div v-if="errorMessage" class="p-3 bg-rose-100 border border-rose-400 text-rose-700 rounded-lg text-xs font-semibold">
          {{ errorMessage }}
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Título da Tarefa <span class="text-rose-500">*</span>
          </label>
          <UInput v-model="title" placeholder="Título da tarefa" class="w-full" :disabled="isSubmitting" />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Descrição
          </label>
          <UTextarea v-model="description" :rows="3" placeholder="Descrição detalhada..." class="w-full" :disabled="isSubmitting" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Prioridade
            </label>
            <select
              v-model="priority"
              class="w-full h-[38px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              :disabled="isSubmitting"
            >
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Prazo Final
            </label>
            <UInput v-model="deadline" type="date" class="w-full" :disabled="isSubmitting" />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-between items-center gap-3">
        <UButton
          color="error"
          variant="ghost"
          icon="i-heroicons-trash"
          label="Excluir Tarefa"
          :loading="isSubmitting"
          @click="handleDelete"
        />

        <div class="flex gap-2">
          <UButton color="neutral" variant="outline" label="Cancelar" @click="closeModal" />
          <UButton
            color="primary"
            variant="solid"
            label="Salvar Alterações"
            class="bg-violet-600 hover:bg-violet-700 text-white"
            :loading="isSubmitting"
            @click="handleSave"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
