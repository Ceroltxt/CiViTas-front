<script setup lang="ts">
const isOpen = defineModel<boolean>('modelValue', { default: false })

const state = reactive({
  name: '',
  description: '',
  status: 'planejamento',
  priority: 'Media',
  deadline: '',
  color: 'bg-blue-500'
})

const statusOptions = [
  { label: 'Planejamento', value: 'planejamento' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Pausado', value: 'pausado' }
]

const priorityOptions = ['Baixa', 'Média', 'Alta']

const colorOptions = [
  { label: 'Azul', value: 'bg-blue-500', class: 'bg-blue-500' },
  { label: 'Roxo', value: 'bg-violet-500', class: 'bg-violet-500' },
  { label: 'Laranja', value: 'bg-amber-400', class: 'bg-amber-400' },
  { label: 'Rosa', value: 'bg-pink-500', class: 'bg-pink-500' },
  { label: 'Ciano', value: 'bg-cyan-500', class: 'bg-cyan-500' },
  { label: 'Índigo', value: 'bg-indigo-500', class: 'bg-indigo-500' },
]

const toast = useToast()

function onSubmit() {
  isOpen.value = false
  toast.add({
    title: 'Projeto criado com sucesso!',
    description: `O projeto "${state.name}" foi inicializado.`,
    color: 'success',
    icon: 'i-heroicons-check-circle'
  })
  // Reset form
  state.name = ''
  state.description = ''
  state.status = 'planejamento'
  state.priority = 'Média'
  state.deadline = ''
  state.color = 'bg-blue-500'
}
</script>

<template>
  <UModal v-model="isOpen" :ui="{ width: 'w-full sm:max-w-2xl' }">
    <template #content>
    <UForm :state="state" @submit="onSubmit" class="flex flex-col h-full">
      <div class="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
            <UIcon name="i-heroicons-folder-plus" class="size-6" />
          </div>
          <div>
            <h2 class="font-semibold text-slate-800 dark:text-slate-100">Criar Novo Projeto</h2>
            <p class="text-xs text-slate-500">Preencha as informações principais do novo projeto.</p>
          </div>
        </div>
        <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="isOpen = false" />
      </div>

      <div class="p-5 grid gap-5 sm:grid-cols-2">
        <UFormField label="Nome do Projeto" required class="sm:col-span-2">
          <UInput v-model="state.name" placeholder="Ex: Reforma da Praça Central" class="w-full" autofocus />
        </UFormField>

        <UFormField label="Descrição" class="sm:col-span-2">
          <UTextarea v-model="state.description" placeholder="Descreva brevemente o objetivo deste projeto..." :rows="3" class="w-full" />
        </UFormField>

        <UFormField label="Status Inicial">
          <USelect v-model="state.status" :options="statusOptions" option-attribute="label" class="w-full" />
        </UFormField>

        <UFormField label="Prioridade">
          <USelect v-model="state.priority" :options="priorityOptions" class="w-full" />
        </UFormField>

        <UFormField label="Prazo Previsto (Deadline)">
          <UInput v-model="state.deadline" type="date" class="w-full" />
        </UFormField>

        <UFormField label="Cor de Identificação">
          <div class="flex items-center gap-3 h-8">
            <button
              v-for="color in colorOptions"
              :key="color.value"
              type="button"
              class="relative size-6 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              :class="[color.class, state.color === color.value ? 'ring-2 ring-slate-400 ring-offset-2 dark:ring-slate-500 scale-110' : 'opacity-70']"
              :title="color.label"
              @click="state.color = color.value"
            >
              <UIcon v-if="state.color === color.value" name="i-heroicons-check" class="absolute inset-0 m-auto size-3.5 text-white" />
            </button>
          </div>
        </UFormField>
      </div>

      <div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50 rounded-b-lg">
        <UButton type="button" color="neutral" variant="ghost" label="Cancelar" @click="isOpen = false" />
        <UButton type="submit" color="primary" label="Criar Projeto" :disabled="!state.name" />
      </div>
    </UForm>
    </template>
  </UModal>
</template>

