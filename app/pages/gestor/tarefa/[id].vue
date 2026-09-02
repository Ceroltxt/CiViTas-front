<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Task } from '~/types'

definePageMeta({ sidebarWidget: 'none' })

const route = useRoute()
const router = useRouter()
const taskId = route.params.id as string

const apiTask = ref<Task | null>(null)
const isLoading = ref(true)

function goBack() {
  router.back()
}

async function loadTaskDetails() {
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const authToken = useCookie<string | null>('auth_token')
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (authToken.value) {
      headers.Authorization = `Bearer ${authToken.value}`
    }

    const data = await $fetch<Task>(`/tasks/${taskId}`, { baseURL, headers })
    if (data) {
      apiTask.value = data
    }
  } catch (e) {
    console.error('Erro ao buscar detalhes da tarefa no Supabase:', e)
    const local = getTaskById(taskId)
    if (local) apiTask.value = local
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTaskDetails()
})

const task = computed(() => apiTask.value)

const progress = computed(() => {
  if (!task.value || !task.value.subtasks || task.value.subtasks.length === 0) return task.value?.progress ?? 0
  const done = task.value.subtasks.filter(s => s.completed).length
  return Math.round((done / task.value.subtasks.length) * 100)
})

async function onToggleSubtask(subtaskId: string) {
  try {
    const config = useRuntimeConfig()
    const authToken = useCookie<string | null>('auth_token')
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (authToken.value) {
      headers.Authorization = `Bearer ${authToken.value}`
    }

    await $fetch(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`, {
      method: 'PATCH',
      baseURL,
      headers,
    })
    await loadTaskDetails()
  } catch (e) {
    toggleSubtask(taskId, subtaskId)
  }
}

const newComment = ref('')
async function addComment() {
  if (!newComment.value.trim()) return
  try {
    const config = useRuntimeConfig()
    const authToken = useCookie<string | null>('auth_token')
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (authToken.value) {
      headers.Authorization = `Bearer ${authToken.value}`
    }

    await $fetch(`/tasks/${taskId}/comments`, {
      method: 'POST',
      baseURL,
      headers,
      body: { comentario: newComment.value.trim() },
    })
    newComment.value = ''
    await loadTaskDetails()
  } catch (e) {
    console.error('Erro ao enviar comentario:', e)
  }
}

async function updateStatus(newStatus: string) {
  try {
    const config = useRuntimeConfig()
    const authToken = useCookie<string | null>('auth_token')
    const baseURL = (config.public.apiBase as string) || 'http://localhost:8080/api'
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (authToken.value) {
      headers.Authorization = `Bearer ${authToken.value}`
    }

    await $fetch(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      baseURL,
      headers,
      body: { status: newStatus },
    })
    await loadTaskDetails()
  } catch (e) {
    console.error('Erro ao atualizar status:', e)
  }
}

const showAllAudit = ref(false)
const displayedAuditLog = computed(() => {
  if (!task.value?.auditLog) return []
  if (showAllAudit.value) return task.value.auditLog
  return task.value.auditLog.slice(0, 5)
})
</script>

<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 lg:p-10">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="goBack"></div>

    <div v-if="isLoading" class="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 text-center">
      <UIcon name="i-heroicons-arrow-path" class="size-8 animate-spin text-orange-500 mx-auto mb-3" />
      <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">Carregando...</p>
    </div>

    <div v-else-if="!task" class="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
      <UIcon name="i-heroicons-exclamation-circle" class="size-12 text-slate-400 mb-4 mx-auto" />
      <h2 class="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Tarefa não encontrada</h2>
      <p class="text-slate-500 mb-6">A tarefa que você está tentando acessar não existe no Supabase.</p>
      <UButton color="white" icon="i-heroicons-arrow-left" @click="goBack">Voltar</UButton>
    </div>

    <div v-else class="relative z-10 w-full h-full max-w-[1600px] bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
      <!-- Cabeçalho -->
      <div class="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-2.5 text-xs text-slate-500 gap-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-briefcase" class="size-3.5" />
          <span>{{ task.project || 'Nova Praça Central' }}</span>
          <span v-if="task.team">/</span>
          <span v-if="task.team" class="flex items-center gap-1">
            <UIcon name="i-heroicons-users" class="size-3.5" /> {{ task.team }}
          </span>
        </div>
        <div class="flex items-center gap-1 sm:gap-3">
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
          
          <div class="mb-8">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white inline-block">
              {{ task.title }}
            </h1>
          </div>

          <!-- Metadados principais -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 mb-8">
            <div class="flex items-center gap-4">
              <span class="text-sm text-slate-500 w-28 flex items-center gap-2"><UIcon name="i-heroicons-play-circle" class="size-4" /> Status</span>
              <UiStatusBadge :status="task.status" />
            </div>
            
            <div class="flex items-center gap-4">
              <span class="text-sm text-slate-500 w-28 flex items-center gap-2"><UIcon name="i-heroicons-users" class="size-4" /> Responsável</span>
              <div class="flex items-center gap-1.5">
                <UAvatar :src="task.assignees?.[0]?.avatar || 'https://i.pravatar.cc/80?img=47'" :alt="task.assignees?.[0]?.name || 'Costa Neves'" size="xs" />
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">{{ task.assignees?.[0]?.name || 'Costa Neves' }}</span>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <span class="text-sm text-slate-500 w-28 flex items-center gap-2"><UIcon name="i-heroicons-flag" class="size-4" /> Prioridade</span>
              <UiPriorityBadge :priority="task.priority || 'baixa'" />
            </div>
            
            <div class="flex items-center gap-4">
              <span class="text-sm text-slate-500 w-28 flex items-center gap-2"><UIcon name="i-heroicons-calendar-days" class="size-4" /> Prazo</span>
              <div class="text-sm font-medium flex items-center gap-1" :class="task.status === 'atrasado' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'">
                {{ task.dueDate || 'Sem prazo' }}
              </div>
            </div>
          </div>

          <!-- Ações de Status -->
          <div class="mb-8 flex flex-wrap gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
            <UButton size="sm" class="bg-emerald-500 hover:bg-emerald-600" icon="i-heroicons-check-circle" @click="updateStatus('concluido')">Marcar concluída</UButton>
            <UButton size="sm" color="amber" variant="soft" icon="i-heroicons-clock" @click="updateStatus('em-andamento')">Em andamento</UButton>
            <UButton size="sm" color="neutral" variant="outline" icon="i-heroicons-pause" @click="updateStatus('pausado')">Pausar tarefa</UButton>
          </div>

          <UDivider class="my-8" />

          <!-- Descrição -->
          <div class="mb-10">
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              Descrição
            </h3>
            <div class="rounded-lg p-3 bg-slate-50 dark:bg-slate-800/50 min-h-[60px]">
              <div v-if="task.description" class="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                {{ task.description }}
              </div>
              <div v-else class="text-slate-400 text-sm italic">
                Sem descrição cadastrada.
              </div>
            </div>
          </div>

          <!-- Subtarefas -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-heroicons-clipboard-document-check" class="size-4 text-slate-500" />
              <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Subtarefas <span class="text-slate-400 font-normal ml-1">({{ task.subtasks?.length || 0 }})</span>
              </h3>
            </div>
            
            <UiProgressBar v-if="task.subtasks?.length" :value="progress" color="bg-emerald-500" class="mb-4 h-1.5" />

            <div class="space-y-2">
              <div 
                v-for="subtask in task.subtasks" 
                :key="subtask.id"
                class="flex items-center gap-3 px-3 py-2.5 bg-slate-50/70 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800"
              >
                <input 
                  type="checkbox" 
                  :checked="subtask.completed"
                  class="size-4 rounded accent-orange-500 cursor-pointer"
                  @change="onToggleSubtask(subtask.id)"
                />
                <span 
                  class="text-sm flex-1 truncate" 
                  :class="subtask.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'"
                >
                  {{ subtask.title }}
                </span>
                <span class="text-xs px-2 py-0.5 rounded font-semibold" :class="subtask.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'">
                  {{ subtask.completed ? 'Concluída' : 'Pendente' }}
                </span>
              </div>

              <div v-if="!task.subtasks || task.subtasks.length === 0" class="py-6 text-center text-sm text-slate-400">
                Nenhuma subtarefa vinculada a esta tarefa.
              </div>
            </div>
          </div>
        </div>

        <!-- Direito (Linha do tempo de Auditoria e Comentários) -->
        <div class="w-full lg:w-[360px] xl:w-[420px] bg-slate-50/50 dark:bg-slate-900/30 flex flex-col border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
          <div class="p-4 sm:p-6 flex-1 overflow-y-auto scroll-thin">
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="size-4 text-orange-500" /> Histórico de Auditoria & Comentários
            </h3>
            
            <div v-if="!displayedAuditLog.length" class="text-center py-8">
              <p class="text-sm text-slate-500">Nenhum evento registrado ainda.</p>
            </div>
            
            <div v-else class="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-slate-200 dark:before:bg-slate-700">
              <div v-for="entry in displayedAuditLog" :key="entry.id" class="flex gap-3 relative">
                <div class="size-6 rounded-full flex items-center justify-center shrink-0 z-10 bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300">
                  <UIcon name="i-heroicons-clock" class="size-3.5" />
                </div>
                <div class="min-w-0 flex-1 pt-0.5">
                  <p class="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {{ entry.user }}
                  </p>
                  <p class="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm mt-1">
                    {{ entry.message }}
                  </p>
                  <p class="text-[10px] text-slate-400 mt-1">{{ entry.timestamp }}</p>
                </div>
              </div>
            </div>
            
            <div v-if="task.auditLog && task.auditLog.length > 5" class="mt-6 text-center border-t border-slate-200 dark:border-slate-700/50 pt-4">
              <button 
                class="text-xs font-medium text-orange-500 hover:underline"
                @click="showAllAudit = !showAllAudit"
              >
                {{ showAllAudit ? 'Ver menos' : 'Ver mais histórico' }}
              </button>
            </div>
          </div>
          
          <!-- Formulário de Comentários -->
          <div class="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-auto">
            <div class="relative flex gap-2">
              <input 
                v-model="newComment"
                type="text" 
                placeholder="Adicionar comentário ao histórico..." 
                class="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                @keyup.enter="addComment"
              />
              <button class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors" @click="addComment">
                <UIcon name="i-heroicons-paper-airplane" class="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
