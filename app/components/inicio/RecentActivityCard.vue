<script setup lang="ts">
import type { TaskAuditEntry } from '~/types'

const props = defineProps<{ entries: TaskAuditEntry[] }>()

function activityStyle(entry: TaskAuditEntry) {
  const content = `${entry.icon} ${entry.message}`.toLowerCase()
  if (content.includes('check') || content.includes('conclu')) return { icon: 'i-heroicons-check', classes: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300' }
  if (content.includes('user') || content.includes('atribu')) return { icon: 'i-heroicons-user', classes: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300' }
  return { icon: entry.icon || 'i-heroicons-play', classes: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300' }
}
</script>

<template>
  <UiSectionCard class="w-full">
    <template #header>
      <div class="flex w-full items-center justify-between gap-3">
        <h2 class="font-semibold text-slate-800 dark:text-slate-100">Atividade recente</h2>
        <UButton to="/colaborador/relatorios" variant="link" trailing-icon="i-heroicons-arrow-right" label="Ver toda atividade" class="!p-0 text-sm font-semibold text-indigo-500" />
      </div>
    </template>
    <div v-if="entries.length" class="space-y-1.5">
      <div v-for="entry in entries" :key="entry.id" class="group flex items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 transition-colors hover:border-slate-100 hover:bg-slate-50/60 dark:hover:border-slate-700 dark:hover:bg-slate-800/40">
        <span class="flex size-7 shrink-0 items-center justify-center rounded-lg" :class="activityStyle(entry).classes">
          <UIcon :name="activityStyle(entry).icon" class="size-3.5" />
        </span>
        <p class="min-w-0 flex-1 truncate text-xs font-medium text-slate-600 dark:text-slate-300">{{ entry.message }}</p>
        <time class="shrink-0 rounded-md bg-white px-1.5 py-1 text-[10px] text-slate-400 shadow-sm dark:bg-slate-900">{{ entry.timestamp }}</time>
      </div>
    </div>
    <p v-else class="py-8 text-center text-sm text-slate-400">Nenhuma atividade recente.</p>
  </UiSectionCard>
</template>
