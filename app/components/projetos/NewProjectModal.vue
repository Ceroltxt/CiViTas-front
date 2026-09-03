<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createProjectInSupabase } from '~/composables/useUserProjects'
import { fetchGestoresFromSupabase } from '~/composables/useTeamsData'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ created: [] }>()

const auth = useAuth()

const name = ref('')
const description = ref('')
const priority = ref<'alta' | 'media' | 'baixa'>('media')
const startDate = ref('')
const endDate = ref('')
const selectedGestor = ref<string>('')  // matrícula do gestor selecionado no dropdown
const gestoresOptions = ref<{ id: string; name: string; role: string }[]>([])
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

async function loadGestores() {
  const list = await fetchGestoresFromSupabase()
  // Excluir o próprio admin do dropdown (admin já tem todas as permissões)
  const adminId = String(auth.user.value?.matricula || '')
  gestoresOptions.value = list
    .filter(item => String(item.id) !== adminId)
    .map(item => ({
      id: String(item.id),
      name: item.name,
      role: item.role || 'Gestor',
    }))
}

onMounted(() => {
  loadGestores()
})

function closeModal() {
  open.value = false
  name.value = ''
  description.value = ''
  selectedGestor.value = ''
  errorMessage.value = null
}

async function handleCreateProject() {
  if (isSubmitting.value) return
  if (!name.value.trim()) {
    errorMessage.value = 'O nome do projeto é obrigatório.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  const gestores = selectedGestor.value ? [Number(selectedGestor.value)] : []

  const success = await createProjectInSupabase({
    nome: name.value.trim(),
    descricao: description.value.trim() || undefined,
    prioridade: priority.value,
    data_inicio: startDate.value || undefined,
    data_previsao_fim: endDate.value || undefined,
    gestores,
  })

  isSubmitting.value = false

  if (success) {
    emit('created')
    closeModal()
  } else {
    errorMessage.value = 'Erro ao criar projeto no Supabase. Tente novamente.'
  }
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'max-w-lg' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">
          Criar Novo Projeto Corporativo
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

        <!-- Nome -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Nome do Projeto <span class="text-rose-500">*</span>
          </label>
          <UInput v-model="name" placeholder="Ex: Revitalização do Parque Municipal" class="w-full" :disabled="isSubmitting" />
        </div>

        <!-- Descrição -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Descrição
          </label>
          <UTextarea v-model="description" :rows="3" placeholder="Descrição detalhada das metas do projeto..." class="w-full" :disabled="isSubmitting" />
        </div>

        <!-- Gestor Responsável (dropdown) -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Gestor Responsável
          </label>
          <select
            v-model="selectedGestor"
            class="w-full h-[38px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            :disabled="isSubmitting"
          >
            <option value="">Sem gestor (definir depois)</option>
            <option v-for="g in gestoresOptions" :key="g.id" :value="g.id">
              {{ g.name }}
              <template v-if="g.role"> — {{ g.role }}</template>
            </option>
          </select>
          <p class="mt-1 text-xs text-slate-400">
            O administrador não precisa ser listado como gestor — ele já tem acesso total.
          </p>
        </div>

        <!-- Prioridade + Datas -->
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Prioridade</label>
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
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Data Início</label>
            <UInput v-model="startDate" type="date" class="w-full" :disabled="isSubmitting" />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Previsão Término</label>
            <UInput v-model="endDate" type="date" class="w-full" :disabled="isSubmitting" />
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
          label="Criar Projeto"
          class="bg-violet-600 hover:bg-violet-700 text-white"
          :class="isSubmitting && 'opacity-50 pointer-events-none cursor-not-allowed'"
          :loading="isSubmitting"
          @click="handleCreateProject"
        />
      </div>
    </template>
  </UModal>
</template>
