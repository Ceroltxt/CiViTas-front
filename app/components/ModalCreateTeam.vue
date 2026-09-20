<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { createTeamInSupabase, fetchGestoresFromSupabase, fetchColaboradoresFromSupabase } from '~/composables/useTeamsData'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ created: [] }>()

const props = defineProps<{
  projectId?: string
}>()

const state = reactive({
  nome: '',
  descricao: '',
  prazo: '',
  matricula_gestor: '' as string,
  membros: [] as string[],
})

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const toast = useToast()

const gestoresOptions = ref<{ id: string; name: string; role: string }[]>([])
const colaboradoresOptions = ref<{ id: string; name: string; role: string }[]>([])

async function loadUsers() {
  const [gestores, colaboradores] = await Promise.all([
    fetchGestoresFromSupabase(),
    fetchColaboradoresFromSupabase()
  ])
  gestoresOptions.value = gestores.map(g => ({
    id: String(g.id),
    name: g.name,
    role: g.role || 'Gestor',
  }))
  colaboradoresOptions.value = colaboradores.map(c => ({
    id: String(c.id),
    name: c.name,
    role: c.role || 'Colaborador',
  }))
}

onMounted(() => {
  loadUsers()
})

function closeModal() {
  open.value = false
  state.nome = ''
  state.descricao = ''
  state.prazo = ''
  state.matricula_gestor = ''
  state.membros = []
  errorMessage.value = null
}

async function handleSubmit() {
  if (isLoading.value) return
  if (!state.nome.trim()) {
    errorMessage.value = 'O nome da equipe é obrigatório.'
    return
  }
  if (!state.matricula_gestor) {
    errorMessage.value = 'Selecione um gestor para a equipe.'
    return
  }

  isLoading.value = true
  errorMessage.value = null

  const payload = {
    nome: state.nome.trim(),
    descricao: state.descricao.trim() || undefined,
    prazo: state.prazo || undefined,
    matricula_gestor: Number(state.matricula_gestor),
    ID_projeto: props.projectId ? Number(props.projectId) : null,
    membros: state.membros.map(Number),
  }

  const success = await createTeamInSupabase(payload)
  isLoading.value = false

  if (success) {
    toast.add({
      title: 'Equipe criada!',
      description: `A equipe "${state.nome}" foi criada com sucesso.`,
      color: 'success',
      icon: 'i-heroicons-user-group'
    })
    emit('created')
    closeModal()
  } else {
    errorMessage.value = 'Erro ao criar equipe. Verifique os dados e tente novamente.'
  }
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'max-w-2xl' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
            <UIcon name="i-heroicons-user-plus" class="size-6" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Criar Equipe</h2>
            <p class="text-xs text-slate-500">Adicione uma nova equipe a este projeto.</p>
          </div>
        </div>
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

        <!-- Nome da Equipe -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Nome da Equipe <span class="text-rose-500">*</span>
          </label>
          <UInput v-model="state.nome" placeholder="Ex: Engenharia Civil" class="w-full" :disabled="isLoading" />
        </div>

        <!-- Descrição -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Descrição
          </label>
          <UTextarea v-model="state.descricao" :rows="3" placeholder="Descreva o propósito desta equipe..." class="w-full" :disabled="isLoading" />
        </div>

        <!-- Gestor + Prazo -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Gestor da Equipe <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="state.matricula_gestor"
              class="w-full h-[38px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              :disabled="isLoading"
            >
              <option value="">Selecione um gestor</option>
              <option v-for="g in gestoresOptions" :key="g.id" :value="g.id">
                {{ g.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Prazo (opcional)
            </label>
            <UInput type="date" v-model="state.prazo" class="w-full" :disabled="isLoading" />
          </div>
        </div>

        <!-- Membros (Colaboradores) -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Membros (Colaboradores)
          </label>
          <div class="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
            <template v-if="colaboradoresOptions.length">
              <label
                v-for="c in colaboradoresOptions"
                :key="c.id"
                class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="c.id"
                  v-model="state.membros"
                  class="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span class="text-slate-700 dark:text-slate-200">{{ c.name }}</span>
                <span class="text-xs text-slate-400">{{ c.role }}</span>
              </label>
            </template>
            <p v-else class="text-center text-sm text-slate-400 py-2">Nenhum colaborador disponível.</p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="outline" label="Cancelar" @click="closeModal" />
        <UButton
          color="primary"
          variant="solid"
          label="Criar Equipe"
          :class="isLoading && 'opacity-50 pointer-events-none cursor-not-allowed'"
          :loading="isLoading"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
