<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CalendarEvent, PriorityKey, Task } from '~/types'
import { FICTITIOUS_USERS } from '~/composables/useRankingSystem'
import { formatMonthLabel, MONTHS_SHORT } from '~/utils/date'

definePageMeta({ sidebarWidget: 'none' })

const projects = useUserProjects()
const currentProject = useCurrentProject()
const currentUser = useCurrentUser()
const selectedProjectIds = ref<string[]>([
  projects.find((project) => project.name === currentProject.name)?.id ?? projects[0]?.id,
].filter((id): id is string => Boolean(id)))

const tabs = [
  { key: 'lista', label: 'Lista', icon: 'i-heroicons-list-bullet' },
  { key: 'kanban', label: 'Kanban', icon: 'i-heroicons-squares-2x2' },
  { key: 'timeline', label: 'Gantt', icon: 'i-heroicons-bars-3-bottom-left' },
  { key: 'calendario', label: 'Calendário', icon: 'i-heroicons-calendar-days' },
]
const activeTab = ref('lista')
const calendarCurrent = ref({ year: 2026, month: 4 })

const responsibleFilter = ref('Todos')
const selectedPriorities = ref<PriorityKey[]>([])
const search = ref('')
const searchOpen = ref(false)
const projectFilterOpen = ref(false)
const priorityFilterOpen = ref(false)

const hasProjectFilter = computed(() => selectedProjectIds.value.length > 0)
const projectFilterLabel = computed(() => {
  const count = selectedProjectIds.value.length
  if (count === 0) return 'Todos'
  if (count === 1) return projects.find((project) => project.id === selectedProjectIds.value[0])?.name ?? '1 projeto'
  return `${count} projetos`
})

function isProjectSelected(projectId: string): boolean {
  return selectedProjectIds.value.includes(projectId)
}

function toggleProjectFilter(projectId: string) {
  selectedProjectIds.value = isProjectSelected(projectId)
    ? selectedProjectIds.value.filter((id) => id !== projectId)
    : [...selectedProjectIds.value, projectId]
}

function clearProjectFilter() {
  selectedProjectIds.value = []
}

const priorityOptions = usePriorityList()
const priorityFlagColor: Record<PriorityKey, string> = {
  critica: 'text-red-500',
  alta: 'text-violet-500',
  media: 'text-amber-500',
  baixa: 'text-blue-500',
}
const hasPriorityFilter = computed(() => selectedPriorities.value.length > 0)
const responsibleOptions = computed(() => [
  'Todos',
  currentUser.name,
  ...FICTITIOUS_USERS.map((user) => user.name),
])
const priorityFilterLabel = computed(() => {
  const count = selectedPriorities.value.length
  if (count === 0) return 'Todas'
  if (count === 1) return usePriorityMeta(selectedPriorities.value[0]).label
  return `${count} prioridades`
})

function isPrioritySelected(priority: PriorityKey): boolean {
  return selectedPriorities.value.includes(priority)
}

function togglePriorityFilter(priority: PriorityKey) {
  selectedPriorities.value = isPrioritySelected(priority)
    ? selectedPriorities.value.filter((item) => item !== priority)
    : [...selectedPriorities.value, priority]
}

function clearPriorityFilter() {
  selectedPriorities.value = []
}

function closeSearchWhenEmpty() {
  if (!search.value.trim()) searchOpen.value = false
}

function clearSearch() {
  search.value = ''
  searchOpen.value = false
}

// Obter tarefas do colaborador
const allCollaboratorTasks = useTasksData()

/** Demandas do time para a visualização consolidada — não pertencem à Costa Neves. */
const fictionalTaskTitles = [
  'Mapear jornadas de compra do novo catálogo',
  'Revisar acessibilidade dos componentes de checkout',
  'Criar cenários de teste para pagamento parcelado',
  'Documentar contratos da API de pedidos',
  'Ajustar mensagens de erro do carrinho',
  'Validar layout da página de categoria',
  'Monitorar tempo de resposta da busca',
  'Planejar campanha de recuperação de carrinho',
  'Atualizar inventário de integrações externas',
  'Preparar guia de operação para o atendimento',
  'Revisar permissões do painel administrativo',
  'Criar painel de pedidos com risco de atraso',
  'Homologar fluxo de troca e devolução',
  'Otimizar imagens do catálogo para mobile',
  'Configurar alertas de estoque mínimo',
  'Consolidar métricas do funil de vendas',
  'Validar regras fiscais por estado',
  'Organizar sessão de testes com clientes',
  'Revisar textos do e-mail transacional',
  'Implementar rastreio de eventos de conversão',
  'Criar rotina de conferência de pedidos pagos',
  'Auditar dependências do front-end',
  'Ajustar filtros avançados de produtos',
  'Desenhar fluxo de aprovação de descontos',
  'Documentar processo de publicação de ofertas',
  'Investigar divergência no cálculo de frete',
  'Preparar relatório semanal do marketplace',
  'Validar dados de importação de produtos',
  'Configurar ambiente de testes de integração',
  'Revisar política de privacidade do portal',
  'Criar checklist de lançamento de campanha',
  'Corrigir inconsistência de preços promocionais',
  'Planejar melhorias da central de ajuda',
  'Avaliar desempenho do fluxo de cadastro',
  'Registrar decisões técnicas da sprint',
] as const

