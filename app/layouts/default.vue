<script setup lang="ts">
const route = useRoute()
const mobileOpen = ref(false)
const main = ref<HTMLElement | null>(null)

const widget = computed(
  () => (route.meta.sidebarWidget as 'project' | 'goal' | 'none') ?? 'none',
)

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
    <aside class="hidden w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 lg:block">
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
  </div>
</template>
