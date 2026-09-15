<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { navigateTo } from '#imports'
import { useAuth } from '~/composables/useAuth'
import { useWorkspace, type Workspace } from '~/composables/useWorkspace'

definePageMeta({
  layout: 'blank',
})

const LAST_ACCESS_KEY = 'civitas-ponte-last-access'

interface LastAccessEntry {
  id: string | number
  project: string
  role: string
  icon: string
  iconClass: string
  badgeClass: string
  date: string
}

const colorMode = useColorMode()
const { logout } = useAuth()
const { fetchWorkspaces, selectWorkspace } = useWorkspace()

const currentUser = ref({ name: 'Usuário' })
const myWorkspaces = ref<Workspace[]>([])
const isLoading = ref(true)
const lastAccess = ref<LastAccessEntry[]>([])

onMounted(async () => {
  const auth = useAuth()
  if (auth.user.value) {
    currentUser.value = { name: [auth.user.value.nome, auth.user.value.sobrenome].filter(Boolean).join(' ') }
  } else {
    const fetched = await auth.fetchUser()
    if (fetched) {
      currentUser.value = { name: [fetched.nome, fetched.sobrenome].filter(Boolean).join(' ') }
    }
  }

  myWorkspaces.value = await fetchWorkspaces()
  lastAccess.value = readLastAccess()
  isLoading.value = false
})

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function handleLogout() {
  logout()
}

function formatAccessDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Acesso recente'
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (sameDay) return `Hoje, ${time}`
  if (date.toDateString() === yesterday.toDateString()) return `Ontem, ${time}`
  return date.toLocaleDateString('pt-BR')
}

function readLastAccess(): LastAccessEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LAST_ACCESS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Array<LastAccessEntry & { at?: string }>
    return parsed.slice(0, 3).map(entry => ({
      ...entry,
      date: entry.at ? formatAccessDate(entry.at) : entry.date,
    }))
  } catch {
    return []
  }
}

function rememberAccess(card: ReturnType<typeof styleForRole> & { id: string | number; name: string }) {
  if (typeof window === 'undefined') return
  const next: Array<LastAccessEntry & { at: string }> = [
    {
      id: card.id,
      project: card.name,
      role: card.roleLabel,
      icon: card.icon,
      iconClass: card.iconColor,
      badgeClass: card.historyBadgeClass,
      date: 'Hoje',
      at: new Date().toISOString(),
    },
    ...readLastAccess()
      .filter(item => String(item.id) !== String(card.id))
      .map(item => ({ ...item, at: new Date().toISOString() })),
  ].slice(0, 3)
  localStorage.setItem(LAST_ACCESS_KEY, JSON.stringify(next))
}

function styleForRole(roleRaw: string) {
  const role = (roleRaw || 'colaborador').toLowerCase()

  if (role === 'admin' || role === 'administrador') {
    return {
      role: 'admin',
      roleLabel: 'Admin',
      displayName: 'Painel Administrativo',
      roleDesc: 'Acesso total ao sistema',
      icon: 'i-lucide-folder',
      iconBg: 'bg-[#fde8e8]',
      iconColor: 'text-[#ef4444]',
      badgeIcon: 'i-lucide-crown',
      badgeClass: 'text-[#f43f5e]',
      borderClass: 'border-[#fecaca]',
      roleDescClass: 'text-[#ef4444]',
      btnClass: 'bg-[#dc2626] hover:bg-[#b91c1c] text-white border-transparent shadow-sm',
      desc: null as string | null,
      perms: [
        { label: 'Gerenciar usuários e permissões', icon: 'i-lucide-users' },
        { label: 'Configurar projetos e fluxos', icon: 'i-lucide-settings' },
        { label: 'Relatórios e métricas globais', icon: 'i-lucide-bar-chart-2' },
      ],
      historyBadgeClass: 'bg-rose-50 text-rose-500',
    }
  }

  if (role === 'gestor') {
    return {
      role: 'gestor',
      roleLabel: 'Gestor',
      displayName: null as string | null,
      roleDesc: 'Gestor',
      icon: 'i-lucide-monitor',
      iconBg: 'bg-[#f3e8ff]',
      iconColor: 'text-[#d946ef]',
      badgeIcon: 'i-lucide-user',
      badgeClass: 'text-[#d946ef]',
      borderClass: 'border-[#f3e8ff]',
      roleDescClass: 'text-[#d946ef]',
      btnClass: 'bg-white hover:bg-[#faf5ff] text-[#c026d3] border-[#e879f9]',
      desc: 'Gerencia tarefas, prazos e equipe deste projeto.',
      perms: null as { label: string; icon: string }[] | null,
      historyBadgeClass: 'bg-fuchsia-50 text-fuchsia-500',
    }
  }

  if (role === 'visualizador') {
    return {
      role: 'colaborador',
      roleLabel: 'Visualizador',
      displayName: null,
      roleDesc: 'Acesso total ao sistema',
      icon: 'i-lucide-megaphone',
      iconBg: 'bg-[#e0f2fe]',
      iconColor: 'text-[#38bdf8]',
      badgeIcon: 'i-lucide-eye',
      badgeClass: 'text-[#38bdf8]',
      borderClass: 'border-[#e0f2fe]',
      roleDescClass: 'text-[#38bdf8]',
      btnClass: 'bg-white hover:bg-[#f0f9ff] text-[#0284c7] border-[#7dd3fc]',
      desc: 'Visualize o andamento das tarefas e acompanhe o progresso.',
      perms: null,
      historyBadgeClass: 'bg-sky-50 text-sky-500',
    }
  }

  return {
    role: 'colaborador',
    roleLabel: 'Colaborador',
    displayName: null,
    roleDesc: 'Colaborador',
    icon: 'i-lucide-smartphone',
    iconBg: 'bg-[#fff7ed]',
    iconColor: 'text-[#fb923c]',
    badgeIcon: 'i-lucide-user',
    badgeClass: 'text-[#fb923c]',
    borderClass: 'border-[#ffedd5]',
    roleDescClass: 'text-[#f59e0b]',
    btnClass: 'bg-white hover:bg-[#fffbeb] text-[#d97706] border-[#fdba74]',
    desc: 'Acompanhe e execute suas tarefas neste projeto.',
    perms: null,
    historyBadgeClass: 'bg-amber-50 text-amber-500',
  }
}

