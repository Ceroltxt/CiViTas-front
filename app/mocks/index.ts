/**
 * Dados mock do app — fonte única enquanto não há backend.
 *
 * Estes objetos representam o JSON "cru" que cada endpoint deverá devolver no
 * futuro. Eles são usados como fallback pela camada de serviços (`~/services`)
 * e validados pelos mesmos schemas das respostas reais (`~/schemas`), então
 * seguem exatamente o contrato esperado da API.
 *
 * Para a pessoa de backend: o formato de cada constante aqui é o formato que o
 * endpoint correspondente precisa retornar.
 */
import type {
  AgendaItem,
  AuditLog,
  CalendarEvent,
  CurrentProject,
  DashboardMetric,
  NavItem,
  NotificationItem,
  ProjectDetail,
  ProjectProgress,
  RankingEntry,
  Task,
  TeamDetail,
  TeamSummary,
  TimelineGroup,
  UserSummary,
} from '~/types'
import { getNavigationForRole, resolveAppRole } from '~/utils/navigation'

/* ---------------------------------------------------------------- Pessoas */

/** Colaboradores usados nas tarefas / quadros. */
const PEOPLE: Record<string, UserSummary> = {
  ana: { id: 'ana', name: 'Ana Carol', avatar: 'https://i.pravatar.cc/48?img=9' },
  beatriz: { id: 'beatriz', name: 'Beatriz Ribeiro', avatar: 'https://i.pravatar.cc/48?img=20' },
  cecilia: { id: 'cecilia', name: 'Cecília Neves', avatar: 'https://i.pravatar.cc/48?img=25' },
  daniel: { id: 'daniel', name: 'Daniel Macena', avatar: 'https://i.pravatar.cc/48?img=12' },
  eduardo: { id: 'eduardo', name: 'Eduardo Lima', avatar: 'https://i.pravatar.cc/48?img=33' },
  fernanda: { id: 'fernanda', name: 'Fernanda Souza', avatar: 'https://i.pravatar.cc/48?img=47' },
  gabriel: { id: 'gabriel', name: 'Gabriel Alves', avatar: 'https://i.pravatar.cc/48?img=51' },
  helena: { id: 'helena', name: 'Helena Dias', avatar: 'https://i.pravatar.cc/48?img=44' },
  igor: { id: 'igor', name: 'Igor Pinto', avatar: 'https://i.pravatar.cc/48?img=15' },
  dimitri: { id: 'dimitri', name: 'Dimitri Brito', avatar: 'https://i.pravatar.cc/48?img=13' },
}

/* ----------------------------------------------------------- Usuário/conta */

export const mockCurrentUser: UserSummary = {
  id: 'u-costa',
  name: 'Costa Neves',
  role: 'Colaborador',
  avatar: 'https://i.pravatar.cc/80?img=47',
}

export const mockCurrentProject: CurrentProject = {
  name: 'Plataforma E-commerce',
  deadline: '25 de Dez. 2026',
  progress: 90,
}

export const mockProjectDetail: ProjectDetail = {
  name: 'Plataforma E-commerce',
  deadline: '25 de Dez. 2026',
  progress: 90,
  description: 'Desenvolvimento da plataforma de e-commerce com painel administrativo, catálogo de produtos, pagamentos e gestão de pedidos.',
  daysRemaining: 198,
  totalTasks: 45,
  priority: 'alta',
  taskStatus: { completed: 41, inProgress: 3, pending: 1 },
  progressTimeline: [
    { month: 'Jan', value: 10 },
    { month: 'Mar', value: 25 },
    { month: 'Mai', value: 42 },
    { month: 'Jul', value: 58 },
    { month: 'Set', value: 72 },
    { month: 'Nov', value: 85 },
    { month: 'Dez', value: 90 },
  ],
}

/* -------------------------------------------------------------- Navegação */

/** Menu lateral — alinhado ao perfil de `mockCurrentUser` (mesmo contrato da API `/navigation`). */
export const mockNavigation: NavItem[] = getNavigationForRole(resolveAppRole(mockCurrentUser.role))

