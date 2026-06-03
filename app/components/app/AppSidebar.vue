<script setup lang="ts">
defineProps<{
  /** widget exibido no rodapé da sidebar, definido pela meta da rota */
  widget?: 'project' | 'goal' | 'none'
}>()

const emit = defineEmits<{ navigate: [] }>()

const route = useRoute()
const { homePath, items: nav } = useAppNavigation()

const navLinkClass =
  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
const navLinkActiveClass =
  '!bg-orange-50 !text-orange-600 dark:!bg-orange-500/10 dark:!text-orange-400'

function isNavActive(to: string) {
  return route.path === to
}
</script>

<template>
  <div class="flex h-full flex-col bg-white dark:bg-slate-900">
    <!-- Marca -->
    <div class="flex h-16 items-center px-5">
      <NuxtLink :to="homePath" aria-label="CiViTas — início" @click="emit('navigate')">
        <AppLogo />
      </NuxtLink>
    </div>

    <!-- Navegação -->
    <nav class="flex-1 space-y-1 px-3 py-2" aria-label="Navegação principal">
      <NuxtLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        :class="[navLinkClass, isNavActive(item.to) && navLinkActiveClass]"
        @click="emit('navigate')"
      >
        <UIcon :name="item.icon" class="size-5 shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Rodapé contextual -->
    <div v-if="widget && widget !== 'none'" class="p-3">
      <AppProjectCard v-if="widget === 'project'" />
      <AppGoalCard v-else-if="widget === 'goal'" />
    </div>
  </div>
</template>
