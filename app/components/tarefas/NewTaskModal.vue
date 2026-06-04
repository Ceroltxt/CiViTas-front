<script setup lang="ts">
import type { PriorityKey } from '~/types'
import { brandGradient } from '~/utils/tw'

const open = defineModel<boolean>('open', { default: false })

const PERSONAL_PRIORITIES: PriorityKey[] = ['alta', 'media', 'baixa']

const projectItems = computed(() => [
  { label: 'Nenhum', value: '' },
  ...useUserProjects().map((p) => ({ label: p.name, value: p.name })),
])

const priorityOptions = usePriorityOptions(PERSONAL_PRIORITIES)
const priorityPills = computed(() =>
  PERSONAL_PRIORITIES.map((value) => ({ value, ...usePriorityMeta(value) })),
)

const title = ref('')
const description = ref('')
const project = ref('')
const priority = ref<PriorityKey>()
const startDate = ref('')
const deadline = ref('')
const tags = ref<string[]>([])
const tagInput = ref('')
const notifyUpdates = ref(true)
const allowComments = ref(true)
const privateTask = ref(false)

function addTag() {
  const value = tagInput.value.trim()
  if (value && !tags.value.includes(value)) {
    tags.value.push(value)
  }
  tagInput.value = ''
}

function onTagKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addTag()
  }
}

function removeTag(tag: string) {
  tags.value = tags.value.filter((t) => t !== tag)
}

function createTask() {
  // TODO: persistir tarefa via ~/services
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Nova Tarefa"
    :ui="{ content: 'max-w-2xl' }"
  >
    <template #body>
      <div class="mb-5 flex gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-900 dark:bg-violet-950/30">
        <UIcon name="i-heroicons-lock-closed" class="mt-0.5 size-5 shrink-0 text-violet-600" />
        <p class="text-sm text-violet-800 dark:text-violet-200">
          Esta tarefa pessoal ficará visível <strong>apenas para você</strong>. Nenhum membro da equipe ou gestor poderá visualizá-la.
        </p>
      </div>

      <section class="space-y-4">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">Informações Gerais</h3>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Título da Tarefa <span class="text-rose-500">*</span>
          </label>
          <UInput v-model="title" placeholder="Ex: Criar protótipo da dashboard" class="w-full" />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Descrição <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <UTextarea
              v-model="description"
              :rows="4"
              placeholder="Descreva o que precisa ser feito, objetivos e detalhes importantes..."
              class="w-full"
              :maxlength="1000"
            />
            <span class="absolute bottom-2 right-3 text-xs text-slate-400">
              {{ description.length }}/1000
            </span>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Projeto <span class="font-normal text-slate-400">(opcional)</span>
            </label>
            <USelect
              v-model="project"
              :items="projectItems"
              placeholder="Selecione o projeto"
              class="w-full"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Prioridade <span class="text-rose-500">*</span>
            </label>
            <USelect
              v-model="priority"
              :items="priorityOptions"
              placeholder="Selecione a prioridade"
              class="w-full"
            />
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="p in priorityPills"
                :key="p.value"
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="p.classes"
              >
                <span class="size-2 rounded-full" :class="p.dot" />
                {{ p.label }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Data de Início <span class="text-rose-500">*</span>
            </label>
            <UInput v-model="startDate" type="date" icon="i-heroicons-calendar-days" class="w-full" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Prazo Final <span class="text-rose-500">*</span>
            </label>
            <UInput v-model="deadline" type="date" icon="i-heroicons-calendar-days" class="w-full" />
          </div>
        </div>
      </section>

      <hr class="my-6 border-slate-100 dark:border-slate-800" />

      <section class="space-y-4">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">Detalhes Adicionais</h3>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Tags (Opcional)
          </label>
          <UInput
            v-model="tagInput"
            icon="i-heroicons-tag"
            placeholder="Digite para adicionar tags"
            class="w-full"
            @keydown="onTagKeydown"
          />
          <p class="mt-1 text-xs text-slate-400">Pressione Enter para adicionar</p>
          <div v-if="tags.length" class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="tag in tags"
              :key="tag"
              class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600"
            >
              {{ tag }}
              <button type="button" class="text-violet-400 hover:text-violet-700" @click="removeTag(tag)">
                <UIcon name="i-heroicons-x-mark" class="size-3" />
              </button>
            </span>
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Anexos (Opcional)
          </label>
          <div
            class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-4 py-8 text-center transition-colors hover:border-violet-300 hover:bg-violet-50/30 dark:border-slate-700"
          >
            <UIcon name="i-heroicons-paper-clip" class="mb-2 size-6 text-slate-400" />
            <p class="text-sm font-medium text-slate-600 dark:text-slate-300">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p class="mt-1 text-xs text-slate-400">Tamanho máximo: 10MB por arquivo</p>
          </div>
        </div>
      </section>

      <hr class="my-6 border-slate-100 dark:border-slate-800" />

      <section class="space-y-3">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">Notificações e Permissões</h3>

        <label class="flex cursor-pointer items-center gap-3 rounded-lg py-1">
          <UCheckbox v-model="notifyUpdates" color="primary" />
          <UIcon name="i-heroicons-bell" class="size-5 text-slate-400" />
          <span class="text-sm text-slate-700 dark:text-slate-200">Notificar responsável sobre atualizações</span>
        </label>

        <label class="flex cursor-pointer items-center gap-3 rounded-lg py-1">
          <UCheckbox v-model="allowComments" color="primary" />
          <UIcon name="i-heroicons-user-group" class="size-5 text-slate-400" />
          <span class="text-sm text-slate-700 dark:text-slate-200">Permitir comentários da equipe</span>
        </label>

        <label class="flex cursor-pointer items-center gap-3 rounded-lg py-1">
          <UCheckbox v-model="privateTask" color="primary" />
          <UIcon name="i-heroicons-lock-closed" class="size-5 text-slate-400" />
          <span class="text-sm text-slate-700 dark:text-slate-200">Tarefa visível apenas para responsáveis</span>
        </label>
      </section>
    </template>

    <template #footer="{ close }">
      <div class="flex w-full gap-3">
        <UButton
          color="neutral"
          variant="outline"
          block
          class="flex-1"
          label="Cancelar"
          @click="close"
        />
        <UButton
          block
          class="flex-1 font-bold text-white"
          :class="brandGradient"
          label="Criar Tarefa"
          @click="createTask"
        />
      </div>
    </template>
  </UModal>
</template>
