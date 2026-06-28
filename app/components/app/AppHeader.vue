<script setup lang="ts">
import { brandGradient } from '~/utils/tw'

const emit = defineEmits<{ openMenu: [] }>()

const user = useCurrentUser()
const { appRole } = useAppNavigation()
const colorMode = useColorMode()
const search = ref('')

const { items: notifications, unreadCount } = useNotifications()
const helpOpen = ref(false)

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const userMenu = computed(() => {
  const primary = [{ label: 'Meu perfil', icon: 'i-heroicons-user' }]
  if (appRole.value === 'colaborador') {
    primary.push({
      label: 'Configurações',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/colaborador/configuracoes',
    })
  }
  return [primary, [{ label: 'Sair', icon: 'i-heroicons-arrow-right-on-rectangle', to: '/ponte' }]]
})

const createOptions = computed(() => {
  const role = user.role
  if (role === 'Colaborador') {
    return [
      {
        label: 'Criar tarefa pessoal',
        icon: 'i-heroicons-user',
        description: 'Crie uma tarefa privada para organizar sua rotina pessoal.',
        click: () => alert('Abertura de nova tarefa pessoal!')
      }
    ]
  } else if (role === 'Gestor') {
    return [
      {
        label: 'Criar tarefa',
        icon: 'i-heroicons-clipboard-document-list',
        description: 'Adicione uma nova tarefa para um colaborador no projeto.',
        click: () => alert('Criar nova tarefa no projeto!')
      },
      {
        label: 'Criar equipe',
        icon: 'i-heroicons-user-group',
        description: 'Monte um novo time de trabalho e defina os membros.',
        click: () => alert('Criar nova equipe!')
      }
    ]
  } else {
    return [
      {
        label: 'Criar tarefa',
        icon: 'i-heroicons-clipboard-document-list',
        description: 'Adicione uma nova tarefa para um colaborador no projeto.',
        click: () => alert('Criar nova tarefa no projeto!')
      },
      {
        label: 'Criar equipe',
        icon: 'i-heroicons-user-group',
        description: 'Monte um novo time de trabalho e defina os membros.',
        click: () => alert('Criar nova equipe!')
      },
      {
        label: 'Criar projeto',
        icon: 'i-heroicons-briefcase',
        description: 'Inicie um novo projeto corporativo com metas e prazos.',
        click: () => alert('Criar novo projeto!')
      }
    ]
  }
})
</script>

<template>
  <header
    class="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6"
  >
    <!-- Botão de menu (mobile) -->
    <UButton
      class="lg:hidden"
      color="neutral"
      variant="ghost"
      icon="i-heroicons-bars-3"
      aria-label="Abrir menu"
      @click="emit('openMenu')"
    />

    <!-- Busca + Criar -->
    <div class="flex w-full max-w-xl items-center">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass"
        placeholder="Pesquisar"
        size="lg"
        :ui="{ root: 'flex-1', base: 'rounded-l-full rounded-r-none bg-slate-50 ring-slate-200' }"
        aria-label="Pesquisar"
      />
      <UPopover>
        <UButton
          label="Criar"
          size="lg"
          :class="[brandGradient, 'rounded-l-none rounded-r-full px-5 font-semibold text-white hover:opacity-95']"
        />
        <template #content>
          <div class="p-1 w-72 bg-white dark:bg-slate-900 rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10">
            <button
              v-for="opt in createOptions"
              :key="opt.label"
              type="button"
              class="flex w-full items-start gap-3 rounded-lg p-2.5 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              @click="opt.click"
            >
              <UIcon :name="opt.icon" class="size-5 mt-0.5 shrink-0 text-slate-500 dark:text-slate-400" />
              <div class="space-y-0.5">
                <span class="block font-semibold text-slate-800 dark:text-slate-100">{{ opt.label }}</span>
                <span class="block text-xs text-slate-400 dark:text-slate-500 leading-normal">{{ opt.description }}</span>
              </div>
            </button>
          </div>
        </template>
      </UPopover>
    </div>

    <div class="ml-auto flex items-center gap-1 sm:gap-2">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-moon"
        aria-label="Alternar tema"
        @click="toggleTheme"
      />
      <UPopover :ui="{ content: 'w-[22rem] max-w-[calc(100vw-2rem)]' }">
        <div class="relative">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-bell"
            aria-label="Notificações"
          />
          <span
            v-if="unreadCount > 0"
            class="pointer-events-none absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-white dark:ring-slate-900"
          >
            {{ unreadCount }}
          </span>
        </div>

        <template #content>
          <div class="flex max-h-[26rem] flex-col">
            <header class="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100">Notificações</h3>
              <span
                v-if="unreadCount > 0"
                class="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600"
              >
                {{ unreadCount }} {{ unreadCount === 1 ? 'nova' : 'novas' }}
              </span>
            </header>

            <div class="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <InicioNotificationsCard :items="notifications" />
            </div>
          </div>
        </template>
      </UPopover>

      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-question-mark-circle"
        aria-label="Ajuda"
        @click="helpOpen = true"
      />

      <UDropdownMenu :items="userMenu" :ui="{ content: 'w-48' }">
        <button
          type="button"
          class="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <UAvatar :src="user.avatar" :alt="user.name" size="md" />
          <span class="hidden text-left leading-tight sm:block">
            <span class="block text-sm font-semibold text-slate-800 dark:text-slate-100">{{ user.name }}</span>
            <span class="block text-xs text-slate-400">{{ user.role }}</span>
          </span>
          <UIcon name="i-heroicons-chevron-down" class="size-4 text-slate-400" />
        </button>
      </UDropdownMenu>
    </div>
  </header>

  <AppHelpModal v-model:open="helpOpen" />
</template>
