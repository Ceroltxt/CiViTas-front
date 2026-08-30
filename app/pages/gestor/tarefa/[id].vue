<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { getTaskById, toggleSubtask, useTasksRef } from '~/composables/useTasksData'

definePageMeta({ sidebarWidget: 'none' })

const route = useRoute()
const router = useRouter()
const taskId = route.params.id as string

const task = computed(() => getTaskById(taskId))
const tasks = useTasksRef()

function goBack() {
  router.back()
}

const progress = computed(() => {
  if (!task.value || !task.value.subtasks || task.value.subtasks.length === 0) return 0
  const done = task.value.subtasks.filter(s => s.completed).length
  return Math.round((done / task.value.subtasks.length) * 100)
})

function onToggleSubtask(subtaskId: string) {
  toggleSubtask(taskId, subtaskId)
}

function escapeCsvValue(value: string | number | undefined): string {
  const text = String(value ?? '')
  return /[;"\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function exportTask() {
  if (!task.value) return

  const currentTask = task.value
  const header = [
    'ID', 'Tarefa', 'Projeto', 'Equipe', 'Status', 'Prioridade', 'Responsáveis',
    'Prazo', 'Data de início', 'Data de conclusão', 'Descrição', 'Observação', 'Subtarefas',
  ]
  const row = [
    currentTask.id,
    currentTask.title,
    currentTask.project,
    currentTask.team,
    currentTask.status,
    currentTask.priority,
    'Costa Neves', // Forçado como usuário
    currentTask.dueDate,
    currentTask.startDate,
    currentTask.completedDate,
    currentTask.description,
    currentTask.note,
    currentTask.subtasks?.map((subtask) => `${subtask.title} (${subtask.completed ? 'concluída' : 'pendente'})`).join(', '),
  ]
  const csv = `\uFEFF${[header, row].map((values) => values.map(escapeCsvValue).join(';')).join('\r\n')}`
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `tarefa-${currentTask.id}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

// === EDIÇÃO ===
const titleInputRef = ref<HTMLInputElement | null>(null)
const descInputRef = ref<HTMLTextAreaElement | null>(null)
const subtaskInputRefs = ref<Record<string, HTMLInputElement | null>>({})

const isEditingTitle = ref(false)
const titleModel = ref('')
function editTitle() {
  if (!task.value) return
  titleModel.value = task.value.title
  isEditingTitle.value = true
  nextTick(() => titleInputRef.value?.focus())
}
function saveTitle() {
  if (task.value && titleModel.value.trim()) {
    task.value.title = titleModel.value.trim()
  }
  isEditingTitle.value = false
}

const isEditingDesc = ref(false)
const descModel = ref('')
function editDesc() {
  if (!task.value) return
  descModel.value = task.value.description || task.value.note || ''
  isEditingDesc.value = true
  nextTick(() => descInputRef.value?.focus())
}
function saveDesc() {
  if (task.value) {
    task.value.description = descModel.value.trim()
  }
  isEditingDesc.value = false
}

const isEditingSubtask = ref<string | null>(null)
const subtaskModel = ref('')
function editSubtask(subtaskId: string, currentTitle: string) {
  subtaskModel.value = currentTitle
  isEditingSubtask.value = subtaskId
  nextTick(() => subtaskInputRefs.value[subtaskId]?.focus())
}
function saveSubtask(subtaskId: string) {
  if (task.value && task.value.subtasks) {
    const st = task.value.subtasks.find(s => s.id === subtaskId)
    if (st && subtaskModel.value.trim()) {
      st.title = subtaskModel.value.trim()
    }
  }
  isEditingSubtask.value = null
}

const isAddingSubtask = ref(false)
const newSubtaskTitle = ref('')
const newSubtaskInputRef = ref<HTMLInputElement | null>(null)

function startAddingSubtask() {
  isAddingSubtask.value = true
  nextTick(() => newSubtaskInputRef.value?.focus())
}

function cancelAddingSubtask() {
  isAddingSubtask.value = false
  newSubtaskTitle.value = ''
}

function addSubtask() {
  if (!task.value || !newSubtaskTitle.value.trim()) {
    isAddingSubtask.value = false
    return
  }
  if (!task.value.subtasks) task.value.subtasks = []
  task.value.subtasks.push({
    id: `st-${Date.now()}`,
    title: newSubtaskTitle.value.trim(),
    completed: false,
    assignee: { name: 'Costa Neves', avatar: 'https://i.pravatar.cc/80?img=47' }
  })
  newSubtaskTitle.value = ''
  nextTick(() => newSubtaskInputRef.value?.focus())
}

function removeSubtask(subtaskId: string) {
  if (task.value && task.value.subtasks) {
    task.value.subtasks = task.value.subtasks.filter(s => s.id !== subtaskId)
  }
}

// Move subtasks
function moveSubtaskUp(index: number) {
  if (!task.value || !task.value.subtasks || index === 0) return
  const st = task.value.subtasks
  const temp = st[index - 1]
  st[index - 1] = st[index]
  st[index] = temp
}
function moveSubtaskDown(index: number) {
  if (!task.value || !task.value.subtasks || index === task.value.subtasks.length - 1) return
  const st = task.value.subtasks
  const temp = st[index + 1]
  st[index + 1] = st[index]
  st[index] = temp
}

const newComment = ref('')
function addComment() {
  if (!task.value || !newComment.value.trim()) return
  if (!task.value.auditLog) task.value.auditLog = []
  
  task.value.auditLog.unshift({
    id: `c-${Date.now()}`,
    icon: 'i-heroicons-chat-bubble-left',
    message: newComment.value.trim(),
    user: 'Costa Neves',
    timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às'),
  })
  newComment.value = ''
}

// Cycle options
const statuses = ['a-fazer', 'em-andamento', 'em-revisao', 'concluido', 'atrasado', 'pausado', 'cancelado']
const statusLabels: Record<string, string> = {
  'a-fazer': 'A fazer', 'em-andamento': 'Em andamento', 'em-revisao': 'Em revisão',
  concluido: 'Concluída', atrasado: 'Atrasada', pausado: 'Pausada', cancelado: 'Cancelada',
}
function registerActivity(message: string, icon = 'i-heroicons-arrow-path') {
  if (!task.value) return
  task.value.auditLog ||= []
  task.value.auditLog.unshift({
    id: `a-${Date.now()}`,
    icon,
    message,
    user: 'Milani Ribeiro',
    timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às'),
  })
}
function cycleStatus() {
  if (!task.value) return
  const currentIdx = statuses.indexOf(task.value.status)
  const nextIdx = (currentIdx + 1) % statuses.length
  task.value.status = statuses[nextIdx] as any
  registerActivity(`Milani Ribeiro alterou o status para ${statusLabels[task.value.status]}.`)
}

const priorities = ['baixa', 'media', 'alta', 'critica']
function cyclePriority() {
  if (!task.value) return
  const currentIdx = priorities.indexOf(task.value.priority as any)
  const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % priorities.length
  task.value.priority = priorities[nextIdx] as any
}

function markAsCompleted() {
  if (!task.value) return
  task.value.status = 'concluido'
  registerActivity('Milani Ribeiro marcou a tarefa como concluída.', 'i-heroicons-check-circle')
}

function pauseTask() {
  if (!task.value) return
  task.value.status = 'pausado'
  registerActivity('Milani Ribeiro pausou a tarefa.', 'i-heroicons-pause-circle')
}

function requestAdjustments() {
  if (!task.value) return
  task.value.status = 'em-revisao'
  registerActivity('Milani Ribeiro solicitou ajustes nesta tarefa.')
}

function deleteTask() {
  if (!task.value || !confirm('Excluir esta tarefa? Esta ação não pode ser desfeita.')) return
  tasks.value = tasks.value.filter(item => item.id !== taskId)
  goBack()
}

const isEditingDueDate = ref(false)
const dueDateModel = ref('')
const dueDateInputRef = ref<HTMLInputElement | null>(null)
function editDueDate() {
  if (!task.value) return
  dueDateModel.value = task.value.dueDate || ''
  isEditingDueDate.value = true
  nextTick(() => dueDateInputRef.value?.focus())
}
function saveDueDate() {
  if (task.value) {
    task.value.dueDate = dueDateModel.value.trim()
  }
  isEditingDueDate.value = false
}

const showAllAudit = ref(false)
const displayedAuditLog = computed(() => {
  if (!task.value?.auditLog) return []
  if (showAllAudit.value) return task.value.auditLog
  return task.value.auditLog.slice(0, 3)
})
</script>

<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 lg:p-10">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="goBack"></div>

    <div v-if="!task" class="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
      <UIcon name="i-heroicons-exclamation-circle" class="size-12 text-slate-400 mb-4 mx-auto" />
      <h2 class="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Tarefa não encontrada</h2>
      <p class="text-slate-500 mb-6">A tarefa que você está tentando acessar não existe ou foi removida.</p>
      <UButton color="white" icon="i-heroicons-arrow-left" @click="goBack">Voltar</UButton>
    </div>

    <div v-else class="relative z-10 w-full h-full max-w-[1600px] bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-[fade-in_0.15s_ease-out]">
      <!-- Cabeçalho -->
      <div class="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-2.5 text-xs text-slate-500 gap-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-briefcase" class="size-3.5" />
          <span class="hover:underline cursor-pointer">{{ task.project || 'Sem projeto' }}</span>
          <span v-if="task.team">/</span>
          <span v-if="task.team" class="hover:underline cursor-pointer flex items-center gap-1">
            <UIcon name="i-heroicons-users" class="size-3.5" /> {{ task.team }}
          </span>
        </div>
        <div class="flex items-center gap-1 sm:gap-3">
          <span class="hidden sm:inline">Criada em {{ task.auditLog?.[task.auditLog?.length - 1]?.timestamp || '15 ago' }}</span>
          <UButton variant="ghost" color="gray" icon="i-heroicons-share" label="Compartilhar" size="xs" class="hidden sm:flex" />
          <UButton variant="ghost" color="gray" icon="i-heroicons-cloud-arrow-up" label="Exportar" size="xs" @click="exportTask" />
          <UButton variant="ghost" color="gray" icon="i-heroicons-x-mark" size="sm" @click="goBack" title="Fechar" />
        </div>
      </div>

      <!-- Corpo -->
      <div class="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <!-- Esquerdo -->
        <div class="flex-1 p-6 sm:p-8 lg:border-r border-slate-100 dark:border-slate-800 overflow-y-auto scroll-thin">
          <div class="flex items-center gap-2 mb-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
            <UIcon name="i-heroicons-check-circle" class="size-4" /> Tarefa • #{{ task.id }}
          </div>
          
          <div v-if="!isEditingTitle" class="mb-8 cursor-text group" @click="editTitle">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white inline-block">
              {{ task.title }}
            </h1>
            <UIcon name="i-heroicons-pencil" class="size-5 ml-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div v-else class="mb-8 flex gap-2">
            <input 
              ref="titleInputRef"
              v-model="titleModel" 
              class="flex-1 text-2xl sm:text-3xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
              @blur="saveTitle"
              @keyup.enter="saveTitle"
            />
          </div>

          <!-- Campos (Simplificado) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 mb-10">
            <div class="flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1 -m-1 rounded-lg transition-colors" @click="cycleStatus">
              <span class="text-sm text-slate-500 w-28 flex items-center gap-2"><UIcon name="i-heroicons-play-circle" class="size-4" /> Status</span>
              <UiStatusBadge :status="task.status" />
            </div>
            
            <div class="flex items-center gap-4">
              <span class="text-sm text-slate-500 w-28 flex items-center gap-2"><UIcon name="i-heroicons-users" class="size-4" /> Responsável</span>
              <div class="flex items-center gap-1.5">
                <UAvatar src="https://i.pravatar.cc/80?img=47" alt="Costa Neves" size="xs" />
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Costa Neves</span>
              </div>
            </div>
            
            <div class="flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1 -m-1 rounded-lg transition-colors" @click="cyclePriority">
              <span class="text-sm text-slate-500 w-28 flex items-center gap-2"><UIcon name="i-heroicons-flag" class="size-4" /> Prioridade</span>
              <UiPriorityBadge :priority="task.priority || 'baixa'" />
            </div>
            
            <div class="flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1 -m-1 rounded-lg transition-colors" @click="editDueDate">
              <span class="text-sm text-slate-500 w-28 flex items-center gap-2"><UIcon name="i-heroicons-calendar-days" class="size-4" /> Prazo</span>
              <div v-if="!isEditingDueDate" class="text-sm font-medium flex items-center gap-1 group" :class="task.status === 'atrasado' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'">
                {{ task.dueDate || 'Vazio' }}
                <UIcon v-if="task.status === 'atrasado'" name="i-heroicons-exclamation-triangle" class="size-4" />
                <UIcon name="i-heroicons-pencil" class="size-3.5 ml-1 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <input
                v-else
                ref="dueDateInputRef"
                v-model="dueDateModel"
                type="date"
                class="w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                @blur="saveDueDate"
                @keyup.enter="saveDueDate"
              />
            </div>
          </div>

          <div class="mb-8 flex flex-wrap gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
            <UButton size="sm" class="bg-emerald-500 hover:bg-emerald-600" icon="i-heroicons-check-circle" @click="markAsCompleted">Marcar como concluída</UButton>
            <UButton size="sm" color="neutral" variant="outline" icon="i-heroicons-pause" @click="pauseTask">Pausar tarefa</UButton>
            <UButton size="sm" color="warning" variant="outline" icon="i-heroicons-arrow-path" @click="requestAdjustments">Solicitar ajustes</UButton>
            <UButton size="sm" color="error" variant="outline" icon="i-heroicons-trash" @click="deleteTask">Excluir tarefa</UButton>
          </div>

          <UDivider class="my-8" />

          <!-- Descrição -->
          <div class="mb-10">
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              Descrição
            </h3>
            <div v-if="!isEditingDesc" class="cursor-text group rounded-lg p-2 -mx-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors min-h-[60px]" @click="editDesc">
              <div v-if="task.description || task.note" class="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                {{ task.description || task.note }}
              </div>
              <div v-else class="text-slate-400 text-sm italic group-hover:text-slate-500">
                Adicione uma descrição...
              </div>
            </div>
            <div v-else>
              <textarea 
                ref="descInputRef"
                v-model="descModel"
                rows="4"
                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                @blur="saveDesc"
                @keydown.ctrl.enter="saveDesc"
                @keydown.meta.enter="saveDesc"
              ></textarea>
              <div class="flex justify-end gap-2 mt-2">
                <UButton size="xs" color="gray" variant="ghost" @click="isEditingDesc = false">Cancelar</UButton>
                <UButton size="xs" color="primary" @click="saveDesc">Salvar</UButton>
              </div>
            </div>
          </div>

          <!-- Subtarefas -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-heroicons-share" class="size-4 text-slate-500" />
              <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Subtarefas <span class="text-slate-400 font-normal ml-1">{{ task.subtasks?.length || 0 }} disponíveis</span>
              </h3>
            </div>
            
            <UiProgressBar v-if="task.subtasks?.length" :value="progress" color="bg-emerald-500" class="mb-4 h-1.5" />

            <div class="space-y-1">
              <div v-if="task.subtasks?.length" class="grid grid-cols-12 text-xs font-medium text-slate-400 px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div class="col-span-7">Nome</div>
                <div class="col-span-3">Responsável</div>
                <div class="col-span-2 text-right">Ações</div>
              </div>
              
              <div 
                v-for="(subtask, index) in task.subtasks" 
                :key="subtask.id"
                class="grid grid-cols-12 items-center px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg group transition-colors"
              >
                <div class="col-span-7 flex items-center gap-3">
                  <UCheckbox 
                    :model-value="subtask.completed"
                    color="primary"
                    :ui="{ base: 'rounded-full' }"
                    @update:model-value="onToggleSubtask(subtask.id)"
                  />
                  <div v-if="isEditingSubtask === subtask.id" class="flex-1">
                    <input 
                      :ref="el => { if (el) subtaskInputRefs[subtask.id] = el as HTMLInputElement }"
                      v-model="subtaskModel" 
                      class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                      @blur="saveSubtask(subtask.id)"
                      @keyup.enter="saveSubtask(subtask.id)"
                    />
                  </div>
                  <span 
                    v-else 
                    class="text-sm flex-1 truncate" 
                    :class="[
                      subtask.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300',
                      'cursor-text hover:text-primary-500'
                    ]"
                    @click="editSubtask(subtask.id, subtask.title)"
                  >
                    {{ subtask.title }}
                  </span>
                </div>
                <div class="col-span-3 flex items-center gap-2">
                  <UAvatar src="https://i.pravatar.cc/80?img=47" alt="Costa Neves" size="2xs" />
                  <span class="text-xs text-slate-500 truncate">Costa Neves</span>
                </div>
                <div class="col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <UButton size="2xs" variant="ghost" color="gray" icon="i-heroicons-arrow-up" :disabled="index === 0" @click="moveSubtaskUp(index)" />
                  <UButton size="2xs" variant="ghost" color="gray" icon="i-heroicons-arrow-down" :disabled="index === task.subtasks.length - 1" @click="moveSubtaskDown(index)" />
                  <UButton size="2xs" variant="ghost" color="red" icon="i-heroicons-trash" @click="removeSubtask(subtask.id)" />
                </div>
              </div>
              
              <div class="mt-4">
                <button 
                  v-if="!isAddingSubtask"
                  class="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-500 px-3 py-2 w-full text-left transition-colors"
                  @click="startAddingSubtask"
                >
                  <UIcon name="i-heroicons-plus" class="size-4" /> Adicionar subtarefa...
                </button>
                <div v-else class="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <input 
                    ref="newSubtaskInputRef"
                    v-model="newSubtaskTitle" 
                    placeholder="O que precisa ser feito?" 
                    class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    @keyup.enter="addSubtask"
                    @keyup.esc="cancelAddingSubtask"
                  />
                  <div class="flex justify-end gap-2">
                    <UButton size="xs" color="gray" variant="ghost" @click="cancelAddingSubtask">Cancelar</UButton>
                    <UButton size="xs" color="primary" @click="addSubtask">Salvar</UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Direito (Atividade) -->
        <div v-if="!task.personal" class="w-full lg:w-[320px] xl:w-[380px] bg-slate-50/50 dark:bg-slate-900/30 flex flex-col border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
          <div class="p-4 sm:p-6 flex-1 overflow-y-auto scroll-thin">
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="size-4 text-slate-400" /> Atividade
            </h3>
            
            <div v-if="!task.auditLog || task.auditLog.length === 0" class="text-center py-8">
              <p class="text-sm text-slate-500">Nenhuma atividade registrada.</p>
            </div>
            
            <div v-else class="space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-slate-200 dark:before:bg-slate-700">
              <div v-for="entry in displayedAuditLog" :key="entry.id" class="flex gap-4 relative">
                <div class="size-6 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-slate-50 dark:ring-slate-900" :class="entry.icon === 'i-heroicons-chat-bubble-left' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300'">
                  <UIcon :name="entry.icon || 'i-heroicons-check'" class="size-3" />
                </div>
                <div class="min-w-0 flex-1 pt-0.5">
                  <p v-if="entry.icon === 'i-heroicons-chat-bubble-left'" class="text-sm text-slate-900 dark:text-white font-medium mb-1">
                    {{ entry.user }}
                  </p>
                  <p class="text-sm text-slate-700 dark:text-slate-300 break-words bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 shadow-sm" v-if="entry.icon === 'i-heroicons-chat-bubble-left'">
                    {{ entry.message }}
                  </p>
                  <p v-else class="text-sm text-slate-700 dark:text-slate-300">
                    <span class="font-medium text-slate-900 dark:text-white">{{ entry.user }}</span>
                    {{ entry.message.replace(entry.user, '') }}
                  </p>
                  <p class="text-xs text-slate-400 mt-1">{{ entry.timestamp }}</p>
                </div>
              </div>
            </div>
            
            <div v-if="task.auditLog && task.auditLog.length > 3" class="mt-6 text-center border-t border-slate-200 dark:border-slate-700/50 pt-4">
              <button 
                class="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                @click="showAllAudit = !showAllAudit"
              >
                {{ showAllAudit ? 'Ver menos' : 'Ver mais atividades' }}
              </button>
            </div>
          </div>
          
          <div class="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-auto">
            <div class="relative flex gap-2">
              <input 
                v-model="newComment"
                type="text" 
                placeholder="Escreva um comentário..." 
                class="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                @keyup.enter="addComment"
              >
              <button class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors" @click="addComment">
                <UIcon name="i-heroicons-paper-airplane" class="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
