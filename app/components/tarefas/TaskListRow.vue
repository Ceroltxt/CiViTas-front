<script setup lang="ts">
import type { Task } from '~/types'

const props = defineProps<{
  task: Task
  /** Barra lateral colorida e fundo por status — só em Atribuídas e Pessoais */
  showAccent?: boolean
}>()

const showAccent = computed(() => props.showAccent !== false)

const isDone = computed(() => props.task.status === 'concluido')
const isLate = computed(() => props.task.status === 'atrasado')
const isPersonal = computed(() => props.task.personal === true)
const isNotStarted = computed(() => props.task.notStarted === true && !isDone.value && !isLate.value)
const done = computed({
  get: () => isDone.value,
  set: (val) => {
    props.task.status = val ? 'concluido' : 'em-andamento'
  }
})
const teamClass = computed(() => useTeamTagClass(props.task.team))

const projectProgress = computed(() =>
  useProjectProgressForTask(props.task.project, props.task.projectProgress),
)

const accentBarClass = computed(() => {
  if (isDone.value) return 'bg-emerald-200'
  if (isLate.value) return 'bg-rose-200'
  const soft: Record<string, string> = {
    critica: 'bg-red-200',
    alta: 'bg-pink-200',
    media: 'bg-amber-200',
    baixa: 'bg-emerald-200',
  }
  return soft[props.task.priority] ?? 'bg-slate-200'
})

const containerClass = computed(() => {
  if (!showAccent.value)
    return 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
  if (isDone.value)
    return 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
  if (isLate.value)
    return 'border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20'
  if (isNotStarted.value)
    return 'border-dashed border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-900/40'
  return 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
})

const rowMenu = [
  [
    { label: 'Editar', icon: 'i-heroicons-pencil-square' },
    { label: 'Duplicar', icon: 'i-heroicons-document-duplicate' },
  ],
  [{ label: 'Excluir', icon: 'i-heroicons-trash', color: 'error' as const }],
]

const lateNote = computed(() =>
  props.task.note?.replace(/^Atrasada\s+/i, '') ?? '',
)
</script>

