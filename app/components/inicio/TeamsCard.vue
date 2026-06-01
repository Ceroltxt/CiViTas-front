<script setup lang="ts">
import type { TeamSummary } from '~/types'

defineProps<{ teams: TeamSummary[] }>()
</script>

<template>
  <ul class="space-y-5">
    <li v-for="team in teams" :key="team.id" class="flex items-center gap-3">
      <span
        class="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
        :class="team.color"
      >
        {{ team.initial }}
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ team.name }}</p>
        <p class="truncate text-xs text-slate-400">{{ team.description }}</p>
      </div>
      <UiAvatarStack :users="team.members" :max="3" />
    </li>
  </ul>
</template>
