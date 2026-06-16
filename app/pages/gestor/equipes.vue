<script setup lang="ts">
import { id } from '@nuxt/ui/runtime/locale/index.js';
import { title } from 'node:process';

definePageMeta({ sidebarWidget: 'none' })

//oh chatice: aqui consta as equipes que o gestor criou e seus atributos
const teams = [
  {
    id: 'frontend',
    name: 'Front-End',
    members: '5',
    leader: 'Biah Milani',
    projects: 3,
    createdAt: '12/03/2025',
    tasks: [
      {
        name: 'Página Administrador',
        category: 'Front-End',
        priority: 'Urgente',
        members: ['Carolzinha Ramiro', 'Costa Neves', 'Dimi Jow'],
        status: 'Em andamento',
        deadline: '25/06/2026'
      },
      {
        name: 'Dashboard Gestor',
        category: 'Front-End',
        priority: 'Média',
        members: ['Bea Ribeiro', 'Dimi Jow', 'Danizin Macena', 'Carolzinha Ramiro'],
        status: 'Concluída',
        deadline: '18/06/2026'
      },
      {
        name: 'Tela de Login',
        category: 'Front-End',
        priority: 'Baixa',
        members: ['Bea Ribeiro', 'Costa Neves', 'Danizin Macena'],
        status: 'Em andamento',
        deadline: '30/06/2026'
      }
    ],
    integrantes: [
      {name: 'Costa Neves', role: 'Desenvolvedor'},
      {name: 'Danizin Macena', role: 'Design'},
      {name: 'Carolzinha Ramiro', role: 'Desenvolvedor'},
      {name: 'Dimi Jow', role: 'Design'},
      {name: 'Bea Ribeiro', role: 'Desenvolvedor'},
    ]
  },

  {
    id: 'backend',
    name: 'Back-End',
    members: '4',
    leader: 'Ana Carol',
    projects: 2,
    createdAt: '12/03/2025',
    tasks: [
      {
        name: 'API de Usuários',
        category: 'Back-End',
        priority: 'Urgente',
        members: ['Bea Ribeiro', 'Costa Neves'],
        status: 'Em andamento',
        deadline: '22/06/2026'
      },
      {
        name: 'Sistema de Login',
        category: 'Back-End',
        priority: 'Média',
        members: ['Dimi Jow', 'Carolzinha Ramiro'],
        status: 'Concluída',
        deadline: '15/06/2026'
      }
    ],
    integrantes: [
      {name: 'Costa Neves', role: 'Desenvolvedor'},
      {name: 'Carolzinha Ramiro', role: 'Desenvolvedor'},
      {name: 'Dimi Jow', role: 'Desenvolvedor'},
      {name: 'Bea Ribeiro', role: 'Desenvolvedor'},
    ]
  },

  {
    id: 'nuvem',
    name: 'Nuvem',
    members: '3',
    leader: 'Ceci Hub Pai',
    projects: 1,
    createdAt: '12/03/2025',
    tasks: [
      {
        name: 'Configuração AWS',
        category: 'Cloud',
        priority: 'Urgente',
        members: ['Bea Ribeiro', 'Costa Neves', 'Carolzinha Ramiro'],
        status: 'Em andamento',
        deadline: '20/06/2026'
      },
      {
        name: 'Deploy Produção',
        category: 'Cloud',
        priority: 'Média',
        members: ['Bea Ribeiro', 'Costa Neves', 'Carolzinha Ramiro'],
        status: 'Atrasada',
        deadline: '10/06/2026'
      }
    ],
    integrantes: [
      {name: 'Costa Neves', role: 'Desenvolvedor'},
      {name: 'Carolzinha Ramiro', role: 'Desenvolvedor'},
      {name: 'Bea Ribeiro', role: 'Desenvolvedor'},
    ]
  },
]

const selectedTeamId = ref('frontend')

const activeTab = ref('colaboradores')

const selectedMember = ref('Costa Neves')

const selectedTask = ref('Página Administrador')

const selectedTeam = computed(() =>
  teams.find(team=> team.id === selectedTeamId.value)
)