<template>
  <div
    class="flex overflow-hidden rounded-xl border transition-colors"
    :class="containerClass"
  >
    <div
      v-if="showAccent"
      class="w-1 shrink-0"
      :class="accentBarClass"
      aria-hidden="true"
    />

    <div
      class="flex min-h-[3.25rem] min-w-0 flex-1 items-center gap-x-4 gap-y-2 px-4 py-3 md:gap-6"
      :class="isPersonal ? 'flex-nowrap' : 'flex-wrap md:flex-nowrap'"
    >
      <!-- Checkbox + tarefa (+ prazo em tarefas de projeto) -->
      <div
        class="flex min-w-0 items-center gap-3"
        :class="isPersonal ? 'min-w-0 flex-1' : 'min-w-0 flex-[1.6] md:shrink'"
      >
        <UCheckbox
          v-model="done"
          :aria-label="`Concluir ${task.title}`"
          :ui="{ base: 'rounded-full' }"
        />

        <div class="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
          <div
            class="flex min-w-0 items-center gap-2"
            :class="!isPersonal ? 'gap-3' : ''"
          >
            <p
              class="min-w-0 flex-1 truncate text-sm font-semibold"
              :title="task.title"
              :class="
                isDone
                  ? 'text-slate-500 dark:text-slate-400'
                  : isNotStarted
                    ? 'text-slate-500 dark:text-slate-400'
                    : 'text-slate-800 dark:text-slate-100'
              "
            >
              {{ task.title }}
            </p>

            <div v-if="!isPersonal" class="flex shrink-0 items-center gap-1.5">
              <span
                v-if="isDone"
                class="hidden rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 sm:inline-flex dark:bg-emerald-900/40 dark:text-emerald-300"
              >
                Concluída
              </span>
              <span
                v-else-if="isLate"
                class="hidden rounded-md bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700 sm:inline-flex dark:bg-rose-900/40 dark:text-rose-300"
              >
                Atrasada
              </span>
              <span
                v-else-if="isNotStarted"
                class="hidden rounded-md border border-dashed border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-400 sm:inline-flex dark:border-slate-600 dark:bg-slate-900"
              >
                A iniciar
              </span>
              <span
                v-if="isLate && lateNote"
                class="hidden text-xs whitespace-nowrap text-rose-500 md:inline"
              >
                · {{ lateNote }}
              </span>
            </div>

            <template v-else>
              <span
                v-if="isDone"
                class="hidden shrink-0 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 sm:inline-flex dark:bg-emerald-900/40 dark:text-emerald-300"
              >
                Concluída
              </span>
              <span
                v-else-if="isNotStarted"
                class="hidden shrink-0 rounded-md border border-dashed border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-400 sm:inline-flex dark:border-slate-600 dark:bg-slate-900"
              >
                A iniciar
              </span>
            </template>

            <div
              v-if="task.dueDate && !isPersonal"
              class="flex shrink-0 items-center gap-1 text-sm text-slate-400"
            >
              <UIcon name="i-heroicons-calendar-days" class="size-3.5 shrink-0" />
              <span class="whitespace-nowrap">{{ task.dueDate }}</span>
            </div>
          </div>
          <p v-if="isPersonal" class="text-xs text-slate-400 md:hidden">Tarefa pessoal</p>
          <p v-if="isLate && lateNote" class="text-xs text-rose-500 sm:hidden">· {{ lateNote }}</p>
        </div>
      </div>

      <!-- Projeto / Equipe -->
      <div v-if="!isPersonal" class="hidden min-w-0 shrink-0 md:block md:w-[18%]">
        <p class="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
          {{ task.project }}
        </p>
        <span v-if="task.team" class="mt-0.5 inline-block rounded px-1.5 py-0.5 text-xs font-medium" :class="teamClass">
          {{ task.team }}
        </span>
      </div>

    <!-- Progresso -->
    <div v-if="!isPersonal" class="hidden min-w-0 max-w-[11rem] flex-1 items-center gap-2 md:flex lg:max-w-xs">
      <span class="w-8 shrink-0 text-right text-sm font-medium text-slate-600 dark:text-slate-300">
        {{ projectProgress }}%
      </span>
      <UiProgressBar
        :value="projectProgress"
        :color="
          isDone
            ? 'bg-emerald-500'
            : isLate
              ? 'bg-rose-500'
              : isNotStarted
                ? 'bg-slate-200'
                : 'bg-violet-500'
        "
        class="min-w-0 flex-1"
      />
    </div>

    <!-- Colaboradores -->
    <div v-if="!isPersonal" class="hidden md:block">
      <UiAvatarStack :users="task.assignees" :max="3" />
    </div>

      <!-- Prazo + menu (tarefas pessoais — alinhados à direita) -->
      <div
        v-if="isPersonal"
        class="ml-auto flex shrink-0 items-center gap-4"
      >
        <div
          v-if="task.dueDate"
          class="flex items-center gap-1 text-sm text-slate-400"
        >
          <UIcon name="i-heroicons-calendar-days" class="size-3.5 shrink-0" />
          <span class="whitespace-nowrap">{{ task.dueDate }}</span>
        </div>
        <UDropdownMenu :items="rowMenu">
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-heroicons-ellipsis-vertical"
            class="!p-1"
            aria-label="Ações da tarefa"
          />
        </UDropdownMenu>
      </div>

      <!-- Menu (tarefas de projeto) -->
      <div v-else class="ml-auto flex w-8 shrink-0 justify-center md:ml-0">
        <UDropdownMenu :items="rowMenu">
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-heroicons-ellipsis-vertical"
            class="!p-1"
            aria-label="Ações da tarefa"
          />
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>