/* ----------------------------------------------------------- Notificações */

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    icon: 'i-heroicons-clipboard-document',
    iconColor: 'text-pink-600 bg-pink-100',
    title: 'Nova tarefa atribuída',
    description: 'Você tem uma nova tarefa',
    time: 'Hoje, 10:24',
    unread: true,
  },
  {
    id: 'n2',
    icon: 'i-heroicons-check-circle',
    iconColor: 'text-emerald-600 bg-emerald-100',
    title: 'Tarefa concluída',
    description: '"Integração API" foi marcada como concluída',
    time: 'Ontem, 09:14',
    unread: true,
  },
  {
    id: 'n3',
    icon: 'i-heroicons-clock',
    iconColor: 'text-amber-600 bg-amber-100',
    title: 'Prazo se aproximando',
    description: '"Revisar protótipo da dashboard" vence amanhã',
    time: 'Amanhã, 16:10',
    unread: false,
  },
  {
    id: 'n4',
    icon: 'i-heroicons-chat-bubble-left-ellipsis',
    iconColor: 'text-blue-600 bg-blue-100',
    title: 'Novo comentário',
    description: 'Bruno Rocha comentou em "Implementação De Devops"',
    time: 'Ontem, 17:42',
    unread: false,
  },
  {
    id: 'n5',
    icon: 'i-heroicons-user-plus',
    iconColor: 'text-violet-600 bg-violet-100',
    title: 'Adicionado à equipe',
    description: 'Você foi adicionado à equipe "Devops"',
    time: 'Ontem, 14:08',
    unread: false,
  },
  {
    id: 'n6',
    icon: 'i-heroicons-calendar-days',
    iconColor: 'text-indigo-600 bg-indigo-100',
    title: 'Reunião agendada',
    description: 'Alinhamento semanal marcado para sexta, 10:00',
    time: 'Ontem, 11:30',
    unread: false,
  },
  {
    id: 'n7',
    icon: 'i-heroicons-arrow-path',
    iconColor: 'text-cyan-600 bg-cyan-100',
    title: 'Status atualizado',
    description: '"Plataforma E-commerce" passou para Em revisão',
    time: '27/05, 18:20',
    unread: false,
  },
  {
    id: 'n8',
    icon: 'i-heroicons-exclamation-triangle',
    iconColor: 'text-red-600 bg-red-100',
    title: 'Tarefa em atraso',
    description: '"Validação de requisitos" passou do prazo',
    time: '27/05, 09:05',
    unread: false,
  },
]

/* --------------------------------------------------------- Dashboard/Início */

/** Métricas (somente os valores; ícones e cores ficam no front-end). */
export const mockDashboardMetrics: DashboardMetric[] = [
  { id: 'atribuidas', label: 'Tarefas Atribuídas', value: '12' },
  { id: 'andamento', label: 'Em Andamento', value: '4' },
  { id: 'atraso', label: 'Em Atraso', value: '1' },
  { id: 'produtividade', label: 'Produtividade', value: '78%' },
]

export const mockAgenda: AgendaItem[] = [
  {
    id: 'a1',
    time: '09:00',
    title: 'Revisão do pipeline CI/CD',
    description: 'Plataforma E-commerce',
    dotColor: 'bg-orange-400',
    tag: { label: 'Urgência', color: 'text-rose-500 bg-rose-100' },
    eventId: 'e-today-1',
  },
  {
    id: 'a2',
    time: '11:00',
    title: 'Daily standup com DevOps',
    description: 'Equipe DevOps · Civitas Mobile',
    dotColor: 'bg-orange-400',
    tag: { label: 'Média', color: 'text-orange-500 bg-orange-100' },
    eventId: 'e-today-2',
  },
  {
    id: 'a3',
    time: '14:00',
    title: 'Alinhamento com Product Owner',
    description: 'Portal do Cliente',
    dotColor: 'bg-fuchsia-500',
    tag: { label: 'Reunião', color: 'text-blue-600 bg-blue-200' },
    eventId: 'e-today-3',
  },
  {
    id: 'a4',
    time: '15:00',
    title: 'Code review da API de autenticação',
    description: 'App de Gestão Produtiva Corp.',
    dotColor: 'bg-orange-400',
    tag: { label: 'Reunião', color: 'text-blue-600 bg-blue-200' },
    eventId: 'e-today-4',
  },
]

