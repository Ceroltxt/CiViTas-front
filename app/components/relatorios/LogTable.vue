<script setup lang="ts">
import type { AuditLog } from '~/types'

defineProps<{ logs: AuditLog[] }>()
defineEmits<{ export: [log: AuditLog] }>()

const columns = ['Data', 'Usuário', 'Ação', 'Detalhes', 'Linguagem']
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
          <th v-for="col in columns" :key="col" class="px-5 py-3">{{ col }}</th>
          <th class="px-5 py-3 text-right">
            <span class="sr-only">Ações</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(log, index) in logs"
          :key="log.id"
          class="border-t border-slate-100 dark:border-slate-800"
          :class="index % 2 === 1 ? 'bg-slate-50/70 dark:bg-slate-800/40' : ''"
        >
          <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ log.date }}</td>
          <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ log.user }}</td>
          <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ log.action }}</td>
          <td class="px-5 py-4 text-slate-600 dark:text-slate-300">{{ log.details }}</td>
          <td class="px-5 py-4 text-slate-400">{{ log.language }}</td>
          <td class="px-5 py-4 text-right">
            <button
              type="button"
              class="text-sm font-medium text-slate-600 hover:text-violet-600 dark:text-slate-300"
              @click="$emit('export', log)"
            >
              Exportar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
