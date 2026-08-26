<script setup lang="ts">
defineProps<{
  /** widget exibido no rodapé da sidebar, definido pela meta da rota */
  widget?: 'project' | 'goal' | 'none'
  collapsed?: boolean
}>()

const emit = defineEmits<{ navigate: [], 'toggle-projects': [] }>()

const route = useRoute()
const { homePath, items: nav } = useAppNavigation()
const projectsFirst = useCookie('civitas_projects_first', { default: () => false })
const workspaceHidden = useCookie('civitas_workspace_hidden', { default: () => false })

const navLinkClass =
  'group flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-orange-50/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
const navLinkActiveClass =
  '!bg-orange-50 !text-orange-600 dark:!bg-orange-500/10 dark:!text-orange-400'

function isNavActive(to: string) {
  return route.path === to
}
</script>

<template>
  <div class="flex h-full flex-col bg-white dark:bg-slate-900 relative">
    <!-- Marca -->
    <div class="flex h-16 items-center border-b border-slate-100 dark:border-slate-800" :class="collapsed ? 'justify-center' : 'px-5'">
      <NuxtLink :to="homePath" aria-label="CiViTas — início" @click="emit('navigate')">
        <AppLogo :collapsed="collapsed" />
      </NuxtLink>
    </div>

    <!-- Seções com ordem dinâmica -->
    <div class="flex min-h-0 flex-1 flex-col">
      <!-- Navegação (Workspace) -->
      <nav class="shrink-0 px-3 py-3 flex flex-col" aria-label="Navegação principal">
        <div class="mb-1 flex items-center justify-between" :class="collapsed ? 'justify-center' : 'px-2.5'">
          <p v-if="!collapsed" class="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Workspace</p>
          <button
            v-if="!collapsed"
            type="button"
            class="grid size-5 place-items-center rounded text-slate-300 transition-colors hover:text-orange-500 dark:text-slate-600"
            :title="workspaceHidden ? 'Mostrar workspace' : 'Esconder workspace'"
            @click="workspaceHidden = !workspaceHidden"
          >
            <UIcon :name="workspaceHidden ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="size-4" />
          </button>
        </div>
        <template v-if="!workspaceHidden || collapsed">
          <div class="space-y-1">
            <NuxtLink
              v-for="item in nav"
              :key="item.to"
              :to="item.to"
              :title="collapsed ? item.label : undefined"
              :class="[navLinkClass, isNavActive(item.to) && navLinkActiveClass, collapsed ? 'justify-center px-0' : '']"
              @click="emit('navigate')"
            >
              <UIcon :name="item.icon" class="size-5 shrink-0" />
              <span v-if="!collapsed">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </template>
        
        <!-- Toggle Projetos (4 bolinhas coloridas) -->
        <div class="mt-4 flex justify-center" v-if="collapsed && widget === 'project'">
          <button
            type="button"
            class="grid size-9 place-items-center rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            title="Mostrar/esconder Projetos"
            @click="$emit('toggle-projects')"
          >
            <div class="grid grid-cols-2 gap-0.5 w-[14px] h-[14px]">
              <div class="bg-blue-500 rounded-full w-1.5 h-1.5"></div>
              <div class="bg-violet-500 rounded-full w-1.5 h-1.5"></div>
              <div class="bg-amber-500 rounded-full w-1.5 h-1.5"></div>
              <div class="bg-pink-500 rounded-full w-1.5 h-1.5"></div>
            </div>
          </button>
        </div>
      </nav>

      <!-- Rodapé contextual (Projetos) -->
      <div v-if="!collapsed && widget && widget !== 'none'" class="flex-1 min-h-0 border-t border-slate-100 px-3 py-4 dark:border-slate-800 flex flex-col">
        <AppProjectCard v-if="widget === 'project'" />
        <AppGoalCard v-else-if="widget === 'goal'" />
      </div>
    </div>
  </div>
</template>
