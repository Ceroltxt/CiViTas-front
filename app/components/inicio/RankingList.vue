<script setup lang="ts">
import type { RankingEntry } from '~/types'

const props = defineProps<{ entries: RankingEntry[]; me?: RankingEntry }>()

const medal: Record<number, string> = {
  1: 'text-amber-400',
  2: 'text-slate-400',
  3: 'text-orange-400',
}

const topEntries = computed(() => props.entries.slice(0, 5))

function formatStars(value: number) {
  return `${value.toLocaleString('pt-BR')} estrelas`
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <ul class="shrink-0 space-y-4">
      <li
        v-for="entry in topEntries"
        :key="entry.user.id"
        class="flex items-center gap-3"
      >
        <span class="w-5 shrink-0 text-center text-sm font-semibold text-slate-500">
          <UIcon
            v-if="entry.position <= 3"
            name="i-heroicons-trophy-solid"
            class="size-4"
            :class="medal[entry.position]"
          />
          <template v-else>{{ entry.position }}º</template>
        </span>
        <UAvatar :src="entry.user.avatar" :alt="entry.user.name" size="sm" />
        <span class="flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
          {{ entry.user.name }}
        </span>
        <div class="flex items-center gap-1 text-orange-500 font-semibold text-sm">
          <UIcon name="i-heroicons-star-solid" class="size-4" />
          <span>{{ entry.stars }}</span>
        </div>
      </li>
    </ul>

    <!-- Posição do próprio usuário — fixada na base do card -->
    <div
      v-if="me"
      class="mt-auto shrink-0 flex items-center gap-2.5 rounded-xl border border-violet-200 bg-violet-50/70 px-2.5 py-3.5 dark:border-violet-900/50 dark:bg-violet-950/30"
    >
      <span class="w-5 shrink-0 text-center text-sm font-semibold text-violet-600 dark:text-violet-300">
        {{ me.position }}º
      </span>
      <UAvatar :src="me.user.avatar" :alt="me.user.name" size="sm" />
      <span class="flex-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
        {{ me.user.name }}
      </span>
      <div class="shrink-0 flex items-center gap-1 text-orange-500 font-semibold text-sm">
        <UIcon name="i-heroicons-star-solid" class="size-4" />
        <span>{{ me.stars }}</span>
      </div>
    </div>
  </div>
</template>
