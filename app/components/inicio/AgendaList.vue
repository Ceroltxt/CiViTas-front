<script setup lang="ts">
import type { AgendaItem } from '~/types'

const props = defineProps<{ items: AgendaItem[] }>()

function lineClass(index: number) {
  if (props.items.length <= 1) return 'hidden'
  // A linha se estende para dentro do padding vertical (-4) das linhas
  // vizinhas, ficando contínua de ponta a ponta (como no Figma).
  if (index === 0) return 'top-1/2 -bottom-4'
  if (index === props.items.length - 1) return '-top-4 bottom-1/2'
  return '-inset-y-4'
}
</script>

<template>
  <ul class="-mx-5 border-t border-slate-100 dark:border-slate-800">
    <li
      v-for="(item, index) in items"
      :key="item.id"
      class="grid grid-cols-[56px_28px_minmax(0,1fr)_auto_20px] items-center gap-x-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800"
    >
      <!-- Horário -->
      <span class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ item.time }}</span>

      <!-- Linha do tempo: trilha escura + marcador colorido -->
      <span class="relative flex h-full items-center justify-center self-stretch">
        <span
          class="absolute left-1/2 w-px -translate-x-1/2 bg-slate-600 dark:bg-slate-500"
          :class="lineClass(index)"
        />
        <span
          class="relative z-10 size-3 rounded-full"
          :class="item.dotColor"
        />
      </span>

      <!-- Título + descrição -->
      <div class="min-w-0">
        <p class="truncate text-[15px] font-bold text-slate-800 dark:text-slate-100">{{ item.title }}</p>
        <p class="truncate text-xs text-slate-400">{{ item.description }}</p>
      </div>

      <!-- Tag (alinhada à direita) -->
      <span
        class="justify-self-end rounded-full px-3.5 py-1.5 text-xs font-semibold"
        :class="item.tag.color"
      >
        {{ item.tag.label }}
      </span>

      <!-- Chevron -->
      <UIcon
        name="i-heroicons-chevron-right"
        class="size-5 justify-self-end text-slate-400"
      />
    </li>
  </ul>
</template>