const fictionalTeamTasks = computed<Task[]>(() => fictionalTaskTitles.map((title, index) => ({
  id: `team-fictional-${index + 1}`,
  title,
  project: projects[index % projects.length]!.name,
  team: 'Equipe do projeto',
  priority: (['alta', 'media', 'baixa', 'critica'] as PriorityKey[])[index % 4]!,
  status: (['a-fazer', 'em-andamento', 'em-revisao', 'validar', 'concluido'] as const)[index % 5]!,
  dueDate: `${String((index % 25) + 1).padStart(2, '0')} Jul`,
  assignees: [FICTITIOUS_USERS[index % FICTITIOUS_USERS.length]!],
  progress: index % 5 === 1 ? 45 : index % 5 === 2 ? 75 : undefined,
})))

// Mapeamento dinâmico de tarefas do colaborador + outras pessoas por projeto
const selectedProjectTasks = computed(() => {
  const additionalTasksMap: Record<string, Task[]> = {
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

  const projectsToDisplay = hasProjectFilter.value
    ? projects.filter((project) => isProjectSelected(project.id))
    : projects

  // Mantém a autoria real das tarefas do colaborador. As tarefas adicionais
  // representam demandas distintas de colegas fictícios do ranking.
  let list = projectsToDisplay.flatMap((project, projectIndex) => {
    const myTasks = allCollaboratorTasks.filter(
      (task) => !task.personal && task.project === project.name,
    )
    const otherPeopleTasks = additionalTasksMap[project.name] || []
    const generatedTeamTasks = fictionalTeamTasks.value.filter((task) => task.project === project.name)
    const fictionalTasks = otherPeopleTasks.map((task, taskIndex) => ({
      ...task,
      project: project.name,
      assignees: [FICTITIOUS_USERS[(projectIndex * 7 + taskIndex) % FICTITIOUS_USERS.length]],
    }))
    // Alterna tarefas próprias e do time para que a visão já mostre os
    // diferentes responsáveis sem exigir rolagem.
    const visibleTasks: Task[] = []
    const taskCount = Math.max(myTasks.length, fictionalTasks.length + generatedTeamTasks.length)
    const teamTasks = [...fictionalTasks, ...generatedTeamTasks]
    for (let index = 0; index < taskCount; index++) {
      if (myTasks[index]) visibleTasks.push(myTasks[index])
      if (teamTasks[index]) visibleTasks.push(teamTasks[index])
    }
    return visibleTasks
  })

  // Aplicar busca e filtros se necessários
  if (search.value.trim()) {
    const term = search.value.trim().toLowerCase()
    list = list.filter((t) => t.title.toLowerCase().includes(term))
  }
  if (hasPriorityFilter.value) {
    list = list.filter((task) => selectedPriorities.value.includes(task.priority))
  }
  if (responsibleFilter.value !== 'Todos') {
    list = list.filter((task) => task.assignees.some((assignee) => assignee.name === responsibleFilter.value))
  }

  return list
})

const calendarLabel = computed(() => formatMonthLabel(calendarCurrent.value.year, calendarCurrent.value.month))
const calendarEvents = computed<CalendarEvent[]>(() => selectedProjectTasks.value.flatMap((task) => {
  if (!task.dueDate) return []
  const [dayText, monthText] = task.dueDate.split(' ')
  const startDay = Number(dayText)
  const month = MONTHS_SHORT.findIndex((item) => item.toLowerCase() === monthText?.slice(0, 3).toLowerCase())
  if (!Number.isInteger(startDay) || startDay < 1 || month !== calendarCurrent.value.month) return []

  const colorByPriority: Record<PriorityKey, CalendarEvent['color']> = {
    critica: 'pink', alta: 'violet', media: 'blue', baixa: 'green',
  }
  return [{ id: task.id, title: task.title, startDay, length: 1, color: colorByPriority[task.priority] }]
}))

function shiftCalendarMonth(delta: number) {
  const date = new Date(calendarCurrent.value.year, calendarCurrent.value.month + delta, 1)
  calendarCurrent.value = { year: date.getFullYear(), month: date.getMonth() }
}

function goToCurrentMonth() {
  const now = new Date()
  calendarCurrent.value = { year: now.getFullYear(), month: now.getMonth() }
}
</script>

<template>
  <div class="space-y-5 p-4 sm:p-6">
    <!-- Cabeçalho -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Visualização de tarefas</h1>
        <p class="text-sm text-slate-400">Acompanhe as tarefas de todos os projetos e equipes dos quais você faz parte</p>
      </div>

    </div>

    <!-- Abas -->
    <div class="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="relative -mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors"
        :class="
          activeTab === tab.key
            ? 'border-violet-500 text-slate-700 dark:text-slate-100'
            : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        "
        @click="activeTab = tab.key"
      >
        <UIcon
          :name="tab.icon"
          class="size-4"
          :class="{
            'text-violet-500': tab.key === 'lista',
            'text-sky-500': tab.key === 'kanban',
            'text-rose-500': tab.key === 'timeline',
            'text-amber-500': tab.key === 'calendario',
          }"
        />
        {{ tab.label }}
      </button>
    </div>

    <!-- Área de Controles (Busca + Filtros) -->
    <div class="space-y-2.5 mt-5">
      <!-- Busca recolhível, igual à página Minhas Tarefas. -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <div v-if="searchOpen" class="relative w-full sm:w-[480px] lg:w-[520px] xl:w-[560px]">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Buscar tarefa..."
            size="lg"
            autofocus
            class="w-full"
            @blur="closeSearchWhenEmpty"
            @keydown.esc="clearSearch"
          />
          <button
            v-if="search"
            type="button"
            class="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Limpar busca"
            @click="clearSearch"
          >
            <UIcon name="i-heroicons-x-mark" class="size-4" />
          </button>
        </div>
      </Transition>

      <!-- Filtros -->
      <div class="flex flex-nowrap items-center justify-start gap-1.5 py-1 w-full overflow-x-auto hide-scrollbar">
        <button
          type="button"
          class="flex size-[30px] shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"
          :class="searchOpen && 'bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-300'"
          aria-label="Buscar tarefa"
          title="Buscar tarefa"
          @click="searchOpen = true"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="size-3.5" />
        </button>
        <!-- Projeto (seleção múltipla) -->
        <UPopover v-model:open="projectFilterOpen">
          <button
            type="button"
            class="flex h-[30px] shrink-0 items-center rounded-md border border-slate-200 bg-white px-1.5 shadow-sm transition-all hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900"
            :class="hasProjectFilter && 'border-violet-300 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20'"
            aria-label="Filtrar por projeto"
          >
            <UIcon name="i-heroicons-folder" class="mr-1 size-3.5 shrink-0 text-violet-500" />
            <span class="mr-1 hidden whitespace-nowrap text-[11px] text-slate-500 pointer-events-none md:inline xl:text-[12px]">Projeto:</span>
            <span class="max-w-24 truncate pr-3 text-[11px] font-medium text-slate-700 dark:text-slate-200 xl:text-[12px]">{{ projectFilterLabel }}</span>
            <UIcon name="i-heroicons-chevron-down" class="size-3 shrink-0 text-slate-400" />
          </button>

          <template #content>
            <div class="w-72 p-1.5">
              <div class="flex items-center justify-between px-2 py-1.5">
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Filtrar projetos</span>
                <button
                  v-if="hasProjectFilter"
                  type="button"
                  class="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
                  @click="clearProjectFilter"
                >
                  Limpar filtros
                </button>
              </div>
              <p class="px-2 pb-1.5 text-[11px] text-slate-400">Sem seleção, todos os projetos são exibidos.</p>
              <ul class="max-h-64 overflow-y-auto scroll-thin">
                <li v-for="project in projects" :key="project.id">
                  <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30"
                    :class="isProjectSelected(project.id) && 'bg-violet-50 dark:bg-violet-950/30'"
                    @click="toggleProjectFilter(project.id)"
                  >
                    <span class="size-2.5 shrink-0 rounded-full" :class="project.color" />
                    <span class="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200">{{ project.name }}</span>
                    <span
                      class="flex size-4 shrink-0 items-center justify-center rounded border"
                      :class="isProjectSelected(project.id) ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 dark:border-slate-600'"
                    >
                      <UIcon v-if="isProjectSelected(project.id)" name="i-heroicons-check" class="size-3" />
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </template>
        </UPopover>

        <!-- Responsável -->
        <div class="flex items-center h-[30px] px-1.5 rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-violet-300 shadow-sm relative group cursor-pointer shrink">
          <UIcon name="i-heroicons-user" class="size-3.5 text-violet-500 shrink-0 mr-1" />
          <span class="text-[11px] xl:text-[12px] text-slate-500 whitespace-nowrap mr-1 pointer-events-none hidden md:inline">Responsável:</span>
          <select v-model="responsibleFilter" class="appearance-none bg-transparent text-[11px] xl:text-[12px] font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer pr-4 w-16 sm:w-20 lg:w-24 text-ellipsis overflow-hidden whitespace-nowrap">
            <option v-for="item in responsibleOptions" :key="item" :value="item">{{ item }}</option>
          </select>
          <UIcon name="i-heroicons-chevron-down" class="size-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-violet-500 transition-colors" />
        </div>

        <!-- Prioridade -->
        <UPopover v-model:open="priorityFilterOpen">
          <button
            type="button"
            class="flex h-[30px] shrink-0 items-center rounded-md border border-slate-200 bg-white px-1.5 shadow-sm transition-all hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900"
            :class="hasPriorityFilter && 'border-violet-300 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20'"
            aria-label="Filtrar por prioridade"
          >
            <UIcon name="i-heroicons-flag" class="mr-1 size-3.5 shrink-0 text-violet-500" />
            <span class="mr-1 hidden whitespace-nowrap text-[11px] text-slate-500 pointer-events-none md:inline xl:text-[12px]">Prioridade:</span>
            <span class="max-w-24 truncate pr-3 text-[11px] font-medium text-slate-700 dark:text-slate-200 xl:text-[12px]">{{ priorityFilterLabel }}</span>
            <UIcon name="i-heroicons-chevron-down" class="size-3 shrink-0 text-slate-400" />
          </button>

          <template #content>
            <div class="w-64 p-1.5">
              <div class="flex items-center justify-between px-2 py-1.5">
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Filtrar prioridades</span>
                <button
                  v-if="hasPriorityFilter"
                  type="button"
                  class="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
                  @click="clearPriorityFilter"
                >
                  Limpar filtros
                </button>
              </div>
              <p class="px-2 pb-1.5 text-[11px] text-slate-400">Sem seleção, todas as prioridades são exibidas.</p>
              <ul>
                <li v-for="priority in priorityOptions" :key="priority">
                  <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/30"
                    :class="isPrioritySelected(priority) && 'bg-violet-50 dark:bg-violet-950/30'"
                    @click="togglePriorityFilter(priority)"
                  >
                    <UIcon
                      name="i-heroicons-flag-20-solid"
                      class="size-4 shrink-0"
                      :class="priorityFlagColor[priority]"
                    />
                    <span class="min-w-0 flex-1 text-slate-700 dark:text-slate-200">{{ usePriorityMeta(priority).label }}</span>
                    <span
                      class="flex size-4 shrink-0 items-center justify-center rounded border"
                      :class="isPrioritySelected(priority) ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 dark:border-slate-600'"
                    >
                      <UIcon v-if="isPrioritySelected(priority)" name="i-heroicons-check" class="size-3" />
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </template>
        </UPopover>

        <div class="flex-grow"></div>
        <button class="flex items-center gap-1 h-[30px] px-2 rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-violet-300 hover:text-violet-600 shadow-sm text-[11px] xl:text-[12px] font-medium text-slate-700 dark:text-slate-200 shrink-0">
          <UIcon name="i-heroicons-funnel" class="size-3.5 text-violet-500" />
          Filtros
          <span class="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-100 px-1 text-[9px] font-bold text-violet-600 dark:bg-violet-900 dark:text-violet-300">{{ Number(hasProjectFilter) + Number(hasPriorityFilter) }}</span>
        </button>
      </div>
    </div>

    <!-- Conteúdo da aba -->
    <TarefasTaskTable v-if="activeTab === 'lista'" :tasks="selectedProjectTasks" readonly />
    <QuadrosKanbanBoard v-else-if="activeTab === 'kanban'" :tasks="selectedProjectTasks" all-statuses />
    <QuadrosGanttChart v-else-if="activeTab === 'timeline'" :tasks="selectedProjectTasks" />
    <div v-else class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-lg font-semibold text-slate-700 dark:text-slate-200">{{ calendarLabel }}</h2>
        <div class="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900">
          <UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-chevron-left" aria-label="Mês anterior" @click="shiftCalendarMonth(-1)" />
          <UButton variant="ghost" size="sm" label="Hoje" class="font-semibold text-violet-600" @click="goToCurrentMonth" />
          <UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-chevron-right" aria-label="Próximo mês" @click="shiftCalendarMonth(1)" />
        </div>
      </div>
      <CalendarioCalendarMonth :year="calendarCurrent.year" :month="calendarCurrent.month" :events="calendarEvents" />
    </div>
  </div>
</template>
