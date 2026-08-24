<script setup lang="ts">
definePageMeta({ sidebarWidget: 'none' })

const route = useRoute()
const router = useRouter()
const taskId = route.params.id as string
const currentUser = useCurrentUser()

const task = computed(() => {
  const foundTask = getTaskById(taskId)
  if (!foundTask) return undefined
  return foundTask.personal || foundTask.assignees.some((assignee) => assignee.id === currentUser.id)
    ? foundTask
    : undefined
})

function goBack() {
  router.back()
}

const progress = computed(() => {
  if (!task.value) return 0
  return getTaskProgress(task.value)
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
    'Prazo', 'Data de início', 'Data de conclusão', 'Tipo', 'Complexidade',
    'Categoria', 'Programa', 'Descrição', 'Observação', 'Avaliação', 'Subtarefas',
  ]
  const row = [
    currentTask.id,
    currentTask.title,
    currentTask.project,
    currentTask.team,
    useStatusMeta(currentTask.status).label,
    usePriorityMeta(currentTask.priority).label,
    currentTask.assignees.map((assignee) => assignee.name).join(', '),
    currentTask.dueDate,
    currentTask.startDate,
    currentTask.completedDate,
    currentTask.type,
    currentTask.complexity,
    currentTask.category,
    currentTask.program,
    currentTask.description,
    currentTask.note,
    currentTask.stars,
    currentTask.subtasks?.map((subtask) => `${subtask.title} (${subtask.completed ? 'concluída' : 'pendente'})`).join(', '),
  ]
  // O BOM preserva os caracteres acentuados ao abrir diretamente no Excel.
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

const showAllAudit = ref(false)
const displayedAuditLog = computed(() => {
  if (!task.value?.auditLog) return []
  if (showAllAudit.value) return task.value.auditLog
  return task.value.auditLog.slice(0, 3)
})
</script>

<template>
  <div class="mx-auto max-w-6xl p-4 sm:p-6">
    <div v-if="!task" class="flex flex-col items-center justify-center py-20 text-center">
      <UIcon name="i-heroicons-exclamation-circle" class="size-12 text-slate-400 mb-4" />
      <h2 class="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Tarefa não encontrada</h2>
      <p class="text-slate-500 mb-6">A tarefa que você está tentando acessar não existe ou foi removida.</p>
      <UButton color="white" icon="i-heroicons-arrow-left" @click="goBack">Voltar</UButton>
    </div>

    <div v-else>
      <div class="mb-6">
        <UButton variant="ghost" color="gray" icon="i-heroicons-arrow-left" @click="goBack">
          Voltar
        </UButton>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Left Column -->
        <div class="flex-1 flex flex-col gap-6 lg:w-[65%]">
          <!-- Header Card -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col sm:flex-row justify-between relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-4">
                <UiStatusBadge :status="task.status" />
                <UiPriorityBadge :priority="task.priority" />
              </div>
              <h1 class="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-3">
                {{ task.title }}
              </h1>
              <p v-if="task.project" class="text-violet-600 dark:text-violet-400 font-medium flex items-center gap-2">
                <UIcon name="i-heroicons-briefcase" class="size-5" /> {{ task.project }}
              </p>
            </div>
            
            <!-- Exportação da tarefa -->
            <div class="relative z-10 mt-6 flex items-center justify-center sm:mt-0 sm:pr-4">
              <div class="absolute w-32 h-32 bg-violet-100 dark:bg-violet-900/30 rounded-full blur-2xl"></div>
              <button
                type="button"
                class="relative flex size-20 items-center justify-center rounded-full border border-violet-200 bg-violet-100 text-violet-600 shadow-sm transition-all duration-200 hover:bg-[#bd52c9] hover:text-white hover:shadow-lg hover:shadow-fuchsia-500/25 focus-visible:bg-[#bd52c9] focus-visible:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-300 dark:border-violet-800 dark:bg-violet-900/50 dark:text-violet-400 dark:hover:bg-[#bd52c9] dark:hover:text-white"
                aria-label="Exportar tarefa em CSV"
                title="Exportar tarefa"
                @click="exportTask"
              >
                <UIcon name="i-heroicons-cloud-arrow-up" class="size-9" />
              </button>
            </div>
          </div>

          <!-- Description Card -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
              <UIcon name="i-heroicons-document-text" class="size-5 text-violet-500" /> Descrição
            </h2>
            <div class="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
              {{ task.description || task.note || 'Nenhuma descrição fornecida.' }}
            </div>
          </div>

          <!-- Subtasks Card -->
          <div v-if="task.subtasks && task.subtasks.length > 0" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <UIcon name="i-heroicons-share" class="size-5 text-violet-500" /> Subtarefas
              </h2>
              <span class="text-sm font-semibold text-slate-500">
                {{ task.subtasks.filter(s => s.completed).length }}/{{ task.subtasks.length }} concluídas
              </span>
            </div>
            
            <UiProgressBar :value="progress" color="bg-violet-500" class="mb-6" />
            
            <div class="flex flex-col gap-3">
              <div 
                v-for="subtask in task.subtasks" 
                :key="subtask.id"
                class="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <UCheckbox 
                    :model-value="subtask.completed"
                    color="success"
                    :ui="{ base: 'rounded-full' }"
                    @update:model-value="onToggleSubtask(subtask.id)"
                  />
                  <span 
                    class="font-medium"
                    :class="subtask.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'"
                  >
                    {{ subtask.title }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <span v-if="subtask.dueDate" class="text-xs text-slate-500 font-medium">
                    {{ subtask.dueDate }}
                  </span>
                  <UAvatar 
                    v-if="subtask.assignee?.avatar" 
                    :src="subtask.assignee.avatar" 
                    :alt="subtask.assignee.name"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Audit History Card -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-6">
              <UIcon name="i-heroicons-clock" class="size-5 text-violet-500" /> Histórico de Auditoria
            </h2>
            
            <div v-if="!task.auditLog || task.auditLog.length === 0" class="text-center py-4">
              <p class="text-sm text-slate-500 dark:text-slate-400">Nenhuma atividade registrada.</p>
            </div>
            
            <div v-else>
              <div class="space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                <div v-for="entry in displayedAuditLog" :key="entry.id" class="flex gap-4 relative">
                  <div class="size-6 rounded-full bg-violet-500 flex items-center justify-center shrink-0 z-10 text-white ring-4 ring-white dark:ring-slate-900">
                    <UIcon :name="entry.icon || 'i-heroicons-check'" class="size-3.5" />
                  </div>
                  <div class="min-w-0 flex-1 pb-1">
                    <p class="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-snug">{{ entry.message }}</p>
                    <p class="text-xs text-slate-500 mt-1">{{ entry.user }} • {{ entry.timestamp }}</p>
                  </div>
                </div>
              </div>
              
              <div v-if="task.auditLog.length > 3" class="mt-6 text-center border-t border-slate-100 dark:border-slate-800/50 pt-4">
                <button 
                  class="text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 flex items-center justify-center gap-1 mx-auto transition-colors"
                  @click="showAllAudit = !showAllAudit"
                >
                  {{ showAllAudit ? 'Ver menos' : 'Ver mais atividades' }}
                  <UIcon :name="showAllAudit ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="lg:w-[35%] flex flex-col gap-6">
          <!-- Details Card -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <UIcon name="i-heroicons-list-bullet" class="size-5 text-violet-500" /> Detalhes
            </h2>
            
            <ul class="flex flex-col">
              <!-- Responsável -->
              <li class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-user" class="size-5 text-slate-400" />
                  <span class="text-slate-500 dark:text-slate-400">Responsável</span>
                </div>
                <div class="flex -space-x-2">
                  <UAvatar 
                    v-for="user in task.assignees" 
                    :key="user.id" 
                    :src="user.avatar" 
                    :alt="user.name"
                    size="sm"
                    class="ring-2 ring-white dark:ring-slate-900"
                  />
                </div>
              </li>
              
              <!-- Início -->
              <li v-if="task.startDate" class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-calendar" class="size-5 text-slate-400" />
                  <span class="text-slate-500 dark:text-slate-400">Início</span>
                </div>
                <span class="text-slate-800 dark:text-slate-200 font-medium">{{ task.startDate }}</span>
              </li>
              
              <!-- Prazo -->
              <li v-if="task.dueDate" class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-calendar-days" class="size-5 text-slate-400" />
                  <span class="text-slate-500 dark:text-slate-400">Prazo</span>
                </div>
                <span 
                  class="font-medium flex items-center gap-1"
                  :class="task.status === 'atrasado' ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'"
                >
                  {{ task.dueDate }}
                  <UIcon v-if="task.status === 'atrasado'" name="i-heroicons-exclamation-triangle" class="size-4" />
                </span>
              </li>
              
              <!-- Tipo -->
              <li v-if="task.type" class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-tag" class="size-5 text-slate-400" />
                  <span class="text-slate-500 dark:text-slate-400">Tipo</span>
                </div>
                <span class="text-slate-800 dark:text-slate-200 font-medium">{{ task.type }}</span>
              </li>
              
              <!-- Complexidade -->
              <li v-if="task.complexity" class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-chart-bar" class="size-5 text-slate-400" />
                  <span class="text-slate-500 dark:text-slate-400">Complexidade</span>
                </div>
                <span class="text-slate-800 dark:text-slate-200 font-medium">{{ task.complexity }}</span>
              </li>
              
              <!-- Categoria -->
              <li v-if="task.category" class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-folder" class="size-5 text-slate-400" />
                  <span class="text-slate-500 dark:text-slate-400">Categoria</span>
                </div>
                <span class="text-slate-800 dark:text-slate-200 font-medium">{{ task.category }}</span>
              </li>
              
              <!-- Programa -->
              <li v-if="task.program" class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-square-3-stack-3d" class="size-5 text-slate-400" />
                  <span class="text-slate-500 dark:text-slate-400">Programa</span>
                </div>
                <span class="text-slate-800 dark:text-slate-200 font-medium">{{ task.program }}</span>
              </li>
            </ul>
          </div>

          <!-- Informações rápidas Card -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <UIcon name="i-heroicons-bolt" class="size-5 text-violet-500" /> Informações rápidas
            </h2>
            
            <ul class="flex flex-col">
              <li class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-hashtag" class="size-5 text-slate-400" />
                  <span class="text-slate-500 dark:text-slate-400">ID da tarefa</span>
                </div>
                <span class="text-slate-800 dark:text-slate-200 font-medium">#{{ task.id }}</span>
              </li>
              
              <li class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-clock" class="size-5 text-slate-400" />
                  <span class="text-slate-500 dark:text-slate-400">Criada em</span>
                </div>
                <span class="text-slate-800 dark:text-slate-200 font-medium">{{ task.auditLog?.[task.auditLog?.length - 1]?.timestamp || '01/01/2026' }}</span>
              </li>
              
              <li class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-arrow-path" class="size-5 text-slate-400" />
                  <span class="text-slate-500 dark:text-slate-400">Última atualização</span>
                </div>
                <span class="text-slate-800 dark:text-slate-200 font-medium">{{ task.auditLog?.[0]?.timestamp || 'Hoje' }}</span>
              </li>
              
              <li class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-information-circle" class="size-5 text-slate-400" />
                  <span class="text-slate-500 dark:text-slate-400">Status</span>
                </div>
                <span class="text-slate-800 dark:text-slate-200 font-medium capitalize">{{ task.status }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
