<script setup lang="ts">
defineProps<{
  /** widget exibido no rodapé da sidebar, definido pela meta da rota */
  widget?: 'project' | 'goal' | 'none'
}>()

const emit = defineEmits<{ navigate: [] }>()

const route = useRoute()
const { homePath, items: nav } = useAppNavigation()

const navLinkClass =
  'group flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-orange-50/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
const navLinkActiveClass =
  '!bg-orange-50 !text-orange-600 dark:!bg-orange-500/10 dark:!text-orange-400'

function isNavActive(to: string) {
  return route.path === to
}
</script>

<template>
  <div class="flex h-full flex-col bg-white dark:bg-slate-900">
    <!-- Marca -->
    <div class="flex h-16 items-center border-b border-slate-100 px-5 dark:border-slate-800">
      <NuxtLink :to="homePath" aria-label="CiViTas — início" @click="emit('navigate')">
        <AppLogo />
      </NuxtLink>
    </div>

    <!-- Navegação -->
    <nav class="space-y-1 px-3 py-3" aria-label="Navegação principal">
      <p class="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Workspace</p>
      <NuxtLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        :class="[navLinkClass, isNavActive(item.to) && navLinkActiveClass]"
        @click="emit('navigate')"
      >
        <UIcon :name="item.icon" class="size-4 shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Rodapé contextual -->
    <div v-if="widget && widget !== 'none'" class="min-h-0 flex-1 border-t border-slate-100 px-3 py-4 dark:border-slate-800">
      <AppProjectCard v-if="widget === 'project'" />
      <AppGoalCard v-else-if="widget === 'goal'" />
    </div>
  </div>
</template>
