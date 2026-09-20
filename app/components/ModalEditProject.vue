<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import { updateProjectInSupabase } from '~/composables/useUserProjects'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ updated: [] }>()

const props = defineProps<{
  project: { id: string; name: string; description?: string; prioridade?: string } | null
}>()

const toast = useToast()
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const state = reactive({
  nome: '',
  descricao: '',
  prioridade: 'media',
})

watch(() => props.project, (p) => {
  if (p) {
    state.nome = p.name || ''
    state.descricao = p.description || ''
    state.prioridade = p.prioridade || 'media'
  }
}, { immediate: true })

async function handleSubmit() {
  if (!state.nome.trim()) {
    errorMessage.value = 'O nome do projeto é obrigatório.'
    return
  }
  if (!props.project) return

  isLoading.value = true
  errorMessage.value = null

  const success = await updateProjectInSupabase(props.project.id, {
    nome: state.nome.trim(),
    descricao: state.descricao.trim() || undefined,
    prioridade: state.prioridade,
  })

  isLoading.value = false

  if (success) {
    toast.add({
      title: 'Projeto atualizado!',
      description: `O projeto "${state.nome}" foi atualizado com sucesso.`,
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
    emit('updated')
    open.value = false
  } else {
    errorMessage.value = 'Erro ao atualizar o projeto. Tente novamente.'
  }
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'max-w-lg' }">
    <template #header>
      <div class="flex items-center gap-3">
        <span class="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10">
          <UIcon name="i-heroicons-pencil-square" class="size-5" />
        </span>
        <div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Editar Projeto</h3>
          <p class="text-sm text-slate-500">Atualize as informações do projeto.</p>
        </div>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <div v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {{ errorMessage }}
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Nome do Projeto <span class="text-red-500">*</span></label>
          <UInput v-model="state.nome" placeholder="Nome do projeto" />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Descrição</label>
          <UTextarea v-model="state.descricao" placeholder="Descrição do projeto" :rows="3" />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Prioridade</label>
          <select v-model="state.prioridade" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="outline" label="Cancelar" @click="open = false" />
        <UButton
          color="primary"
          label="Salvar Alterações"
          :loading="isLoading"
          class="bg-violet-600 hover:bg-violet-700 text-white"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
