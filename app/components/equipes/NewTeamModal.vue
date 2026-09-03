<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createTeamInSupabase, fetchGestoresFromSupabase } from '~/composables/useTeamsData'
import { useDashboardApi } from '~/composables/useDashboardApi'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ created: [] }>()

const name = ref('')
const selectedGestor = ref<string>('')
const selectedProject = ref<string>('')
const gestoresOptions = ref<{ id: string; name: string }[]>([])
const projectsOptions = ref<{ id: string; name: string }[]>([])
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

async function loadOptions() {
  const [g, p] = await Promise.all([
    fetchGestoresFromSupabase(),
    useDashboardApi().fetchProjects(),
  ])
  gestoresOptions.value = g.map(item => ({ id: String(item.id), name: item.name }))
  projectsOptions.value = p.map(item => ({ id: String(item.id), name: item.name }))

  if (gestoresOptions.value.length > 0 && !selectedGestor.value) {
    selectedGestor.value = gestoresOptions.value[0].id
  }
}

onMounted(() => {
  loadOptions()
})

function closeModal() {
  open.value = false
  name.value = ''
  errorMessage.value = null
}

async function handleCreateTeam() {
  if (isSubmitting.value) return
  if (!name.value.trim()) {
    errorMessage.value = 'O nome da equipe é obrigatório.'
    return
  }
  if (!selectedGestor.value) {
    errorMessage.value = 'Selecione o Gestor Responsável pela equipe.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  const success = await createTeamInSupabase({
    nome: name.value.trim(),
    matricula_gestor: Number(selectedGestor.value),
    ID_projeto: selectedProject.value ? Number(selectedProject.value) : null,
  })

  isSubmitting.value = false

  if (success) {
    emit('created')
    closeModal()
  } else {
    errorMessage.value = 'Erro ao criar equipe no Supabase.'
  }
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'max-w-lg' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">
          Criar Nova Equipe
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
            Nome da Equipe <span class="text-rose-500">*</span>
          </label>
          <UInput v-model="name" placeholder="Ex: Equipe de Infraestrutura" class="w-full" :disabled="isSubmitting" />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Gestor Responsável <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="selectedGestor"
            class="w-full h-[38px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            :disabled="isSubmitting"
          >
            <option v-for="g in gestoresOptions" :key="g.id" :value="g.id">
              {{ g.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Projeto Vinculado (Opcional)
          </label>
          <select
            v-model="selectedProject"
            class="w-full h-[38px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            :disabled="isSubmitting"
          >
            <option value="">Nenhum (Projeto Geral)</option>
            <option v-for="p in projectsOptions" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
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
          class="bg-violet-600 hover:bg-violet-700 text-white"
          :class="isSubmitting && 'opacity-50 pointer-events-none cursor-not-allowed'"
          :loading="isSubmitting"
          @click="handleCreateTeam"
        />
      </div>
    </template>
  </UModal>
</template>