export const mockRanking: RankingEntry[] = [
  { position: 1, user: { id: 'r1', name: 'Juliana Costa', avatar: 'https://i.pravatar.cc/64?img=5' }, points: 27800 },
  { position: 2, user: { id: 'r2', name: 'Bruno Rocha', avatar: 'https://i.pravatar.cc/64?img=12' }, points: 26450 },
  { position: 3, user: { id: 'r3', name: 'Ana Carolyne', avatar: 'https://i.pravatar.cc/64?img=9' }, points: 25900 },
  { position: 4, user: { id: 'r4', name: 'Pedro Nascimento', avatar: 'https://i.pravatar.cc/64?img=15' }, points: 24300 },
  { position: 5, user: { id: 'r5', name: 'Beatriz Milani', avatar: 'https://i.pravatar.cc/64?img=20' }, points: 23150 },
]

/** Posição do usuário atual no ranking (exibida separadamente no rodapé). */
export const mockCurrentUserRank: RankingEntry = {
  position: 21,
  user: mockCurrentUser,
  points: 12400,
}

export const mockProjects: ProjectProgress[] = [
  { id: 'p1', name: 'Plataforma E-commerce', progress: 45, color: 'bg-blue-500' },
  { id: 'p2', name: 'Civitas Mobile', progress: 77, color: 'bg-violet-500' },
  { id: 'p3', name: 'Plataforma MEI', progress: 45, color: 'bg-amber-400' },
  { id: 'p4', name: 'App de Gestão Produtiva Corp.', progress: 45, color: 'bg-pink-500' },
  { id: 'p5', name: 'Sistema de Logística', progress: 62, color: 'bg-cyan-500' },
  { id: 'p6', name: 'Portal do Cliente', progress: 30, color: 'bg-indigo-500' },
]

const teamMembers: UserSummary[] = [
  { id: 'm1', name: 'Membro 1', avatar: 'https://i.pravatar.cc/48?img=32' },
  { id: 'm2', name: 'Membro 2', avatar: 'https://i.pravatar.cc/48?img=33' },
  { id: 'm3', name: 'Membro 3', avatar: 'https://i.pravatar.cc/48?img=34' },
]

export const mockTeams: TeamSummary[] = [
  {
    id: 't1',
    name: 'BackEnd',
    initial: 'B',
    color: 'bg-violet-600',
    description: '1 Colaborador · 14 Tarefas',
    members: teamMembers,
  },
  {
    id: 't2',
    name: 'FrontEnd',
    initial: 'F',
    color: 'bg-emerald-500',
    description: '3 Colaboradores · 22 Tarefas',
    members: teamMembers,
  },
  {
    id: 't3',
    name: 'DataBase',
    initial: 'D',
    color: 'bg-blue-500',
    description: '2 Colaboradores · 9 Tarefas',
    members: teamMembers,
  },
  {
    id: 't4',
    name: 'Criptografia',
    initial: 'C',
    color: 'bg-orange-500',
    description: '2 Colaboradores · 6 Tarefas',
    members: teamMembers,
  },
]

