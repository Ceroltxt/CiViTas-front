<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirmed: [] }>()

const props = defineProps<{
  projectName?: string
  isLoading?: boolean
}>()
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'max-w-md' }">
    <template #header>
      <div class="flex items-center gap-3">
        <span class="grid size-10 place-items-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/10">
          <UIcon name="i-heroicons-trash" class="size-5" />
        </span>
        <div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Excluir Projeto</h3>
          <p class="text-sm text-slate-500">Esta ação não pode ser desfeita.</p>
        </div>
      </div>
    </template>

    <template #body>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Tem certeza que deseja excluir o projeto
        <strong class="text-slate-800 dark:text-slate-200">"{{ projectName }}"</strong>?
        Todas as equipes e tarefas vinculadas serão removidas permanentemente.
      </p>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="outline" label="Cancelar" @click="open = false" />
        <UButton
          color="error"
          label="Excluir Projeto"
          :loading="isLoading"
          class="bg-red-600 hover:bg-red-700 text-white"
          @click="emit('confirmed')"
        />
      </div>
    </template>
  </UModal>
</template>
