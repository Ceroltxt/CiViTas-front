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
    integrantes: [
      {name: 'Costa Neves', role: 'Desenvolvedor'},
      {name: 'Carolzinha Ramiro', role: 'Desenvolvedor'},
      {name: 'Bea Ribeiro', role: 'Desenvolvedor'},
    ]
  },
]

const selectedTeamId = ref('frontend')

const selectedTeam = computed(() =>
  teams.find(team=> team.id === selectedTeamId.value)
)

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
        <UInput
          icon="i-lucide-search"
          placeholder="Buscar equipe..."
          class="mb-4"
        />

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

      </UCard>

      <!--E é aqui que visualizamos as informações de cada equipe-->
      <UCard class="h-full lg:col-span-8">
        <template #header>
          <h2 class="text-lg font-semibold">
            {{ selectedTeam?.name }}
          </h2>
        </template>

        <!--Conteúdo do card direito-->

        <div class="space-y-2">
          <div
            v-for="member in selectedTeam?.integrantes"
            :key="member.name"
            class="flex items-center justify-between border-b border-slate-200 p-3 last:border-b-0 dark:border-slate-700"
          >
          <div class="flex items-center gap-3">
            <UAvatar
              :src="member.photo"
              :alt="member.name"
              size="md"
            /> <!--O erro é não ter um User com imagem atrelada, não está afetando a página, ent no momento (12/06/2026), nn é necessário mexer-->

            <span>{{ member.name }}</span>
          </div>

          <span class="text-sm text-slate-500">
            {{ member.role }}
          </span>
          </div>
        </div>

      </UCard>

    </div>

  </div>
</template>