/* -------------------------------------------------------------- Tarefas */

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Implementar autenticação JWT',
    priority: 'alta',
    status: 'em-andamento',
    project: 'App de Gestão Produtiva Corp.',
    team: 'Backend',
    dueDate: '25 Mai',
    projectProgress: 45,
    progress: 45,
    assignees: [PEOPLE.ana, PEOPLE.beatriz, PEOPLE.cecilia],
  },
  {
    id: 't2',
    title: 'Integrar gateway de pagamento',
    priority: 'alta',
    status: 'em-andamento',
    project: 'Plataforma E-commerce',
    team: 'Backend',
    dueDate: '16 Jun',
    projectProgress: 45,
    progress: 75,
    assignees: [PEOPLE.daniel, PEOPLE.eduardo, PEOPLE.fernanda],
  },
  {
    id: 't3',
    title: 'Modelar banco de dados de pedidos',
    priority: 'media',
    status: 'em-andamento',
    project: 'Sistema de Logística',
    team: 'Backend',
    dueDate: '25 Mai',
    projectProgress: 62,
    progress: 45,
    assignees: [PEOPLE.gabriel, PEOPLE.helena, PEOPLE.igor],
  },
  {
    id: 't4',
    title: 'Refatorar dashboard de métricas',
    priority: 'media',
    status: 'em-andamento',
    project: 'Civitas Mobile',
    team: 'Frontend',
    dueDate: '16 Jun',
    projectProgress: 77,
    progress: 75,
    assignees: [PEOPLE.beatriz, PEOPLE.daniel, PEOPLE.gabriel],
  },
  {
    id: 't5',
    title: 'Criar serviço de notificações',
    priority: 'media',
    status: 'em-andamento',
    project: 'Plataforma MEI',
    team: 'Backend',
    dueDate: '8 Jun',
    projectProgress: 45,
    progress: 49,
    assignees: [PEOPLE.ana, PEOPLE.eduardo, PEOPLE.helena],
  },
  {
    id: 't6',
    title: 'Documentar endpoints da API',
    priority: 'baixa',
    status: 'planejado',
    project: 'Portal do Cliente',
    team: 'Backend',
    dueDate: '21 Jun',
    projectProgress: 0,
    notStarted: true,
    progress: 0,
    assignees: [PEOPLE.cecilia, PEOPLE.fernanda, PEOPLE.igor],
  },
  {
    id: 't7',
    title: 'Otimizar consultas do banco',
    priority: 'baixa',
    status: 'planejado',
    project: 'Data Warehouse',
    team: 'Backend',
    dueDate: '27 Jul',
    projectProgress: 0,
    notStarted: true,
    progress: 0,
    assignees: [PEOPLE.beatriz, PEOPLE.eduardo, PEOPLE.gabriel],
  },
  {
    id: 't8',
    title: 'Setup inicial do repositório Git',
    priority: 'alta',
    status: 'concluido',
    project: 'App de Gestão Produtiva Corp.',
    team: 'DevOps',
    dueDate: '12 Mai',
    progress: 100,
    assignees: [PEOPLE.daniel, PEOPLE.gabriel],
  },
  {
    id: 't9',
    title: 'Prototipação das telas no Figma',
    priority: 'media',
    status: 'concluido',
    project: 'Civitas Mobile',
    team: 'Frontend',
    dueDate: '05 Mai',
    progress: 100,
    assignees: [PEOPLE.beatriz, PEOPLE.helena],
  },
  {
    id: 't10',
    title: 'Levantamento de requisitos do produto',
    priority: 'alta',
    status: 'concluido',
    project: 'Sistema de Logística',
    team: 'Backend',
    dueDate: '28 Abr',
    progress: 100,
    assignees: [PEOPLE.ana, PEOPLE.igor, PEOPLE.eduardo],
  },
  {
    id: 't11',
    title: 'Configuração do ambiente de homologação',
    priority: 'baixa',
    status: 'concluido',
    project: 'Plataforma E-commerce',
    team: 'DevOps',
    dueDate: '20 Abr',
    progress: 100,
    assignees: [PEOPLE.cecilia, PEOPLE.fernanda],
  },
  {
    id: 't12',
    title: 'Corrigir cálculo de frete no checkout',
    priority: 'alta',
    status: 'atrasado',
    project: 'Plataforma E-commerce',
    team: 'Backend',
    dueDate: '15 Abr',
    progress: 30,
    note: 'Atrasada há 6 semanas',
    assignees: [PEOPLE.daniel, PEOPLE.igor],
  },
  {
    id: 't13',
    title: 'Revisar contrato da API de parceiros',
    priority: 'alta',
    status: 'atrasado',
    project: 'Portal do Cliente',
    team: 'Backend',
    dueDate: '02 Mai',
    progress: 55,
    note: 'Atrasada há 4 semanas',
    assignees: [PEOPLE.ana, PEOPLE.eduardo],
  },
  {
    id: 't14',
    title: 'Migrar uploads de imagem para a CDN',
    priority: 'media',
    status: 'atrasado',
    project: 'Civitas Mobile',
    team: 'DevOps',
    dueDate: '08 Mai',
    progress: 40,
    note: 'Atrasada há 3 semanas',
    assignees: [PEOPLE.gabriel, PEOPLE.helena],
  },
  {
    id: 't15',
    title: 'Ajustar acessibilidade do formulário',
    priority: 'baixa',
    status: 'atrasado',
    project: 'Data Warehouse',
    team: 'Frontend',
    dueDate: '19 Mai',
    progress: 15,
    note: 'Atrasada há 1 semana',
    assignees: [PEOPLE.beatriz, PEOPLE.cecilia],
  },
  /* Tarefas pessoais (sem projeto, equipe ou progresso) */
  {
    id: 'tp1',
    title: 'Renovar certificação AWS Solutions Architect',
    priority: 'alta',
    status: 'em-andamento',
    dueDate: '15 Jul',
    personal: true,
    assignees: [],
  },
  {
    id: 'tp2',
    title: 'Organizar pasta de documentos fiscais',
    priority: 'media',
    status: 'planejado',
    dueDate: '10 Jun',
    personal: true,
    assignees: [],
  },
  {
    id: 'tp3',
    title: 'Agendar consulta médica anual',
    priority: 'media',
    status: 'planejado',
    dueDate: '05 Jun',
    personal: true,
    assignees: [],
  },
  {
    id: 'tp4',
    title: 'Ler "Clean Architecture" — cap. 5 a 8',
    priority: 'baixa',
    status: 'em-andamento',
    dueDate: '30 Jun',
    personal: true,
    assignees: [],
  },
  {
    id: 'tp5',
    title: 'Preparar apresentação para meetup local',
    priority: 'baixa',
    status: 'planejado',
    dueDate: '18 Jun',
    personal: true,
    assignees: [],
  },
  {
    id: 'tp6',
    title: 'Atualizar currículo e LinkedIn',
    priority: 'baixa',
    status: 'concluido',
    dueDate: '22 Mai',
    personal: true,
    assignees: [],
  },
]

