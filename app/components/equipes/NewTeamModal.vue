<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createTeamInSupabase } from '~/composables/useTeamsData'
import { fetchUserProjectsFromSupabase, useGestorProjectsRef } from '~/composables/useUserProjects'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ created: [] }>()

const name = ref('')
const selectedProject = ref<string>('')
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

// Projetos do gestor logado (alocados a ele pelo admin)
const gestorProjects = useGestorProjectsRef()

onMounted(async () => {
  await fetchUserProjectsFromSupabase()
})

function closeModal() {
  open.value = false
  name.value = ''
  selectedProject.value = ''
  errorMessage.value = null
}

async function handleCreateTeam() {
  if (isSubmitting.value) return
  if (!name.value.trim()) {
    errorMessage.value = 'O nome da equipe é obrigatório.'
    return
  }
  if (!selectedProject.value) {
    errorMessage.value = 'Selecione o Projeto ao qual a equipe pertence.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  const auth = useAuth()
  const gestorMatricula = Number(auth.user.value?.matricula || 0)

  const success = await createTeamInSupabase({
    nome: name.value.trim(),
    matricula_gestor: gestorMatricula,
    ID_projeto: Number(selectedProject.value),
  })

  isSubmitting.value = false

  if (success) {
    emit('created')
    closeModal()
  } else {
    errorMessage.value = 'Erro ao criar equipe. Tente novamente.'
  }
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'max-w-md' }">
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

        <!-- Nome da Equipe -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Nome da Equipe <span class="text-rose-500">*</span>
          </label>
          <UInput v-model="name" placeholder="Ex: Equipe de Infraestrutura" class="w-full" :disabled="isSubmitting" />
        </div>

        <!-- Projeto Vinculado — somente projetos alocados ao gestor -->
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Projeto Vinculado <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="selectedProject"
            class="w-full h-[38px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            :disabled="isSubmitting"
          >
            <option value="">Selecione um projeto...</option>
            <option v-for="p in gestorProjects" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
          <p v-if="gestorProjects.length === 0" class="mt-1 text-xs text-amber-500">
            Nenhum projeto foi alocado a você ainda. Peça ao administrador para te adicionar a um projeto.
          </p>
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
