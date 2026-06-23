<script setup lang="ts">
import chartBarVertical from "@/components/chart/chartBarVertical.vue";
import chartDonut from "@/components/chart/chartDonut.vue";
import chartLine from "@/components/chart/chartLine.vue";
import LineBarHalf from "~/components/progressBar/lineBarHalf.vue";
import LineBarFull from "~/components/progressBar/lineBarFull.vue";
import LineBarEmpty from "~/components/progressBar/lineBarEmpty.vue";
import LineBarQuater from "~/components/progressBar/lineBarQuater.vue";
import notificationNewTask from "~/components/notifications/notificationNewTask.vue";
import notificationNewUser from "~/components/notifications/notificationNewUser.vue";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
definePageMeta({ sidebarWidget: "none" });

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const modelValue = shallowRef(new CalendarDate(2026, 6, 16));
</script>

<template>
  <div
    class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6 dark:bg-slate-900 min-h-screen"
  >
    <div>
      <h1
        class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100"
      >
        Olá, Carlos!
      </h1>
      <!-- Depois colocar um icone de boas vindas, tipo um aceno ou qualquer coisa do tipo, só pra ficar mais amigável e tals. -->
      <p class="text-sm text-slate-400">
        Acompanhe o progresso das equipes e projetos.
      </p>
    </div>

    <div class="flex flex-wrap items-center justify-end gap-2">
      <UPopover>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-calendar-days"
          trailing-icon="i-heroicons-chevron-down"
          size="md"
        >
          {{
            modelValue
              ? df.format(modelValue.toDate(getLocalTimeZone()))
              : "Select a date"
          }}
        </UButton>
        <!-- Calendar popover -->

        <template #content>
          <UCalendar v-model="modelValue" class="p-2" color="secondary" />
        </template>
      </UPopover>
      <UModal :modal="false" title="Exportar relatório">
        <UButton
          label="Exportar relatório"
          color="neutral"
          variant="outline"
          icon="i-heroicons-document-arrow-down"
        />

        <template #body>
          <Placeholder class="h-48" />
          <UFileUpload
            color="neutral"
            highlight
            label="Arraste e solte um arquivo ou clique para selecionar"
            description="SVG, PNG, JPG or GIF (max. 2MB)"
            class="w-96 min-h-48"
          />
        </template> </UModal
      ><!--Modal para adicionar um relatorio-->
    </div>
    <!-- Botões de ação (Calendário e relatórios)-->

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <UCard title="Desempenho das equipes" class="w-full">
        <Placeholder class="h-24" />
        <chartBarVertical />
      </UCard>
      <UCard title="Colaboradores" class="w-full">
        <Placeholder class="h-24" />
        <chartDonut class="self-center" />
      </UCard>
      <UCard title="Ranking das equipes" class="w-full">
        <Placeholder class="h-24" />
        
      </UCard>
    </div>
    <!--Grid para os cards antes do gráfico bonitinho, ou seja, os cards de cima kksksksksks-->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!--Coluna da esquerda-->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Gráfico -->
        <UCard title="Desempenho de entregas" class="lg:col-span-2">
          <chartLine />
        </UCard>
        <div class="lg:col-span-2">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div class="rounded-lg bg-yellow-200 p-4 flex items-center gap-4 dark:bg-orange-500">
              <h2 class="text-3xl font-bold text-orange-500 dark:text-yellow-200">85</h2>
              <p class="font-bold text-orange-500 dark:text-yellow-200">Tarefas em andamento.</p>
            </div>

            <div class="rounded-lg bg-rose-200 dark:bg-rose-600 p-4 flex items-center gap-4">
              <h2 class="text-3xl font-bold text-red-600 dark:text-rose-200">10</h2>
              <p class="font-bold text-red-600 dark:text-rose-200">Tarefas atrasadas.</p>
            </div>

            <div class="rounded-lg bg-emerald-200 dark:bg-green-600 p-4 flex items-center gap-4">
              <h2 class="text-3xl font-bold text-green-600 dark:text-emerald-200">194</h2>
              <p class="font-bold text-green-600 dark:text-emerald-200">Tarefas concluídas.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Notificações "Coluna da direita" -->
      <UCard title="Notificações" class="h-full">
        <ul class="flex flex-col gap-2">
          <li><notificationNewTask /></li>
          <li><notificationNewUser /></li>
        </ul>

        <UButton
          label="Ver mais"
          class="mt-4 bg-transparent text-violet-500 hover:bg-transparent"
        />
      </UCard>

      <!-- Cards de indicadores -->
    </div>
    <UCard title="Projetos em andamento" class="w-full">
      <Placeholder class="h-32" icon="i-heroicons-briefcase" />
      <ul class="flex flex-wrap gap-4 justify-center lg:justify-start">
        <li class="w-full sm:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
          <div
            class="rounded-lg bg-slate-100 dark:bg-slate-800
         p-4 flex items-center gap-4
         shadow-md
         h-32
         w-full
         transition-transform duration-300
         hover:-translate-y-1"
          >
            <UIcon
              name="i-heroicons-briefcase"
              class="size-12 bg-sky-500 p-2 rounded-full text-slate-100"
            />
            <div class="flex flex-col">
              <p class="font-bold">Sistema de gestão de RH</p>
              <LineBarQuater />
              <!--Esse componente está na pasta de componentes-->
              <p>Prazo: 15/12/2026</p>
              <!--Rlx q depois da apresentação vou preparar para o back fazer o seu trabalho, mas esse é o template desse card-->
            </div>
          </div>
        </li>
        <li class="w-full sm:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
          <div
            class="rounded-lg bg-slate-100 dark:bg-slate-800
         p-4 flex items-center gap-4
         shadow-md
         h-32
         w-full
         transition-transform duration-300
         hover:-translate-y-1"
          >
            <UIcon
              name="i-heroicons-device-phone-mobile"
              class="size-12 bg-rose-500 p-2 rounded-full text-slate-100"
            />
            <div class="flex flex-col">
              <p class="font-bold">Aplicativo mobile</p>
              <LineBarFull />
              <!--Esse componente está na pasta de componentes-->
              <p>Prazo: 15/12/2026</p>
              <!--Rlx q depois da apresentação vou preparar para o back fazer o seu trabalho, mas esse é o template desse card-->
            </div>
          </div>
        </li>
        <li class="w-full sm:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
          <div
            class="rounded-lg bg-slate-100 dark:bg-slate-800
         p-4 flex items-center gap-4
         shadow-md
         h-32
         w-full
         transition-transform duration-300
         hover:-translate-y-1"
          >
            <UIcon
              name="i-heroicons-user"
              class="size-12 bg-fuchsia-500 p-2 rounded-full text-slate-100"
            />
            <div class="flex flex-col">
              <p class="font-bold">Portal do cliente</p>
              <LineBarHalf />
              <!--Esse componente está na pasta de componentes-->
              <p>Prazo: 15/12/2026</p>
              <!--Rlx q depois da apresentação vou preparar para o back fazer o seu trabalho, mas esse é o template desse card-->
            </div>
          </div>
        </li>
        <li class="w-full sm:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
          <div
            class="rounded-lg bg-slate-100 dark:bg-slate-800
         p-4 flex items-center gap-4
         shadow-md
         h-32
         w-full
         transition-transform duration-300
         hover:-translate-y-1"
          >
            <UIcon
              name="i-heroicons-newspaper"
              class="size-12 bg-amber-500 p-2 rounded-full text-slate-100"
            />
            <div class="flex flex-col">
              <p class="font-bold">Campanha de marketing</p>
              <LineBarEmpty />
              <!--Esse componente está na pasta de componentes-->
              <p>Prazo: 15/12/2026</p>
              <!--Rlx q depois da apresentação vou preparar para o back fazer o seu trabalho, mas esse é o template desse card-->
            </div>
          </div>
        </li>
      </ul>
      <!--A barra de projetos em andamento, vai ter bastante coisa do back, na minha cabeça kskskksks-->
    </UCard>
  </div>
</template>
