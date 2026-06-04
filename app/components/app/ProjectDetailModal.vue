<script setup lang="ts">
import type { ProjectDetail } from '~/types'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{ project: ProjectDetail }>()

const chartWidth = 320
const chartHeight = 120
const chartPad = { top: 8, right: 8, bottom: 24, left: 32 }

function chartPoints(timeline: ProjectDetail['progressTimeline']) {
  const innerW = chartWidth - chartPad.left - chartPad.right
  const innerH = chartHeight - chartPad.top - chartPad.bottom
  const step = timeline.length > 1 ? innerW / (timeline.length - 1) : 0

  return timeline.map((p, i) => ({
    x: chartPad.left + i * step,
    y: chartPad.top + innerH - (p.value / 100) * innerH,
    label: p.month,
    value: p.value,
  }))
}

function linePath(points: ReturnType<typeof chartPoints>) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

const priorityMeta = computed(() => usePriorityMeta(props.project.priority))
</script>

<template>
  <UModal
    v-model:open="open"
    :title="project.name"
    :description="project.description"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #body>
      <div class="space-y-5">
        <!-- Métricas -->
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div class="mb-2 flex size-8 items-center justify-center rounded-full bg-violet-100">
              <UIcon name="i-heroicons-calendar-days" class="size-4 text-violet-600" />
            </div>
            <p class="text-xs text-slate-400">Prazo final</p>
            <p class="text-sm font-bold text-violet-700 dark:text-violet-400">{{ project.deadline }}</p>
            <p class="mt-0.5 text-xs text-slate-400">{{ project.daysRemaining }} dias restantes</p>
          </div>

          <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p class="text-xs text-slate-400">Progresso geral</p>
            <p class="text-lg font-bold text-violet-700 dark:text-violet-400">{{ project.progress }}%</p>
            <UiProgressBar :value="project.progress" class="mt-2" gradient />
          </div>

          <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div class="mb-2 flex size-8 items-center justify-center rounded-full bg-violet-100">
              <UIcon name="i-heroicons-clipboard-document-list" class="size-4 text-violet-600" />
            </div>
            <p class="text-xs text-slate-400">Total de tarefas</p>
            <p class="text-lg font-bold text-slate-800 dark:text-slate-100">{{ project.totalTasks }}</p>
            <p class="text-xs text-slate-400">tarefas</p>
          </div>

          <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div class="mb-2 flex size-8 items-center justify-center rounded-full bg-violet-100">
              <UIcon name="i-heroicons-flag" class="size-4 text-violet-600" />
            </div>
            <p class="text-xs text-slate-400">Prioridade</p>
            <span
              class="mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
              :class="priorityMeta.classes"
            >
              {{ priorityMeta.label }}
            </span>
          </div>
        </div>

        <!-- Status + gráfico -->
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 class="mb-4 text-sm font-bold text-slate-800 dark:text-slate-100">Status das tarefas</h3>
            <div class="grid grid-cols-3 gap-3 text-center">
              <div>
                <span class="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-emerald-100">
                  <UIcon name="i-heroicons-check" class="size-4 text-emerald-600" />
                </span>
                <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ project.taskStatus.completed }}</p>
                <div class="mx-auto mt-1 h-1 w-10 rounded-full bg-emerald-500" />
                <p class="mt-1 text-xs font-medium text-emerald-600">
                  {{ Math.round((project.taskStatus.completed / project.totalTasks) * 100) }}%
                </p>
                <p class="text-xs text-slate-400">Concluídas</p>
              </div>
              <div>
                <span class="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-amber-100">
                  <UIcon name="i-heroicons-clock" class="size-4 text-amber-600" />
                </span>
                <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ project.taskStatus.inProgress }}</p>
                <div class="mx-auto mt-1 h-1 w-10 rounded-full bg-amber-500" />
                <p class="mt-1 text-xs font-medium text-amber-600">
                  {{ Math.round((project.taskStatus.inProgress / project.totalTasks) * 100) }}%
                </p>
                <p class="text-xs text-slate-400">Em andamento</p>
              </div>
              <div>
                <span class="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-slate-100">
                  <UIcon name="i-heroicons-queue-list" class="size-4 text-slate-500" />
                </span>
                <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ project.taskStatus.pending }}</p>
                <div class="mx-auto mt-1 h-1 w-10 rounded-full bg-slate-300" />
                <p class="mt-1 text-xs font-medium text-slate-500">
                  {{ Math.round((project.taskStatus.pending / project.totalTasks) * 100) }}%
                </p>
                <p class="text-xs text-slate-400">Pendentes</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 class="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Progresso ao longo do tempo</h3>
            <svg :width="chartWidth" :height="chartHeight" class="w-full max-w-full">
              <text
                v-for="tick in [0, 25, 50, 75, 100]"
                :key="tick"
                :x="chartPad.left - 6"
                :y="chartPad.top + (chartHeight - chartPad.top - chartPad.bottom) * (1 - tick / 100) + 4"
                text-anchor="end"
                class="fill-slate-400 text-[10px]"
              >
                {{ tick }}%
              </text>
              <path
                :d="linePath(chartPoints(project.progressTimeline))"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-violet-500"
              />
              <circle
                v-for="(pt, i) in chartPoints(project.progressTimeline)"
                :key="i"
                :cx="pt.x"
                :cy="pt.y"
                r="3"
                class="fill-violet-500"
              />
              <text
                v-for="(pt, i) in chartPoints(project.progressTimeline)"
                :key="`l-${i}`"
                :x="pt.x"
                :y="chartHeight - 4"
                text-anchor="middle"
                class="fill-slate-400 text-[10px]"
              >
                {{ pt.label }}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
