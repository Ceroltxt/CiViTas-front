<script setup lang="ts">
import type { NotificationItem } from '~/types'

defineProps<{ items: NotificationItem[] }>()
</script>

<template>
  <ul class="space-y-1">
    <li
      v-for="item in items"
      :key="item.id"
      class="flex gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
      :class="{ 'bg-indigo-50/60 dark:bg-indigo-950/30': item.unread }"
    >
      <span
        class="flex size-9 shrink-0 items-center justify-center rounded-lg"
        :class="item.iconColor"
      >
        <UIcon :name="item.icon" class="size-5" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.title }}</p>
        <p class="text-xs text-slate-500">{{ item.description }}</p>
        <p class="mt-0.5 text-xs text-slate-400">{{ item.time }}</p>
      </div>
      <span
        v-if="item.unread"
        class="mt-1 size-2 shrink-0 rounded-full bg-rose-500"
        aria-label="Não lida"
      />
    </li>
  </ul>
</template>
