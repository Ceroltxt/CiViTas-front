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
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
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
          <UCalendar v-model="modelValue" class="p-2" />
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

    <UiSectionCard title="Painel administrativo">
      <p class="text-sm text-slate-400">Em construção.</p>
    </UiSectionCard>
  </div>
</template>
