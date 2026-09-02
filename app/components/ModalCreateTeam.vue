<script setup lang="ts">
const isOpen = defineModel<boolean>('modelValue', { default: false })

const state = reactive({
  name: '',
  role: 'Membro',
  initial: '',
  color: 'bg-violet-500'
})

const roleOptions = ['Membro', 'Líder', 'Fiscal', 'Observador']

const colorOptions = [
  { label: 'Azul', value: 'bg-blue-500', class: 'bg-blue-500' },
  { label: 'Roxo', value: 'bg-violet-500', class: 'bg-violet-500' },
  { label: 'Laranja', value: 'bg-orange-500', class: 'bg-orange-500' },
  { label: 'Rosa', value: 'bg-pink-500', class: 'bg-pink-500' },
  { label: 'Esmeralda', value: 'bg-emerald-500', class: 'bg-emerald-500' },
]

const toast = useToast()

// Auto-fill initial based on name
watch(() => state.name, (newVal) => {
  if (newVal) {
    const parts = newVal.trim().split(' ')
    if (parts.length >= 2) {
      state.initial = (parts[0][0] + parts[1][0]).toUpperCase()
    } else {
      state.initial = newVal.substring(0, 2).toUpperCase()
    }
  } else {
    state.initial = ''
  }
})

function onSubmit() {
  isOpen.value = false
  toast.add({
    title: 'Equipe adicionada!',
    description: `A equipe "${state.name}" foi adicionada ao projeto.`,
    color: 'success',
    icon: 'i-heroicons-user-group'
  })
  // Reset
  state.name = ''
  state.role = 'Membro'
  state.initial = ''
  state.color = 'bg-violet-500'
}
</script>

<template>
  <UModal v-model="isOpen" :ui="{ width: 'w-full sm:max-w-xl' }">
    <template #content>
    <UForm :state="state" @submit="onSubmit" class="flex flex-col h-full">
      <div class="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
            <UIcon name="i-heroicons-user-plus" class="size-6" />
          </div>
          <div>
            <h2 class="font-semibold text-slate-800 dark:text-slate-100">Criar Equipe</h2>
            <p class="text-xs text-slate-500">Adicione uma nova equipe a este projeto.</p>
          </div>
        </div>
        <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="isOpen = false" />
      </div>

      <div class="p-5 grid gap-5 sm:grid-cols-2">
        <UFormField label="Nome da Equipe" required class="sm:col-span-2">
          <UInput v-model="state.name" placeholder="Ex: Engenharia Civil" class="w-full" autofocus />
        </UFormField>

        <UFormField label="Sigla (Iniciais)">
          <UInput v-model="state.initial" placeholder="Ex: EC" class="w-full" maxlength="3" />
        </UFormField>

        <UFormField label="Papel no Projeto">
          <USelect v-model="state.role" :options="roleOptions" class="w-full" />
        </UFormField>

        <UFormField label="Cor de Destaque" class="sm:col-span-2">
          <div class="flex items-center gap-3 h-8">
            <button
              v-for="color in colorOptions"
              :key="color.value"
              type="button"
              class="relative size-7 rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              :class="[color.class, state.color === color.value ? 'ring-2 ring-slate-400 ring-offset-2 dark:ring-slate-500 scale-110' : 'opacity-70']"
              :title="color.label"
              @click="state.color = color.value"
            >
              <UIcon v-if="state.color === color.value" name="i-heroicons-check" class="absolute inset-0 m-auto size-4 text-white" />
            </button>
          </div>
        </UFormField>
      </div>

      <div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50 rounded-b-lg">
        <UButton type="button" color="neutral" variant="ghost" label="Cancelar" @click="isOpen = false" />
        <UButton type="submit" color="primary" label="Adicionar Equipe" :disabled="!state.name" />
      </div>
    </UForm>
    </template>
  </UModal>
</template>