const memberTasks = computed(() => {
  if(!selectedTeam.value) return []

  return selectedTeam.value.tasks.filter(
    task => task.members.includes(selectedMember.value)
  )
})

const taskMembers = computed(() => {
  if (!selectedTeam.value) return[]

  const task = selectedTeam.value.tasks.find(
    task => task.name === selectedTask.value
  )

  if (!task) return []

  return selectedTeam.value.integrantes.filter(
    member => task.members.includes(member.name)
  )
})

watch(selectedTeam, (team) => {
  if (!team) return

  selectedMember.value = team.integrantes[0]?.name ?? ''
  selectedTask.value = team.tasks[0]?.name ?? ''
}, {immediate: true})

</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">

    <div>
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        Equipes
      </h1>

      <p class="text-sm text-slate-400">
        Gestão de equipes
      </p>
    </div>

    <!--Aqui you selecionará a equipe na qual deseja visualizar as informações (aquele array gigantesco do script)-->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      <UCard class="h-full lg:col-span-4">
        <template #header>
          <h2 class="text-lg font-semibold">
            Minhas Equipes
          </h2>
        </template>

        <!--Conteúdo do card esquerdo-->
        <div class="mb-4 flex gap-2">
          <UInput
            icon="i-lucide-search"
            placeholder="Buscar equipe..."
            class="flex-1"
            :ui="{base: 'h-9'}"
          />

          <UButton
            icon="i-heroicons-plus"
            class="h-9 bg-violet-500 text-white hover:bg-violet-600"
          >
            Equipe
          </UButton>
        </div>

        <div class="space-y-3">
          <div v-for="team in teams"
            :key="team.id"
            class="cursor-pointer rounded-lg p-3 transition"
            :class="
              selectedTeamId === team.id
              ? 'bg-[#ECEAFF]'
              :'hover:bg-slate-100 dark:hover:bg-slate-800'
            "

            @click="selectedTeamId = team.id"
          >
          
          <div class="flex items-center justify-between">
            <h3 class="font-medium">
              {{ team.name }}
            </h3>

            <p class="text-sm text-slate-500">
              {{ team.members }} membros
            </p>
          </div>
          </div>
        </div>

        <button
          type="button"
          class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-violet-500 p-3 text-sm font-medium text-violet-600 transition hover:bg-violet-50 dark:hover:bg-violet-950/20"
        >
          <UIcon 
            name="i-heroicons-plus"
            class="sie-4"
          />
          Adicionar equipe
        </button>

      </UCard>

      <!--E é aqui que visualizamos as informações de cada equipe-->
      <UCard class="h-full lg:col-span-8">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="flex items-center gap-2 text-lg font-semibold">
              {{ selectedTeam?.name }}
              
              <UIcon
                name="i-heroicons-pencil-square"
                class="size-5 text-violet-500"
              />
            </h2>
            

          <div class="flex gap-2">
            <button
              type="button"
              class="flex items-center gap-2 rounded-lg border border-dashed border-[#1D1D1D] px-3 py-2 text-sm font-medium text-[1D1D1D] transition hover:bg-slate-50"
            >
              <UIcon
                name="i-heroicons-pencil-square"
                class="size-4"
              />
              Editar Equipe
            </button>

            <button
              type="button"
              class="flex items-center gap-2 rounded-lg border border-dashed border-red-500 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <UIcon
                name="i-heroicons-trash"
                class="size-4"
              />
              Excluir Equipe
            </button>
          </div>
          </div>

        </template>

        <div class="-mt-3.6 flex gap-6 border-b border-slate-200 dark:border-slate-800">
              <button
                type="button"
                class="-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors"
                :class="
                  activeTab === 'colaboradores'
                    ? 'border-violet-500 text-violet-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                "
                @click="activeTab = 'colaboradores'"
              >
                <UIcon
                  name="i-heroicons-users"
                  class="size-4"
                />
                Colaboradores
              </button>

              <button
                type="button"
                class="-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors"
                :class="
                  activeTab === 'tarefas'
                    ? 'border-violet-500 text-violet-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                "
                @click="activeTab = 'tarefas'"
              >
                <UIcon
                  name="i-heroicons-clipboard-document-list"
                  class="size-4"
                />
                Tarefas
              </button>
            </div>

        <!-- Conteúdo do card direito -->
        <div class="mt-6 grid grid-cols-12 gap-6">

          <!-- Esquerda (5/12) -->
          <div class="col-span-5 border-r border-slate-200 pr-6 dark:border-slate-700">

            <h3 class="mb-4 font-semibold">
              {{ activeTab === 'colaboradores' ? 'Colaboradores' : 'Tarefas' }}
            </h3>

            <div class="space-y-2">

              <!--Lista de colaboradores-->
              <template v-if="activeTab === 'colaboradores'">

                <div
                  v-for="member in selectedTeam?.integrantes"
                  :key="member.name"
                  class="cursor-pointer rounded-lg p-3 transition"
                  :class="selectedMember === member.name ? 'bg-[#ECEAFF]' : ''"
                  @click="selectedMember = member.name"
                >
                <div class="flex items-center gap-3">

                  <UAvatar
                    :src="member.photo"
                    :alt="member.name"
                    size="md"
                  />

                  <div>
                    <p class="font-medium">
                      {{ member.name }}
                    </p>

                    <p class="text-sm  text-slate-500">
                      {{ member.role }}
                    </p>
                  </div>

                </div>
                </div>

              </template>

              <!--Lista de Tarefas-->
              <template v-else>
                <div
                  v-for="task in selectedTeam?.tasks"
                  :key="task.name"
                  class="cursor-pointer rounded-lg p-3 transition"
                  :class="selectedTask === task.name ? 'bg-[#ECEAFF]' : ''"
                  @click="selectedTask = task.name"
                >

                <p class="font-medium">
                  {{ task.name }}
                </p>

                <p class="text-sm text-slate-500">
                  {{ task.members.slice(0,2).join(', ') }}
                  <span v-if="task.members.length > 2">
                    +{{ task.members.length - 2 }}
                  </span>
                </p>

                </div>
              </template>

            </div>

          </div>

          <!-- Direita (7/12) -->
          <div class="col-span-7">

            <!--Quando estiver em Colaboradores-->
            <template v-if="activeTab === 'colaboradores'">

              <h3 class="mb-4 font-semibold">
                Tarefas de {{ selectedMember }}
              </h3>

              <div class="space-y-3">

                <div
                  v-for="task in memberTasks"
                  :key="task.name"
                  class="flex items-center gap-6 overflow-hidden rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                >

                <!--Foto + título-->
                <div class="flex min-w-0 flex-1 items-center gap-3">
                  <UAvatar size="md" />

                  <div class="min-w-0">
                    <p class="truncate font-medium">
                      {{ task.name }}
                    </p>

                    <p class="text-xs text-slate-500">
                      Prioridade: {{ task.priority }}
                    </p>
                  </div>
                </div>

                <!--Status-->
                <UBadge
                  class="shrink-0"
                  :color="
                    task.status === 'Concluída'
                    ? 'success'
                    : task.status === 'Atrasada'
                      ? 'error'
                      : 'primary'
                  "
                  variant="soft"
                >
                  {{ task.status }}
                </UBadge>

                <!--Prazo-->
                <div class="w-24 shrink-0 text-sm text-slate-500">
                  {{ task.deadline }}
                </div>

                </div>

              </div>
            </template>

            <!--Quando estiver em tarefas-->
            <template v-else>

              <h3 class="mb-4 font-semibold">
                Colaboradores da tarefa
              </h3>

              <div class="space-y-3">
                <div
                  v-for="member in taskMembers"
                  :key="member.name"
                  class="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                >

                  <p class="font-medium">
                    {{ member.name }}
                  </p>
                  
                  <p class="text-sm text-slate-500">
                    {{ member.role }}
                  </p>

                </div>
              </div>
            </template>

          </div>

        </div>
      </UCard>

    </div>

  </div>
</template>