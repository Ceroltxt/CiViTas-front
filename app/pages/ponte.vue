<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const colorMode = useColorMode()
const auth = useAuth()
const currentUser = useCurrentUser()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
function handleLogout() {
  auth.logout()
}
const projects = [
  {
    role: 'admin',
    roleLabel: 'Admin',
    name: 'Painel Administrativo',
    roleDesc: 'Acesso total ao sistema',
    icon: 'i-lucide-folder-open',
    iconBg: 'bg-red-100 dark:bg-red-950',
    iconColor: 'text-red-500 dark:text-red-400',
    badgeIcon: 'i-lucide-crown',
    badgeClass: 'text-red-500 dark:text-red-400',
    borderClass: 'border-slate-200 dark:border-slate-700',
    roleDescClass: 'text-red-500 dark:text-red-400',
    btnClass: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
    route: '/admin',
    perms: [
      { icon: 'i-lucide-users',       label: 'Gerenciar usuários e permissões' },
      { icon: 'i-lucide-layout',      label: 'Configurar projetos e fluxos' },
      { icon: 'i-lucide-bar-chart-2', label: 'Relatórios e métricas globais' },
    ],
  },
  {
    role: 'gestor',
    roleLabel: 'Gestor',
    name: 'Projeto Website',
    roleDesc: 'Gestor',
    icon: 'i-lucide-monitor',
    iconBg: 'bg-purple-100 dark:bg-purple-950',
    iconColor: 'text-purple-500 dark:text-purple-400',
    badgeIcon: 'i-lucide-user-check',
    badgeClass: 'text-purple-500 dark:text-purple-400',
    borderClass: 'border-slate-200 dark:border-slate-700',
    roleDescClass: 'text-purple-500 dark:text-purple-400',
    btnClass: 'bg-transparent hover:bg-purple-50 dark:hover:bg-purple-950 text-purple-600 dark:text-purple-400 border-purple-500 dark:border-purple-400',
    route: '/gestor',
    desc: 'Gerencia tarefas, prazos e equipe deste projeto.',
    perms: null,
  },
  {
    role: 'colaborador',
    roleLabel: 'Colaborador',
    name: 'Projeto App Mobile',
    roleDesc: 'Colaborador',
    icon: 'i-lucide-smartphone',
    iconBg: 'bg-amber-100 dark:bg-amber-950',
    iconColor: 'text-amber-500 dark:text-amber-400',
    badgeIcon: 'i-lucide-user',
    badgeClass: 'text-amber-500 dark:text-amber-400',
    borderClass: 'border-slate-200 dark:border-slate-700',
    roleDescClass: 'text-amber-500 dark:text-amber-400',
    btnClass: 'bg-transparent hover:bg-amber-50 dark:hover:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-500 dark:border-amber-400',
    route: '/colaborador',
    desc: 'Acompanhe e execute suas tarefas neste projeto.',
    perms: null,
  },
  {
    role: 'visualizador',
    roleLabel: 'Visualizador',
    name: 'Projeto Marketing',
    roleDesc: 'Acesso total ao sistema',
    icon: 'i-lucide-megaphone',
    iconBg: 'bg-blue-100 dark:bg-blue-950',
    iconColor: 'text-blue-500 dark:text-blue-400',
    badgeIcon: 'i-lucide-eye',
    badgeClass: 'text-blue-500 dark:text-blue-400',
    borderClass: 'border-slate-200 dark:border-slate-700',
    roleDescClass: 'text-blue-500 dark:text-blue-400',
    btnClass: 'bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-400',
    route: '/visualizador',
    desc: 'Visualize o andamento das tarefas e acompanhe o progresso.',
    perms: null,
  },
]

const lastAccess = [
  {
    project: 'Projeto Website',
    role: 'Gestor',
    icon: 'i-lucide-monitor',
    iconClass: 'text-purple-500 dark:text-purple-400',
    badgeClass: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300',
    date: 'Hoje, 08:45',
  },
  {
    project: 'Projeto App Mobile',
    role: 'Colaborador',
    icon: 'i-lucide-smartphone',
    iconClass: 'text-amber-500 dark:text-amber-400',
    badgeClass: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300',
    date: 'Ontem, 16:20',
  },
  {
    project: 'Projeto Marketing',
    role: 'Visualizador',
    icon: 'i-lucide-megaphone',
    iconClass: 'text-blue-500 dark:text-blue-400',
    badgeClass: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300',
    date: '12/04/2026',
  },
]
</script>

