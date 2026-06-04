<script setup lang="ts">
import type { UserSummary } from '~/types'

withDefaults(
  defineProps<{ users: UserSummary[]; max?: number; size?: string }>(),
  { max: 3, size: 'xs' },
)
</script>

<template>
  <UAvatarGroup :max="max" :size="size as any">
    <UAvatar
      v-for="u in users"
      :key="u.id"
      :src="u.avatar"
      :alt="u.name"
    />
  </UAvatarGroup>
</template>
