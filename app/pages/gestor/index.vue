<script setup lang="ts">
import { computed } from 'vue'
import chartLine from "~/components/chart/chartLine.vue"
definePageMeta({ sidebarWidget: "none" })

const { name } = useCurrentUser()
const firstName = computed(() => name.split(' ')[0])
</script>

<template>
  <div class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 dark:bg-slate-900 min-h-screen font-sans">
    
    <!-- Top Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Olá, {{ firstName }}!
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Acompanhe o desempenho das suas equipes e projetos.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <UButton color="white" variant="solid" icon="i-heroicons-calendar-days" trailing-icon="i-heroicons-chevron-down" class="text-slate-600">
          16/06/2026 - 22/06/2026
        </UButton>
      </div>
    </div>

    <!-- Metrics Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <UCard :ui="{ body: { padding: 'p-3 sm:p-4' } }">
        <div class="flex items-center gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white rounded-full">
            <UIcon name="i-heroicons-briefcase" class="size-[18px]" />
          </div>
          <div class="min-w-0">
            <p class="whitespace-nowrap text-xs font-medium leading-3 text-slate-500">Projetos gerenciados</p>
            <p class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">6</p>
          </div>
        </div>
      </UCard>
      
      <UCard :ui="{ body: { padding: 'p-3 sm:p-4' } }">
        <div class="flex items-center gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center bg-gradient-to-br from-blue-500 to-sky-600 text-white rounded-full">
            <UIcon name="i-heroicons-user-group" class="size-[18px]" />
          </div>
          <div class="min-w-0">
            <p class="whitespace-nowrap text-xs font-medium leading-3 text-slate-500">Equipes</p>
            <p class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">4</p>
          </div>
        </div>
      </UCard>
      
      <UCard :ui="{ body: { padding: 'p-3 sm:p-4' } }">
        <div class="flex items-center gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full">
            <UIcon name="i-heroicons-exclamation-triangle" class="size-[18px]" />
          </div>
          <div class="min-w-0">
            <p class="whitespace-nowrap text-xs font-medium leading-3 text-slate-500">Tarefas atrasadas</p>
            <p class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">7</p>
          </div>
        </div>
      </UCard>
      
      <UCard :ui="{ body: { padding: 'p-3 sm:p-4' } }">
        <div class="flex items-center gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full">
            <UIcon name="i-heroicons-check-circle" class="size-[18px]" />
          </div>
          <div class="min-w-0">
            <p class="whitespace-nowrap text-xs font-medium leading-3 text-slate-500">Progresso geral</p>
            <p class="mt-0.5 text-xl font-bold leading-5 text-slate-800 dark:text-slate-100">67%</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Middle Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Minhas equipes -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Minhas equipes</h3>
            <NuxtLink to="/gestor/equipes" class="text-sm text-violet-600 font-medium hover:underline">Ver todas</NuxtLink>
          </div>
        </template>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="pb-3 pr-2 text-left">Equipe</th>
                <th class="pb-3 px-2 text-center">Colaboradores</th>
                <th class="pb-3 px-2 w-32 text-left">Progresso</th>
                <th class="pb-3 px-2 text-center">Tarefas</th>
                <th class="pb-3 pl-2 text-right">Desempenho</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td class="py-3 pr-2">
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded bg-violet-600 text-white flex items-center justify-center font-bold text-[10px]">EB</div>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Equipe Backend</span>
                  </div>
                </td>
                <td class="py-3 px-2 text-center text-slate-500">8</td>
                <td class="py-3 px-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 w-7">82%</span>
                    <div class="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-violet-500 rounded-full" style="width: 82%"></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-2">
                  <div class="flex items-center justify-center gap-2 text-xs font-medium">
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>12</span>
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>4</span>
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>2</span>
                  </div>
                </td>
                <td class="py-3 pl-2 text-right">
                  <UBadge color="violet" variant="subtle" class="font-medium bg-violet-50 text-violet-700 dark:bg-violet-500/10"><UIcon name="i-heroicons-star" class="w-3.5 h-3.5 mr-1" /> 4.6</UBadge>
                </td>
              </tr>
              <tr>
                <td class="py-3 pr-2">
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded bg-blue-500 text-white flex items-center justify-center font-bold text-[10px]">EF</div>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Equipe Frontend</span>
                  </div>
                </td>
                <td class="py-3 px-2 text-center text-slate-500">6</td>
                <td class="py-3 px-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 w-7">74%</span>
                    <div class="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-blue-500 rounded-full" style="width: 74%"></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-2">
                  <div class="flex items-center justify-center gap-2 text-xs font-medium">
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>9</span>
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>3</span>
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>1</span>
                  </div>
                </td>
                <td class="py-3 pl-2 text-right">
                  <UBadge color="blue" variant="subtle" class="font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10"><UIcon name="i-heroicons-star" class="w-3.5 h-3.5 mr-1" /> 4.2</UBadge>
                </td>
              </tr>
              <tr>
                <td class="py-3 pr-2">
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">ED</div>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Equipe Design</span>
                  </div>
                </td>
                <td class="py-3 px-2 text-center text-slate-500">5</td>
                <td class="py-3 px-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 w-7">65%</span>
                    <div class="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-orange-500 rounded-full" style="width: 65%"></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-2">
                  <div class="flex items-center justify-center gap-2 text-xs font-medium">
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>7</span>
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>3</span>
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>2</span>
                  </div>
                </td>
                <td class="py-3 pl-2 text-right">
                  <UBadge color="orange" variant="subtle" class="font-medium bg-orange-50 text-orange-700 dark:bg-orange-500/10"><UIcon name="i-heroicons-star" class="w-3.5 h-3.5 mr-1" /> 3.8</UBadge>
                </td>
              </tr>
              <tr>
                <td class="py-3 pr-2">
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">EM</div>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Equipe Mobile</span>
                  </div>
                </td>
                <td class="py-3 px-2 text-center text-slate-500">4</td>
                <td class="py-3 px-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 w-7">58%</span>
                    <div class="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full" style="width: 58%"></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-2">
                  <div class="flex items-center justify-center gap-2 text-xs font-medium">
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>6</span>
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>2</span>
                    <span class="flex items-center gap-1 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>1</span>
                  </div>
                </td>
                <td class="py-3 pl-2 text-right">
                  <UBadge color="emerald" variant="subtle" class="font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10"><UIcon name="i-heroicons-star" class="w-3.5 h-3.5 mr-1" /> 3.6</UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-5 flex items-center gap-4 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Concluídas</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Em andamento</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-500"></span> Atrasadas</span>
        </div>
      </UCard>

      <!-- Desempenho dos projetos -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Desempenho dos projetos</h3>
            <NuxtLink to="/gestor/projetos" class="text-sm text-violet-600 font-medium hover:underline">Ver todas</NuxtLink>
          </div>
        </template>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="pb-3 pr-2 text-left">Projeto</th>
                <th class="pb-3 px-2 w-32 text-left">Progresso</th>
                <th class="pb-3 px-2 text-center">Tarefas</th>
                <th class="pb-3 px-2 text-center">Atrasadas</th>
                <th class="pb-3 pl-2 text-right">Prazo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td class="py-3 pr-2">
                  <div class="flex items-center gap-3">
                    <div class="size-2.5 rounded-full bg-violet-500 shrink-0"></div>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Nova Praça Central</span>
                  </div>
                </td>
                <td class="py-3 px-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 w-7">78%</span>
                    <div class="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-violet-500 rounded-full" style="width: 78%"></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-2 text-center text-slate-500 font-medium">18</td>
                <td class="py-3 px-2 text-center text-red-500 font-medium">2</td>
                <td class="py-3 pl-2 text-right text-slate-500 text-xs">15/08/2026</td>
              </tr>
              <tr>
                <td class="py-3 pr-2">
                  <div class="flex items-center gap-3">
                    <div class="size-2.5 rounded-full bg-blue-500 shrink-0"></div>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Plataforma Civitas</span>
                  </div>
                </td>
                <td class="py-3 px-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 w-7">64%</span>
                    <div class="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-blue-500 rounded-full" style="width: 64%"></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-2 text-center text-slate-500 font-medium">24</td>
                <td class="py-3 px-2 text-center text-red-500 font-medium">1</td>
                <td class="py-3 pl-2 text-right text-slate-500 text-xs">20/09/2026</td>
              </tr>
              <tr>
                <td class="py-3 pr-2">
                  <div class="flex items-center gap-3">
                    <div class="size-2.5 rounded-full bg-emerald-500 shrink-0"></div>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Sistema de Alvarás</span>
                  </div>
                </td>
                <td class="py-3 px-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 w-7">42%</span>
                    <div class="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full" style="width: 42%"></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-2 text-center text-slate-500 font-medium">15</td>
                <td class="py-3 px-2 text-center text-red-500 font-medium">4</td>
                <td class="py-3 pl-2 text-right text-slate-500 text-xs">30/07/2026</td>
              </tr>
              <tr>
                <td class="py-3 pr-2">
                  <div class="flex items-center gap-3">
                    <div class="size-2.5 rounded-full bg-orange-500 shrink-0"></div>
                    <span class="font-medium text-slate-700 dark:text-slate-200">Aplicativo Mobile</span>
                  </div>
                </td>
                <td class="py-3 px-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 w-7">20%</span>
                    <div class="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-orange-500 rounded-full" style="width: 20%"></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-2 text-center text-slate-500 font-medium">10</td>
                <td class="py-3 px-2 text-center text-slate-500 font-medium">0</td>
                <td class="py-3 pl-2 text-right text-slate-500 text-xs">10/10/2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Evolução das entregas -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Evolução das entregas</h3>
            <USelectMenu :options="['Últimas 8 semanas', 'Últimos 6 meses', 'Este ano']" model-value="Últimas 8 semanas" size="sm" color="white" class="w-44" />
          </div>
        </template>
        
        <div class="h-64 mb-8 w-full relative">
          <ClientOnly>
            <chartLine 
              :labels="['28/abr', '05/mai', '12/mai', '19/mai', '26/mai', '02/jun', '09/jun', '16/jun']"
              :datasets="[
                { label: 'Concluídas', data: [12, 18, 22, 28, 32, 36, 40, 45], borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.4 },
                { label: 'Atrasadas', data: [5, 4, 6, 3, 5, 4, 3, 2], borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.4 }
              ]"
            />
          </ClientOnly>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10">
            <div class="p-2.5 bg-white shadow-sm border border-emerald-100 text-emerald-500 rounded-full dark:bg-emerald-900/40 dark:border-emerald-800">
              <UIcon name="i-heroicons-check" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">136</p>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Tarefas concluídas</p>
              <p class="text-[10px] text-emerald-600 font-bold mt-1">+18% vs período anterior</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3 bg-rose-50/50 p-4 rounded-xl border border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/10">
            <div class="p-2.5 bg-white shadow-sm border border-rose-100 text-rose-500 rounded-full dark:bg-rose-900/40 dark:border-rose-800">
              <UIcon name="i-heroicons-exclamation-circle" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">23</p>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Tarefas atrasadas</p>
              <p class="text-[10px] text-rose-600 font-bold mt-1">-5% vs período anterior</p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Atenção do gestor -->
      <UCard class="flex flex-col">
        <template #header>
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Atenção do gestor</h3>
        </template>
        
        <div class="flex-1 flex flex-col gap-5 py-2">
          <!-- Item 1 -->
          <div class="flex items-center gap-4">
            <div class="flex size-10 shrink-0 items-center justify-center bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-xl shadow-sm">
              <UIcon name="i-heroicons-exclamation-triangle" class="size-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-slate-800 dark:text-slate-200">2 equipes com tarefas atrasadas</p>
              <p class="text-xs text-slate-500 mt-0.5 truncate">Backend e Design possuem tarefas atrasadas.</p>
            </div>
            <UButton color="white" variant="outline" size="sm" class="text-red-600 border-red-200 hover:bg-red-50 px-4">Ver equipes</UButton>
          </div>
          
          <UDivider />
          
          <!-- Item 2 -->
          <div class="flex items-center gap-4">
            <div class="flex size-10 shrink-0 items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl shadow-sm">
              <UIcon name="i-heroicons-calendar-days" class="size-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-slate-800 dark:text-slate-200">1 projeto próximo do prazo</p>
              <p class="text-xs text-slate-500 mt-0.5 truncate">"Sistema de Alvarás" vence em 8 dias.</p>
            </div>
            <UButton color="white" variant="outline" size="sm" class="text-orange-600 border-orange-200 hover:bg-orange-50 px-4">Ver projeto</UButton>
          </div>
          
          <UDivider />
          
          <!-- Item 3 -->
          <div class="flex items-center gap-4">
            <div class="flex size-10 shrink-0 items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-500 text-white rounded-xl shadow-sm">
              <UIcon name="i-heroicons-lock-closed" class="size-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-slate-800 dark:text-slate-200">3 tarefas bloqueadas</p>
              <p class="text-xs text-slate-500 mt-0.5 truncate">Tarefas aguardam dependências ou aprovações.</p>
            </div>
            <UButton color="white" variant="outline" size="sm" class="text-amber-600 border-amber-200 hover:bg-amber-50 px-4">Ver tarefas</UButton>
          </div>
        </div>
        
        <div class="mt-6 bg-violet-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-violet-900/20">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-violet-100 text-violet-600 rounded-lg dark:bg-violet-800/50 dark:text-violet-300 shrink-0">
              <UIcon name="i-heroicons-users" class="w-5 h-5" />
            </div>
            <div>
              <p class="font-bold text-sm text-slate-800 dark:text-violet-100">Mantenha suas equipes alinhadas</p>
              <p class="text-xs text-slate-600 dark:text-violet-300 mt-0.5">Acompanhe o progresso e ofereça suporte quando necessário.</p>
            </div>
          </div>
          <UButton color="primary" variant="solid" icon="i-heroicons-chart-bar" class="bg-violet-600 hover:bg-violet-700 text-white shrink-0">Ver relatório completo</UButton>
        </div>
      </UCard>
    </div>

  </div>
</template>