const projects = computed(() => {
  return myWorkspaces.value.map((w) => {
    const style = styleForRole(w.role)
    return {
      id: w.id,
      name: style.displayName || w.nome,
      workspaceName: w.nome,
      ...style,
    }
  })
})

const fallbackLastAccess = computed(() => {
  if (lastAccess.value.length) return lastAccess.value
  return projects.value.slice(0, 3).map((item) => ({
    id: item.id,
    project: item.workspaceName,
    role: item.roleLabel,
    icon: item.icon,
    iconClass: item.iconColor,
    badgeClass: item.historyBadgeClass,
    date: 'Acesso recente',
  }))
})

async function enterWorkspace(workspaceId: string | number, role: string) {
  const card = projects.value.find(p => String(p.id) === String(workspaceId))
  if (card) rememberAccess(card)

  selectWorkspace(workspaceId)

  const { clearTasksState, fetchTasksFromSupabase } = await import('~/composables/useTasksData')
  clearTasksState()
  fetchTasksFromSupabase(true)

  const { clearProjectsState } = await import('~/composables/useUserProjects')
  clearProjectsState()

  navigateTo(`/${role.toLowerCase()}`)
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-white font-sans dark:bg-slate-950">
    <!-- blobs do mock -->
    <div class="pointer-events-none absolute -left-16 top-36 size-52 rounded-full bg-[#f5d0fe] opacity-80 dark:opacity-25" />
    <div class="pointer-events-none absolute -right-10 -top-8 size-56 rounded-full bg-[#fed7aa] opacity-80 dark:opacity-25" />
    <div class="pointer-events-none absolute right-0 top-0 h-40 w-72 rounded-bl-[140px] bg-[#ffedd5] opacity-70 dark:opacity-20" />

    <div class="relative z-10 mx-auto flex min-h-screen max-w-[1120px] flex-col px-6 pb-10 pt-3">
      <header class="grid grid-cols-[1fr_auto_1fr] items-center py-2">
        <div class="flex items-center gap-1">
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-moon"
            square
            size="sm"
            aria-label="Alternar tema"
            class="text-slate-700 dark:text-slate-200"
            @click="toggleTheme"
          />
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-log-out"
            square
            size="sm"
            aria-label="Sair"
            class="text-slate-700 dark:text-slate-200"
            @click="handleLogout"
          />
        </div>
        <img
          src="/civitas-logo-transparent.png"
          alt="Civitas"
          class="h-9 w-auto justify-self-center object-contain"
        >
        <div />
      </header>

      <section class="mx-auto max-w-2xl pb-7 pt-5 text-center">
        <h1 class="text-[28px] font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-[32px]">
          Bem vindo(a), {{ currentUser.name }}!
        </h1>
        <p class="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-slate-400">
          Você tem acesso a diferentes trabalhos. Escolha o projeto e o seu papel para continuar.
        </p>
      </section>

      <section class="rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div class="mb-5 flex items-center gap-2">
          <UIcon name="i-lucide-folder" class="size-[18px] text-[#ef4444]" />
          <span class="text-[15px] font-bold text-slate-800 dark:text-slate-100">Escolha onde você quer atuar</span>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="n in 4" :key="n" class="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>

        <p
          v-else-if="!projects.length"
          class="rounded-xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        >
          Você ainda não pertence a nenhum workspace.
        </p>

        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="project in projects"
            :key="String(project.id)"
            class="relative flex min-h-[292px] flex-col rounded-2xl border bg-white p-5 dark:bg-slate-900"
            :class="project.borderClass"
          >
            <div
              class="absolute right-4 top-4 flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.04em]"
              :class="project.badgeClass"
            >
              <UIcon :name="project.badgeIcon" class="size-3.5" />
              <span>{{ project.roleLabel }}</span>
            </div>

            <div class="mb-4 flex size-14 items-center justify-center rounded-2xl" :class="project.iconBg">
              <UIcon :name="project.icon" class="size-7" :class="project.iconColor" />
            </div>

            <h3 class="pr-16 text-[16px] font-bold leading-snug text-slate-800 dark:text-slate-100">
              {{ project.name }}
            </h3>
            <p class="mt-1 text-[13px] font-semibold" :class="project.roleDescClass">
              {{ project.roleDesc }}
            </p>

            <p v-if="project.desc" class="mt-2 text-[13px] leading-relaxed text-slate-400">
              {{ project.desc }}
            </p>

            <ul v-if="project.perms" class="mt-3 flex flex-col gap-2.5">
              <li
                v-for="perm in project.perms"
                :key="perm.label"
                class="flex items-start gap-2 text-[13px] leading-snug text-slate-500"
              >
                <UIcon :name="perm.icon" class="mt-0.5 size-4 shrink-0" :class="project.iconColor" />
                {{ perm.label }}
              </li>
            </ul>

            <div class="flex-1" />

            <button
              type="button"
              class="mt-5 flex w-full items-center justify-center gap-1 rounded-xl border py-2.5 text-[14px] font-semibold transition-colors"
              :class="project.btnClass"
              @click="enterWorkspace(project.id, project.role)"
            >
              Entrar como {{ project.roleLabel }}
              <span class="text-base leading-none">→</span>
            </button>
          </article>
        </div>
      </section>

      <section class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1.15fr_0.85fr]">
        <div class="rounded-[20px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div class="mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-clock" class="size-[18px] text-[#ef4444]" />
            <span class="text-[15px] font-bold text-slate-800 dark:text-slate-100">Últimos acessos</span>
          </div>
          <div class="flex flex-col gap-3.5">
            <div
              v-for="entry in fallbackLastAccess"
              :key="`${entry.project}-${entry.role}`"
              class="grid grid-cols-[1fr_auto_auto] items-center gap-3"
            >
              <div class="flex min-w-0 items-center gap-2.5 text-[14px] text-slate-600 dark:text-slate-200">
                <UIcon :name="entry.icon" class="size-4 shrink-0" :class="entry.iconClass" />
                <span class="truncate">{{ entry.project }}</span>
              </div>
              <span
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                :class="entry.badgeClass"
              >
                {{ entry.role }}
              </span>
              <span class="whitespace-nowrap text-[13px] text-slate-400">{{ entry.date }}</span>
            </div>
            <p v-if="!fallbackLastAccess.length" class="text-sm text-slate-400">Nenhum acesso recente.</p>
          </div>
        </div>

        <div class="rounded-[20px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div class="mb-3 flex items-center gap-2">
            <UIcon name="i-lucide-map-pin" class="size-[18px] text-[#a855f7]" />
            <span class="text-[15px] font-bold text-slate-800 dark:text-slate-100">Dica</span>
          </div>
          <p class="text-[14px] leading-relaxed text-slate-400">
            Você pode alternar entre seus acessos a qualquer momento. Basta voltar
            a esta tela e escolher outra opção.
          </p>
        </div>
      </section>

      <footer class="mt-5 flex justify-center">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#ef4444] hover:text-[#dc2626]"
          @click="handleLogout"
        >
          <UIcon name="i-lucide-log-out" class="size-4" />
          Sair da conta
        </button>
      </footer>
    </div>
  </div>
</template>