<template>
  <div class="relative min-h-screen flex flex-col items-center pb-10 overflow-hidden bg-gray-50 dark:bg-slate-900">

    <!-- "círculos decorativos" no fundo -->
    <div class="fixed w-46 h-46 rounded-full bg-purple-300 opacity-40 dark:opacity-15 top-25 -left-16 pointer-events-none z-0" />
    <div class="fixed w-58 h-58 rounded-full bg-orange-200 opacity-50 dark:opacity-15 -top-14 -right-14 pointer-events-none z-0" />

    <!-- Header -->
    <header class="relative z-10 w-full max-w-5xl flex items-center justify-between px-6 py-4">
      <div class="flex gap-1 w-20">
        <UButton variant="ghost" color="neutral" icon="i-lucide-sun-moon" square size="sm" @click="toggleTheme"/>
        <UButton variant="ghost" color="neutral" icon="i-lucide-log-out" square size="sm" @click="handleLogout" />
      </div>
      <img
          src="/civitas-logo-transparent.png"
          alt="Logo Civitas"
          class="w-32 mx-auto"
        />
      <div class="w-20" />
    </header>

    <!-- Boas-vindas -->
    <section class="relative z-10 text-center px-6 pt-2 pb-8 max-w-2xl">
      <h1 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
        Bem-vindo(a), {{ currentUser.name }}! 👋
      </h1>
      <p class="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
        Você tem acesso a diferentes trabalhos. Escolha o projeto e o seu papel para continuar.
      </p>
    </section>

    <!-- Seção de cards -->
    <section class="relative z-10 w-full max-w-5xl px-4 mb-4">
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">

        <!-- Título da seção -->
        <div class="flex items-center gap-2 mb-5">
          <UIcon name="i-lucide-briefcase" class="text-red-500 text-lg" />
          <span class="font-bold text-slate-800 dark:text-slate-100 text-sm">Escolha onde você quer atuar</span>
        </div>

        <!-- Grid de cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="project in projects"
            :key="project.role"
            class="relative flex flex-col gap-2 border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800/50"
          >
            <!-- Badge de papel (topo direito) -->
            <div class="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold tracking-wide" :class="project.badgeClass">
              <UIcon :name="project.badgeIcon" class="text-sm" />
              <span>{{ project.role.toUpperCase() }}</span>
            </div>

            <!-- Ícone do projeto -->
            <div class="w-14 h-14 rounded-xl flex items-center justify-center mb-1" :class="project.iconBg">
              <UIcon :name="project.icon" class="text-2xl" :class="project.iconColor" />
            </div>

            <!-- Nome e papel -->
            <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 pr-16">{{ project.name }}</h3>
            <p class="text-xs font-semibold" :class="project.roleDescClass">{{ project.roleDesc }}</p>

            <!-- Descrição (para não-admin) -->
            <p v-if="project.desc" class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ project.desc }}
            </p>

            <!-- Lista de permissões (só admin) -->
            <ul v-if="project.perms" class="flex flex-col gap-2 mt-1">
              <li
                v-for="perm in project.perms"
                :key="perm.label"
                class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
              >
                <UIcon :name="perm.icon" class="text-sm flex-shrink-0" :class="project.iconColor" />
                {{ perm.label }}
              </li>
            </ul>

            <div class="flex-1" />

            <!-- Botão de entrada -->
            <button
              class="mt-3 w-full py-2 px-4 rounded-lg border text-sm font-semibold transition-colors cursor-pointer"
              :class="project.btnClass"
              @click="navigateTo(project.route)"
            >
              Entrar como {{ project.roleLabel }} →
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom -->
    <section class="relative z-10 w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

      <!-- Últimos acessos -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-clock" class="text-red-500 text-lg" />
          <span class="font-bold text-slate-800 dark:text-slate-100 text-sm">Últimos acessos</span>
        </div>
        <div class="flex flex-col gap-3">
          <div
            v-for="entry in lastAccess"
            :key="entry.project"
            class="grid grid-cols-[1fr_auto_auto] items-center gap-3"
          >
            <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <UIcon :name="entry.icon" class="text-base flex-shrink-0" :class="entry.iconClass" />
              {{ entry.project }}
            </div>
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase" :class="entry.badgeClass">
              {{ entry.role }}
            </span>
            <span class="text-xs text-slate-400 whitespace-nowrap">{{ entry.date }}</span>
          </div>
        </div>
      </div>

      <!-- Dica -->
      <div class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-lightbulb" class="text-purple-500 text-lg" />
          <span class="font-bold text-slate-800 dark:text-slate-100 text-sm">Dica</span>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Você pode alternar entre seus acessos a qualquer momento. Basta voltar
          a esta tela e escolher outra opção.
        </p>
      </div>

    </section>

    <!-- Footer: sair -->
    <footer class="relative z-10 mt-2">
      <UButton
        variant="ghost"
        color="error"
        icon="i-lucide-log-out"
        @click="handleLogout"
      >
        Sair da conta
      </UButton>
    </footer>

  </div>
</template>