/* -------------------------------------------------------------- Equipes (modal) */

export const mockTeamDetails: TeamDetail[] = [
  {
    id: 't1',
    name: 'BackEnd',
    initial: 'B',
    color: 'bg-violet-600',
    description: '1 Colaborador · 14 Tarefas',
    members: teamMembers,
    collaboratorCount: 1,
    taskCount: 14,
    longDescription: 'Equipe responsável por desenvolver e manter as funcionalidades do servidor.',
    project: {
      name: 'Plataforma Civitas',
      description: 'Sistema de gestão de equipes e projetos.',
      status: 'Em andamento',
      startDate: '10/05/2024',
      endDate: '30/08/2024',
    },
    recentTasks: [
      {
        id: 'rt1',
        title: 'Implementar autenticação JWT',
        status: 'em-andamento',
        createdBy: 'Criada por você',
        createdAt: '12/05/2024',
        dueDate: '20/05/2024',
      },
      {
        id: 'rt2',
        title: 'Configurar filas de mensagens',
        status: 'planejado',
        createdBy: 'Criada por Ana',
        createdAt: '10/05/2024',
        dueDate: '25/05/2024',
      },
      {
        id: 'rt3',
        title: 'Documentar endpoints REST',
        status: 'concluido',
        createdBy: 'Criada por você',
        createdAt: '08/05/2024',
        dueDate: '15/05/2024',
      },
    ],
  },
  {
    id: 't2',
    name: 'FrontEnd',
    initial: 'F',
    color: 'bg-emerald-500',
    description: '3 Colaboradores · 22 Tarefas',
    members: teamMembers,
    collaboratorCount: 3,
    taskCount: 22,
    longDescription: 'Equipe focada em interfaces, experiência do usuário e componentes reutilizáveis.',
    project: {
      name: 'Civitas Mobile',
      description: 'Aplicativo mobile para colaboradores em campo.',
      status: 'Em andamento',
      startDate: '01/03/2024',
      endDate: '15/09/2024',
    },
    recentTasks: [
      {
        id: 'rt4',
        title: 'Refatorar dashboard de métricas',
        status: 'em-andamento',
        createdBy: 'Criada por Beatriz',
        createdAt: '14/05/2024',
        dueDate: '16/06/2024',
      },
      {
        id: 'rt5',
        title: 'Prototipação das telas no Figma',
        status: 'concluido',
        createdBy: 'Criada por você',
        createdAt: '02/05/2024',
        dueDate: '05/05/2024',
      },
    ],
  },
  {
    id: 't3',
    name: 'DataBase',
    initial: 'D',
    color: 'bg-blue-500',
    description: '2 Colaboradores · 9 Tarefas',
    members: teamMembers,
    collaboratorCount: 2,
    taskCount: 9,
    longDescription: 'Equipe responsável por modelagem, migrações e performance de banco de dados.',
    project: {
      name: 'Data Warehouse',
      description: 'Consolidação de dados para relatórios e BI.',
      status: 'Em andamento',
      startDate: '20/04/2024',
      endDate: '30/10/2024',
    },
    recentTasks: [
      {
        id: 'rt6',
        title: 'Otimizar consultas do banco',
        status: 'planejado',
        createdBy: 'Criada por Gabriel',
        createdAt: '18/05/2024',
        dueDate: '27/07/2024',
      },
    ],
  },
  {
    id: 't4',
    name: 'Criptografia',
    initial: 'C',
    color: 'bg-orange-500',
    description: '2 Colaboradores · 6 Tarefas',
    members: teamMembers,
    collaboratorCount: 2,
    taskCount: 6,
    longDescription: 'Equipe dedicada a segurança, criptografia e conformidade com políticas de acesso.',
    project: {
      name: 'Portal do Cliente',
      description: 'Área segura para clientes acessarem serviços e documentos.',
      status: 'Em revisão',
      startDate: '05/02/2024',
      endDate: '20/07/2024',
    },
    recentTasks: [
      {
        id: 'rt7',
        title: 'Implementar criptografia de ponta a ponta',
        status: 'em-revisao',
        createdBy: 'Criada por Cecília',
        createdAt: '11/05/2024',
        dueDate: '30/06/2024',
      },
    ],
  },
]

