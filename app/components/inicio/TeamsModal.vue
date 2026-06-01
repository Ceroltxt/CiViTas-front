<script setup lang="ts">
import type { TeamDetail } from '~/types'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{ teams: TeamDetail[] }>()

const selectedId = ref(props.teams[0]?.id ?? '')

const selected = computed(() => props.teams.find((t) => t.id === selectedId.value) ?? props.teams[0])
</script>

<template>
  <UModal
    v-model:open="open"
    title="Minhas Equipes"
    description="Veja as equipes que você pertence."
    :ui="{ content: 'max-w-4xl', body: 'p-0 sm:p-0' }"
  >
    <template #body>
      <div class="flex flex-col md:h-[min(560px,75vh)] md:flex-row">
        <!-- Sidebar -->
        <aside class="w-full shrink-0 border-b border-slate-100 md:w-72 md:border-b-0 md:border-r dark:border-slate-800">
          <ul class="max-h-64 overflow-y-auto scroll-thin p-3 md:flex md:max-h-none md:flex-col md:overflow-y-auto md:p-4">
            <li v-for="team in teams" :key="team.id">
              <button
                type="button"
                class="mb-2 flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors"
                :class="
                  selectedId === team.id
                    ? 'border-violet-200 border-l-4 border-l-violet-600 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30'
                    : 'border-slate-100 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50'
                "
                @click="selectedId = team.id"
              >
                <span
                  class="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  :class="team.color"
                >
                  {{ team.initial }}
                </span>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ team.name }}</p>
                  <p class="text-xs text-slate-400">
                    {{ team.collaboratorCount }} Colaborador{{ team.collaboratorCount !== 1 ? 'es' : '' }}
                    · {{ team.taskCount }} Tarefas
                  </p>
                </div>
                <UIcon name="i-heroicons-chevron-right" class="size-4 shrink-0 text-slate-300" />
              </button>
            </li>
          </ul>
        </aside>

        <!-- Detalhe -->
        <div v-if="selected" class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div class="min-h-0 flex-1 overflow-y-auto scroll-thin p-5 md:p-6">
            <!-- Cabeçalho da equipe -->
            <div class="mb-6 flex items-start gap-4">
              <span
                class="flex size-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
                :class="selected.color"
              >
                {{ selected.initial }}
              </span>
              <div>
                <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ selected.name }}</h3>
                <div class="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span class="inline-flex items-center gap-1">
                    <UIcon name="i-heroicons-user-group" class="size-4" />
                    {{ selected.collaboratorCount }} Colaborador{{ selected.collaboratorCount !== 1 ? 'es' : '' }}
                  </span>
                  <span class="text-slate-300">|</span>
                  <span class="inline-flex items-center gap-1">
                    <UIcon name="i-heroicons-clipboard-document-check" class="size-4" />
                    {{ selected.taskCount }} Tarefas
                  </span>
                </div>
                <p class="mt-2 text-sm text-slate-400">{{ selected.longDescription }}</p>
              </div>
            </div>

            <!-- Projeto da equipe -->
            <section class="mb-6">
              <h4 class="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Projeto da Equipe</h4>
              <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div class="flex items-start gap-3">
                  <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
                    <UIcon name="i-heroicons-briefcase" class="size-5 text-violet-600" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="font-bold text-slate-800 dark:text-slate-100">{{ selected.project.name }}</p>
                      <span class="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-600 dark:bg-violet-900/40">
                        {{ selected.project.status }}
                      </span>
                    </div>
                    <p class="text-sm text-violet-600 dark:text-violet-400">{{ selected.project.description }}</p>
                    <div class="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p class="text-xs text-slate-400">Início</p>
                        <p class="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200">
                          <UIcon name="i-heroicons-calendar-days" class="size-4 text-slate-400" />
                          {{ selected.project.startDate }}
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-slate-400">Prazo Final</p>
                        <p class="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200">
                          <UIcon name="i-heroicons-calendar-days" class="size-4 text-slate-400" />
                          {{ selected.project.endDate }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Tarefas recentes -->
            <section>
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100">Tarefas Recentes</h4>
                <button type="button" class="text-sm font-semibold text-violet-600 hover:text-violet-700">
                  Ver todas
                </button>
              </div>
              <ul class="min-h-[220px] divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
                <li
                  v-for="task in selected.recentTasks"
                  :key="task.id"
                  class="flex items-center gap-3 px-4 py-3"
                >
                  <span
                    class="size-2.5 shrink-0 rounded-full"
                    :class="useStatusMeta(task.status).dot"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{{ task.title }}</p>
                    <p class="text-xs text-slate-400">{{ task.createdBy }} · {{ task.createdAt }}</p>
                  </div>
                  <span
                    class="hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex"
                    :class="useStatusMeta(task.status).classes"
                  >
                    {{ useStatusMeta(task.status).label }}
                  </span>
                  <span class="inline-flex shrink-0 items-center gap-1 text-xs text-slate-400">
                    <UIcon name="i-heroicons-calendar-days" class="size-3.5" />
                    {{ task.dueDate }}
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
