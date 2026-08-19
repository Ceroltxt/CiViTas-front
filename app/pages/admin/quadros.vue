<script setup lang="ts">
import { computed, ref } from 'vue'

definePageMeta({ sidebarWidget: 'none' })

const projects = useUserProjects()
const current = useCurrentProject()
const selectedProjectId = ref(
  projects.find((p) => p.name === current.name)?.id ?? projects[0]?.id ?? '',
)

const selectedProject = computed(
  () => projects.find((p) => p.id === selectedProjectId.value) ?? projects[0],
)

const tabs = [
  { key: 'kanban', label: 'Kanban', icon: 'i-heroicons-squares-2x2' },
  { key: 'timeline', label: 'Timeline (Gantt)', icon: 'i-heroicons-bars-3-bottom-left' },
]
const activeTab = ref('kanban')

const teamFilter = ref('Todas')
const responsibleFilter = ref('Todos')
const priorityFilter = ref('Todas')
const search = ref('')
const projectOpen = ref(false)

// Obter tarefas do colaborador
const allCollaboratorTasks = useTasksData()

// Mapeamento dinâmico de tarefas por projeto (idêntico ao colaborador e gestor)
const selectedProjectTasks = computed(() => {
  const projName = selectedProject.value?.name
  if (!projName) return []

  // Filtrar as tarefas de trabalho do colaborador do projeto ativo
  const myTasks = allCollaboratorTasks.filter(
    (t) => !t.personal && t.project === projName
  )

  const additionalTasksMap: Record<string, any[]> = {
    'Plataforma E-commerce': [
      {
        id: 'ecom-add-1',
        title: 'Design responsivo da vitrine de produtos',
        priority: 'alta',
        status: 'a-fazer',
        dueDate: '12 Jul',
        assignees: [{ id: 'beatriz', name: 'Beatriz Ribeiro', avatar: 'https://i.pravatar.cc/48?img=20' }]
      },
      {
        id: 'ecom-add-2',
        title: 'Integração com API de cálculo de frete (Correios/Loggi)',
        priority: 'media',
        status: 'em-andamento',
        dueDate: '18 Jul',
        progress: 40,
        assignees: [{ id: 'daniel', name: 'Daniel Macena', avatar: 'https://i.pravatar.cc/48?img=12' }]
      },
      {
        id: 'ecom-add-3',
        title: 'Configurar SSL e checkout seguro',
        priority: 'critica',
        status: 'em-revisao',
        dueDate: '20 Jul',
        assignees: [{ id: 'ana', name: 'Ana Carol', avatar: 'https://i.pravatar.cc/48?img=9' }]
      },
      {
        id: 'ecom-add-4',
        title: 'Otimização SEO das páginas de produto',
        priority: 'baixa',
        status: 'concluido',
        dueDate: '30 Mai',
        assignees: [{ id: 'fernanda', name: 'Fernanda Souza', avatar: 'https://i.pravatar.cc/48?img=47' }]
      },
      {
        id: 'ecom-add-5',
        title: 'Ajuste de cupom de desconto no carrinho',
        priority: 'media',
        status: 'bloqueado',
        note: 'Aguardando regra de negócio do comercial',
        dueDate: '22 Jun',
        assignees: [{ id: 'gabriel', name: 'Gabriel Alves', avatar: 'https://i.pravatar.cc/48?img=51' }]
      },
      {
        id: 'ecom-add-6',
        title: 'Relatório de vendas por região',
        priority: 'baixa',
        status: 'a-fazer',
        dueDate: '25 Jul',
        assignees: [{ id: 'eduardo', name: 'Eduardo Lima', avatar: 'https://i.pravatar.cc/48?img=33' }]
      },
      {
        id: 'ecom-add-7',
        title: 'Envio de e-mail de carrinho abandonado',
        priority: 'alta',
        status: 'concluido',
        dueDate: '15 Mai',
        assignees: [{ id: 'cecilia', name: 'Cecília Neves', avatar: 'https://i.pravatar.cc/48?img=25' }]
      }
    ],
    'Civitas Mobile': [
      {
        id: 'mob-add-1',
        title: 'Desenvolver splash screen e onboarding do app',
        priority: 'media',
        status: 'a-fazer',
        dueDate: '08 Jul',
        assignees: [{ id: 'helena', name: 'Helena Dias', avatar: 'https://i.pravatar.cc/48?img=44' }]
      },
      {
        id: 'mob-add-2',
        title: 'Implementar geolocalização em tempo real',
        priority: 'critica',
        status: 'em-andamento',
        dueDate: '14 Jul',
        progress: 70,
        assignees: [{ id: 'gabriel', name: 'Gabriel Alves', avatar: 'https://i.pravatar.cc/48?img=51' }]
      },
      {
        id: 'mob-add-3',
        title: 'Configuração das push notifications Firebase',
        priority: 'alta',
        status: 'em-revisao',
        dueDate: '17 Jul',
        assignees: [{ id: 'ana', name: 'Ana Carol', avatar: 'https://i.pravatar.cc/48?img=9' }]
      },
      {
        id: 'mob-add-4',
        title: 'Ajustes de layout no modo escuro',
        priority: 'baixa',
        status: 'concluido',
        dueDate: '12 Jun',
        assignees: [{ id: 'beatriz', name: 'Beatriz Ribeiro', avatar: 'https://i.pravatar.cc/48?img=20' }]
      },
      {
        id: 'mob-add-5',
        title: 'Testes de usabilidade com usuários finais',
        priority: 'media',
        status: 'em-revisao',
        dueDate: '18 Jul',
        assignees: [{ id: 'cecilia', name: 'Cecília Neves', avatar: 'https://i.pravatar.cc/48?img=25' }]
      },
      {
        id: 'mob-add-6',
        title: 'Correção de bug de crash no iOS 17',
        priority: 'critica',
        status: 'atrasado',
        note: 'Atrasada há 1 semana',
        dueDate: '20 Jun',
        progress: 30,
        assignees: [{ id: 'daniel', name: 'Daniel Macena', avatar: 'https://i.pravatar.cc/48?img=12' }]
      },
      {
        id: 'mob-add-7',
        title: 'Sincronização offline de dados locais',
        priority: 'alta',
        status: 'em-andamento',
        dueDate: '29 Jun',
        progress: 50,
        assignees: [{ id: 'igor', name: 'Igor Pinto', avatar: 'https://i.pravatar.cc/48?img=15' }]
      },
      {
        id: 'mob-add-8',
        title: 'Upload de foto de perfil na conta do usuário',
        priority: 'baixa',
        status: 'concluido',
        dueDate: '10 Mai',
        assignees: [{ id: 'fernanda', name: 'Fernanda Souza', avatar: 'https://i.pravatar.cc/48?img=47' }]
      },
      {
        id: 'mob-add-9',
        title: 'Implementar biometria FaceID / TouchID',
        priority: 'media',
        status: 'em-andamento',
        dueDate: '30 Jul',
        progress: 10,
        assignees: [{ id: 'eduardo', name: 'Eduardo Lima', avatar: 'https://i.pravatar.cc/48?img=33' }]
      }
    ],
    'Plataforma MEI': [
      {
        id: 'mei-add-1',
        title: 'Emissão automatizada de guias DAS',
        priority: 'critica',
        status: 'a-fazer',
        dueDate: '22 Jul',
        assignees: [{ id: 'daniel', name: 'Daniel Macena', avatar: 'https://i.pravatar.cc/48?img=12' }]
      },
      {
        id: 'mei-add-2',
        title: 'Fluxo de preenchimento da declaração anual',
        priority: 'alta',
        status: 'em-andamento',
        dueDate: '19 Jul',
        progress: 55,
        assignees: [{ id: 'cecilia', name: 'Cecília Neves', avatar: 'https://i.pravatar.cc/48?img=25' }]
      },
      {
        id: 'mei-add-3',
        title: 'Integração com gov.br para autenticação',
        priority: 'media',
        status: 'em-revisao',
        dueDate: '25 Jul',
        assignees: [{ id: 'igor', name: 'Igor Pinto', avatar: 'https://i.pravatar.cc/48?img=15' }]
      },
      {
        id: 'mei-add-4',
        title: 'Envio de lembretes por SMS',
        priority: 'baixa',
        status: 'concluido',
        dueDate: '05 Jun',
        assignees: [{ id: 'eduardo', name: 'Eduardo Lima', avatar: 'https://i.pravatar.cc/48?img=33' }]
      },
      {
        id: 'mei-add-5',
        title: 'Suporte a parcelamento de débitos MEI',
        priority: 'alta',
        status: 'a-fazer',
        dueDate: '12 Ago',
        assignees: [{ id: 'ana', name: 'Ana Carol', avatar: 'https://i.pravatar.cc/48?img=9' }]
      },
      {
        id: 'mei-add-6',
        title: 'Validação de CNPJ na Receita Federal',
        priority: 'critica',
        status: 'bloqueado',
        note: 'Instabilidade na API externa do governo',
        dueDate: '15 Jun',
        assignees: [{ id: 'gabriel', name: 'Gabriel Alves', avatar: 'https://i.pravatar.cc/48?img=51' }]
      },
      {
        id: 'mei-add-7',
        title: 'Calculadora de faturamento mensal do MEI',
        priority: 'media',
        status: 'a-fazer',
        dueDate: '05 Ago',
        assignees: [{ id: 'beatriz', name: 'Beatriz Ribeiro', avatar: 'https://i.pravatar.cc/48?img=20' }]
      }
    ],
    'App de Gestão Produtiva Corp.': [
      {
        id: 'corp-add-1',
        title: 'Painel de relatórios consolidados em PDF',
        priority: 'alta',
        status: 'a-fazer',
        dueDate: '15 Jul',
        assignees: [{ id: 'ana', name: 'Ana Carol', avatar: 'https://i.pravatar.cc/48?img=9' }]
      },
      {
        id: 'corp-add-2',
        title: 'Controle de times e hierarquias de permissão',
        priority: 'critica',
        status: 'em-andamento',
        dueDate: '23 Jul',
        progress: 80,
        assignees: [{ id: 'beatriz', name: 'Beatriz Ribeiro', avatar: 'https://i.pravatar.cc/48?img=20' }]
      },
      {
        id: 'corp-add-3',
        title: 'Configurar pipeline de CI/CD para deploy AWS',
        priority: 'media',
        status: 'em-revisao',
        dueDate: '29 Jul',
        assignees: [{ id: 'daniel', name: 'Daniel Macena', avatar: 'https://i.pravatar.cc/48?img=12' }]
      },
      {
        id: 'corp-add-4',
        title: 'Estruturação inicial de schemas do banco',
        priority: 'baixa',
        status: 'concluido',
        dueDate: '10 Mai',
        assignees: [{ id: 'gabriel', name: 'Gabriel Alves', avatar: 'https://i.pravatar.cc/48?img=51' }]
      },
      {
        id: 'corp-add-5',
        title: 'Exportação de logs para auditoria de compliance',
        priority: 'alta',
        status: 'a-fazer',
        dueDate: '30 Jul',
        assignees: [{ id: 'cecilia', name: 'Cecília Neves', avatar: 'https://i.pravatar.cc/48?img=25' }]
      },
      {
        id: 'corp-add-6',
        title: 'Refatoração da autenticação multifator (MFA)',
        priority: 'critica',
        status: 'em-andamento',
        dueDate: '19 Jul',
        progress: 50,
        assignees: [{ id: 'igor', name: 'Igor Pinto', avatar: 'https://i.pravatar.cc/48?img=15' }]
      },
      {
        id: 'corp-add-7',
        title: 'Ajuste de performance no carregamento da home',
        priority: 'media',
        status: 'em-andamento',
        dueDate: '22 Jul',
        progress: 25,
        assignees: [{ id: 'helena', name: 'Helena Dias', avatar: 'https://i.pravatar.cc/48?img=44' }]
      },
      {
        id: 'corp-add-8',
        title: 'Desenvolvimento do chat interno corporativo',
        priority: 'media',
        status: 'bloqueado',
        note: 'Aguardando definição sobre criptografia ponta a ponta',
        dueDate: '20 Jul',
        assignees: [{ id: 'eduardo', name: 'Eduardo Lima', avatar: 'https://i.pravatar.cc/48?img=33' }]
      },
      {
        id: 'corp-add-9',
        title: 'Configuração do ambiente de homologação',
        priority: 'baixa',
        status: 'concluido',
        dueDate: '15 Abr',
        assignees: [{ id: 'fernanda', name: 'Fernanda Souza', avatar: 'https://i.pravatar.cc/48?img=47' }]
      },
      {
        id: 'corp-add-10',
        title: 'Definição das metas de produtividade da equipe',
        priority: 'alta',
        status: 'concluido',
        dueDate: '08 Mai',
        assignees: [{ id: 'ana', name: 'Ana Carol', avatar: 'https://i.pravatar.cc/48?img=9' }]
      },
      {
        id: 'corp-add-11',
        title: 'Testes de carga na API principal',
        priority: 'critica',
        status: 'atrasado',
        note: 'Servidores de testes caíram no final de semana',
        dueDate: '25 Jun',
        progress: 85,
        assignees: [{ id: 'daniel', name: 'Daniel Macena', avatar: 'https://i.pravatar.cc/48?img=12' }]
      }
    ],
    'Sistema de Logística': [
      {
        id: 'log-add-1',
        title: 'Roteirização inteligente de frotas de entrega',
        priority: 'critica',
        status: 'a-fazer',
        dueDate: '28 Jul',
        assignees: [{ id: 'igor', name: 'Igor Pinto', avatar: 'https://i.pravatar.cc/48?img=15' }]
      },
      {
        id: 'log-add-2',
        title: 'Painel de monitoramento de motoristas em tempo real',
        priority: 'alta',
        status: 'em-andamento',
        dueDate: '18 Jul',
        progress: 30,
        assignees: [{ id: 'helena', name: 'Helena Dias', avatar: 'https://i.pravatar.cc/48?img=44' }]
      },
      {
        id: 'log-add-3',
        title: 'Integração com coletores de dados de código de barras',
        priority: 'media',
        status: 'a-fazer',
        dueDate: '24 Ago',
        assignees: [{ id: 'eduardo', name: 'Eduardo Lima', avatar: 'https://i.pravatar.cc/48?img=33' }]
      },
      {
        id: 'log-add-4',
        title: 'Organização e cadastro de frotas',
        priority: 'baixa',
        status: 'concluido',
        dueDate: '14 Mai',
        assignees: [{ id: 'gabriel', name: 'Gabriel Alves', avatar: 'https://i.pravatar.cc/48?img=51' }]
      },
      {
        id: 'log-add-5',
        title: 'Notificações SMS/WhatsApp de status de entrega para clientes',
        priority: 'alta',
        status: 'a-fazer',
        dueDate: '10 Ago',
        assignees: [{ id: 'fernanda', name: 'Fernanda Souza', avatar: 'https://i.pravatar.cc/48?img=47' }]
      },
      {
        id: 'log-add-6',
        title: 'Cálculo de pedágios automáticos na rota',
        priority: 'media',
        status: 'a-fazer',
        dueDate: '15 Ago',
        assignees: [{ id: 'daniel', name: 'Daniel Macena', avatar: 'https://i.pravatar.cc/48?img=12' }]
      },
      {
        id: 'log-add-7',
        title: 'Assinatura digital de recebimento de carga',
        priority: 'critica',
        status: 'bloqueado',
        note: 'Falta homologar app coletor na Google Play',
        dueDate: '30 Jun',
        assignees: [{ id: 'ana', name: 'Ana Carol', avatar: 'https://i.pravatar.cc/48?img=9' }]
      },
      {
        id: 'log-add-8',
        title: 'Relatório de consumo médio de combustível',
        priority: 'baixa',
        status: 'concluido',
        dueDate: '20 Mai',
        assignees: [{ id: 'beatriz', name: 'Beatriz Ribeiro', avatar: 'https://i.pravatar.cc/48?img=20' }]
      }
    ],
    'Portal do Cliente': [
      {
        id: 'port-add-1',
        title: 'Área de download de notas fiscais e faturas',
        priority: 'alta',
        status: 'a-fazer',
        dueDate: '11 Jul',
        assignees: [{ id: 'cecilia', name: 'Cecília Neves', avatar: 'https://i.pravatar.cc/48?img=25' }]
      },
      {
        id: 'port-add-2',
        title: 'Chatbot de autoatendimento integrado',
        priority: 'media',
        status: 'em-andamento',
        dueDate: '27 Jul',
        progress: 50,
        assignees: [{ id: 'fernanda', name: 'Fernanda Souza', avatar: 'https://i.pravatar.cc/48?img=47' }]
      },
      {
        id: 'port-add-3',
        title: 'Revisão dos termos de uso e políticas de privacidade',
        priority: 'critica',
        status: 'em-revisao',
        dueDate: '26 Jul',
        assignees: [{ id: 'ana', name: 'Ana Carol', avatar: 'https://i.pravatar.cc/48?img=9' }]
      },
      {
        id: 'port-add-4',
        title: 'Criação do guia de ajuda e FAQ',
        priority: 'baixa',
        status: 'concluido',
        dueDate: '20 Mai',
        assignees: [{ id: 'igor', name: 'Igor Pinto', avatar: 'https://i.pravatar.cc/48?img=15' }]
      },
      {
        id: 'port-add-5',
        title: 'Integração com sistema de Ouvidoria / Ticket centralizado',
        priority: 'alta',
        status: 'em-andamento',
        dueDate: '22 Jul',
        progress: 15,
        assignees: [{ id: 'beatriz', name: 'Beatriz Ribeiro', avatar: 'https://i.pravatar.cc/48?img=20' }]
      },
      {
        id: 'port-add-6',
        title: 'Possibilidade de login com redes sociais (Google/Apple ID)',
        priority: 'media',
        status: 'bloqueado',
        note: 'Aguardando credenciais oficiais da Apple Developer Account',
        dueDate: '18 Jul',
        assignees: [{ id: 'gabriel', name: 'Gabriel Alves', avatar: 'https://i.pravatar.cc/48?img=51' }]
      },
      {
        id: 'port-add-7',
        title: 'Excluir conta / Termo de esquecimento (LGPD)',
        priority: 'alta',
        status: 'bloqueado',
        note: 'Aguardando validação jurídica do time de DPO',
        dueDate: '25 Jul',
        assignees: [{ id: 'daniel', name: 'Daniel Macena', avatar: 'https://i.pravatar.cc/48?img=12' }]
      }
    ]
  }

  const otherPeopleTasks = additionalTasksMap[projName] || []

  // Junta as tarefas do colaborador com as das outras pessoas
  let list = [...myTasks, ...otherPeopleTasks]

  // Aplicar busca e filtros se necessários
  if (search.value.trim()) {
    const term = search.value.trim().toLowerCase()
    list = list.filter((t) => t.title.toLowerCase().includes(term))
  }
  if (priorityFilter.value !== 'Todas') {
    const pKey = priorityFilter.value.toLowerCase()
    list = list.filter((t) => t.priority === pKey)
  }

  return list
})
</script>