/* ----------------------------------------------------- Quadros (Kanban) */

export const mockBoardTasks: Task[] = [
  { id: 'k1', title: 'Implementar API', priority: 'critica', status: 'planejado', dueDate: '15 Out', assignees: [PEOPLE.ana] },
  { id: 'k2', title: 'Desenvolver Dashboard', priority: 'alta', status: 'planejado', dueDate: '05 Jul', assignees: [PEOPLE.beatriz] },
  { id: 'k3', title: 'Protótipo De Telas', priority: 'media', status: 'planejado', dueDate: '21 Jul', assignees: [PEOPLE.dimitri] },
  { id: 'k4', title: 'Desenvolver Dashboard', priority: 'alta', status: 'planejado', dueDate: '05 Jul', assignees: [PEOPLE.beatriz] },
  { id: 'k5', title: 'Definir Arquitetura', priority: 'critica', status: 'em-andamento', dueDate: '15 Out', progress: 40, assignees: [PEOPLE.ana] },
  { id: 'k6', title: 'Definir Personas', priority: 'alta', status: 'em-andamento', dueDate: '05 Jul', progress: 60, assignees: [PEOPLE.beatriz] },
  { id: 'k7', title: 'Configurar Banco De Dados', priority: 'critica', status: 'em-revisao', dueDate: '26 Nov', assignees: [PEOPLE.dimitri] },
  { id: 'k8', title: 'Desenvolver Dashboard', priority: 'alta', status: 'em-revisao', dueDate: '03 Jul', assignees: [PEOPLE.beatriz] },
  { id: 'k9', title: 'Protótipo De Telas', priority: 'media', status: 'em-revisao', dueDate: '21 Jun', assignees: [PEOPLE.dimitri] },
  { id: 'k10', title: 'Implementar API', priority: 'alta', status: 'bloqueado', dueDate: '15 Out', note: 'Aguardando Liberação Da API', assignees: [PEOPLE.cecilia] },
  { id: 'k11', title: 'Login E Cadastro', priority: 'baixa', status: 'concluido', dueDate: '13 Mai', assignees: [PEOPLE.ana] },
  { id: 'k12', title: 'Pesquisa De Mercado', priority: 'alta', status: 'concluido', dueDate: '16 Abr', assignees: [PEOPLE.ana] },
  { id: 'k13', title: 'Layout Tela Inicial', priority: 'media', status: 'concluido', dueDate: '25 Mai', assignees: [PEOPLE.beatriz] },
]

