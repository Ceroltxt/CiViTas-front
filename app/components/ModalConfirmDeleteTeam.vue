<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirm: [] }>()

defineProps<{
  teamName: string
  isDeleting: boolean
}>()

function closeModal() {
  if (isDeleting) return
  open.value = false
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'max-w-md' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <UIcon name="i-heroicons-exclamation-triangle" class="size-6" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Excluir Equipe</h2>
            <p class="text-xs text-slate-500">Esta ação é irreversível.</p>
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
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Você tem certeza que deseja excluir permanentemente a equipe <strong>{{ teamName }}</strong>?
        </p>
        <p class="text-sm text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-500/10 p-3 rounded-lg border border-rose-200 dark:border-rose-500/30">
          Atenção: todas as tarefas exclusivas desta equipe também serão apagadas e os membros perderão acesso.
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          label="Cancelar"
          :disabled="isDeleting"
          @click="closeModal"
        />
        <UButton
          color="error"
          variant="solid"
          label="Excluir Equipe"
          :loading="isDeleting"
          @click="handleConfirm"
        />
      </div>
    </template>
  </UModal>
</template>
