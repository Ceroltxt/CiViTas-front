<script setup lang="ts">
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
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6 dark:bg-slate-900 h-full">
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
      </UCard>
      <UCard title="Colaboradores" class="w-full">
        <Placeholder class="h-24" />
      </UCard>
      <UCard title="Ranking das equipes" class="w-full">
        <Placeholder class="h-24" />
      </UCard>
    </div>
    <!--Grid para os cards antes do gráfico bonitinho, ou seja, os cards de cima kksksksksks-->
    <div class="mt-4 flex flex-col gap-4 md:flex-col lg:flex-row">
      <UCard title="Desempenho de entregas" class="w-full">
        <Placeholder class="h-32" />
      </UCard>

      <ul
        class="mt-4 flex flex-col gap-4 md:flex-col lg:flex-col md:w-20% lg:w-1/3"
      >
        <li>
          <div
            class="rounded-lg bg-yellow-200 p-4 flex flex-row items-center gap-4"
          >
            <h2 class="font-display font-bold text-orange-500 text-3xl">85</h2>
            <p class="text-xl text-orange-500 font-bold">
              Tarefas em andamento.
            </p>
          </div>
        </li>
        <li>
          <div
            class="rounded-lg bg-rose-200 p-4 flex flex-row items-center gap-4"
          >
            <h2 class="font-display font-bold text-red-600 text-3xl">10</h2>
            <p class="text-xl text-red-600 font-bold">Tarefas atrasadas.</p>
          </div>
        </li>
        <li>
          <div
            class="rounded-lg bg-emerald-200 p-4 flex flex-row items-center gap-4"
          >
            <h2 class="font-display font-bold text-green-600 text-3xl">194</h2>
            <p class="text-xl text-green-600 font-bold">Tarefas concluídas.</p>
          </div>
        </li>
      </ul>
      <!--Esses cards me deixaram um pouco louco devo admitir, mas pelo menos estão bem feitas e flexiveis ksksksk-->

      <UCard title="Notificações" class="md:w-20% lg:w-1/3 p-0">
        <Placeholder class="h-32" />
      </UCard>
    </div>
    <UCard title="Desempenho de entregas" class="w-full">
      <Placeholder class="h-32" />
    </UCard>
  </div>
</template>
