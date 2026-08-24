<script setup lang="ts">
const route = useRoute()
const mobileOpen = ref(false)
const main = ref<HTMLElement | null>(null)
const { collapsed: sidebarCollapsed, toggle: toggleSidebar } = useSidebarState()

const widget = computed(() => {
  // O projeto atual é contextual para toda a experiência do colaborador,
  // não somente para a sua página inicial.
  if (route.path.startsWith('/colaborador')) return 'project'
  return (route.meta.sidebarWidget as 'project' | 'goal' | 'none') ?? 'none'
})

// ao trocar de rota: fecha o drawer e volta o conteúdo para o topo
// (o scroll fica no <main>, não na janela, então é preciso resetar manualmente)
watch(() => route.fullPath, () => {
  mobileOpen.value = false
  main.value?.scrollTo({ top: 0 })
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-app">
    <!-- Sidebar fixa (desktop) -->
    <aside
      class="hidden shrink-0 border-r border-slate-200 transition-all duration-300 dark:border-slate-800 lg:block"
      :class="sidebarCollapsed ? 'w-0 overflow-hidden border-r-0' : 'w-64'"
    >
      <AppSidebar :widget="widget" />
    </aside>

    <!-- Sidebar (mobile) -->
    <USlideover v-model:open="mobileOpen" side="left" :ui="{ content: 'w-72' }">
      <template #content>
        <AppSidebar :widget="widget" @navigate="mobileOpen = false" />
      </template>
    </USlideover>

    <!-- Conteúdo -->
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader @open-menu="mobileOpen = true" />
      <main ref="main" class="scroll-thin flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>

    <!-- Botão de toggle sidebar (desktop) -->
    <button
      type="button"
      class="fixed top-1/2 z-50 hidden size-6 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 lg:grid"
      :style="{ left: sidebarCollapsed ? '-1px' : 'calc(16rem - 12px)' }"
      :title="sidebarCollapsed ? 'Mostrar sidebar' : 'Esconder sidebar'"
      @click="toggleSidebar"
    >
      <UIcon
        :name="sidebarCollapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'"
        class="size-3.5 text-slate-400"
      />
    </button>
  </div>
</template>