<template>
  <div class="space-y-5 p-4 sm:p-6 dark:bg-slate-900 min-h-screen">
    <!-- Cabeçalho -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Quadros</h1>
        <p class="text-sm text-slate-400">Acompanhe o andamento das tarefas e do projeto</p>
      </div>

      <UPopover v-model:open="projectOpen">
        <button
          type="button"
          class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition-colors hover:border-violet-300 hover:bg-violet-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800"
        >
          <span
            class="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-900/40"
          >
            <UIcon name="i-heroicons-briefcase" class="size-5" />
          </span>
          <span class="text-left leading-tight">
            <span class="block text-xs text-slate-400">Projeto</span>
            <span class="block max-w-[12rem] truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {{ selectedProject?.name }}
            </span>
          </span>
          <UIcon name="i-heroicons-chevron-down" class="size-4 shrink-0 text-slate-400" />
        </button>

        <template #content>
          <ul class="max-h-64 w-72 overflow-y-auto scroll-thin py-1">
            <li v-for="p in projects" :key="p.id">
              <button
                type="button"
                class="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30"
                :class="selectedProjectId === p.id ? 'bg-violet-50 font-semibold text-violet-700 dark:bg-violet-950/30' : 'text-slate-700 dark:text-slate-200'"
                @click="selectedProjectId = p.id; projectOpen = false"
              >
                <span class="size-2.5 shrink-0 rounded-full" :class="p.color" />
                <span class="min-w-0 flex-1 truncate">{{ p.name }}</span>
                <UIcon
                  v-if="selectedProjectId === p.id"
                  name="i-heroicons-check"
                  class="size-4 shrink-0 text-violet-600"
                />
              </button>
            </li>
          </ul>
        </template>
      </UPopover>
    </div>

    <!-- Abas -->
    <div class="flex gap-6 border-b border-slate-200 dark:border-slate-800">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors"
        :class="
          activeTab === tab.key
            ? 'border-violet-500 text-violet-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'
        "
        @click="activeTab = tab.key"
      >
        <UIcon :name="tab.icon" class="size-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Sub-filtros -->
    <div class="flex flex-wrap items-center gap-3">
      <UiLabeledSelect v-model="teamFilter" label="Equipe:" :items="['Todas']" class="w-40" />
      <UiLabeledSelect v-model="responsibleFilter" label="Responsável:" :items="['Todos']" class="w-44" />
      <UiLabeledSelect v-model="priorityFilter" label="Prioridade:" :items="['Todas', 'Critica', 'Alta', 'Media', 'Baixa']" class="w-40" />
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass"
        placeholder="Buscar Tarefa"
        class="w-full sm:w-56"
      />
    </div>

    <!-- Conteúdo da aba -->
    <QuadrosKanbanBoard v-if="activeTab === 'kanban'" :tasks="selectedProjectTasks" />
    <QuadrosGanttChart v-else-if="activeTab === 'timeline'" :tasks="selectedProjectTasks" />
  </div>
</template>