/* ----------------------------------------------------- Timeline (Gantt) */

export const mockTimeline: TimelineGroup[] = [
  {
    tasks: [
      { id: 'g1', title: 'Pesquisa de mercado', assignee: PEOPLE.ana, startIndex: -1, span: 0, color: 'neutral' },
      { id: 'g2', title: 'Definir personas', assignee: PEOPLE.beatriz, startIndex: 4, span: 5, color: 'neutral' },
    ],
  },
  {
    title: 'Desenvolvimento',
    tasks: [
      { id: 'g3', title: 'Definir arquitetura', assignee: PEOPLE.ana, startIndex: 6, span: 7, color: 'neutral' },
      { id: 'g4', title: 'Configurar banco de dados', assignee: PEOPLE.dimitri, startIndex: 11, span: 6, color: 'amber' },
      { id: 'g5', title: 'Implementar API', assignee: PEOPLE.cecilia, startIndex: 14, span: 6, color: 'blue' },
      { id: 'g6', title: 'Pesquisa de mercado', assignee: PEOPLE.ana, startIndex: 19, span: 8, color: 'violet' },
      { id: 'g7', title: 'Desenvolver Dashboard', assignee: PEOPLE.beatriz, startIndex: -1, span: 0, color: 'neutral' },
      { id: 'g8', title: 'Protótipo de telas', assignee: PEOPLE.dimitri, startIndex: -1, span: 0, color: 'neutral' },
    ],
  },
]

/* ------------------------------------------------------------ Calendário */

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Configurar banco de dados', startDay: 7, length: 1, color: 'pink' },
  { id: 'e2', title: 'Implementar API de autenticação', startDay: 14, length: 5, color: 'blue' },
  { id: 'e3', title: 'Desenvolver Dashboard', startDay: 19, length: 5, color: 'amber' },
  /* Prioridades de hoje (30/05/2026) — espelham mockAgenda */
  { id: 'e-today-1', title: 'Revisão do pipeline CI/CD', startDay: 30, length: 1, color: 'pink' },
  { id: 'e-today-2', title: 'Daily standup DevOps', startDay: 30, length: 1, color: 'amber' },
  { id: 'e-today-3', title: 'Alinhamento Product Owner', startDay: 30, length: 1, color: 'blue' },
  { id: 'e-today-4', title: 'Code review API JWT', startDay: 30, length: 1, color: 'violet' },
]

/* --------------------------------------------------------------- Relatórios */

export function mockAuditLogs(count = 10): AuditLog[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `log-${i + 1}`,
    date: '23/01/2001',
    user: 'Dimitri',
    action: i % 2 === 0 ? 'Update Sem Where' : 'Update Where',
    details: 'Não sabe usar SQL...',
    language: '---',
  }))
}
