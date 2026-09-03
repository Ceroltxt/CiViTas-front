<script setup lang="ts">
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import {
  DateFormatter,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
definePageMeta({ sidebarWidget: "none" });

const df = new DateFormatter("en-US", { dateStyle: "medium" });
const tz = getLocalTimeZone();
const breakpoints = useBreakpoints(breakpointsTailwind);
const isDesktop = breakpoints.greaterOrEqual("sm");

const ranges = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 3 months", months: 3 },
  { label: "Last 6 months", months: 6 },
  { label: "Last year", years: 1 },
];

const initialEnd = today(tz);
const modelValue = shallowRef({
  start: initialEnd.subtract({ days: 14 }),
  end: initialEnd,
});

const label = computed(() => {
  const { start, end } = modelValue.value;
  if (!start) return "Pick a date";
  if (!end) return df.format(start.toDate(tz));
  return `${df.format(start.toDate(tz))} - ${df.format(end.toDate(tz))}`;
});

function computeStart(range: (typeof ranges)[number]) {
  const end = today(tz);
  return {
    start: end.subtract({
      days: range.days,
      months: range.months,
      years: range.years,
    }),
    end,
  };
}

function isRangeSelected(range: (typeof ranges)[number]) {
  if (!modelValue.value?.start || !modelValue.value?.end) return false;
  const { start, end } = computeStart(range);
  return (
    modelValue.value.start.compare(start) === 0 &&
    modelValue.value.end.compare(end) === 0
  );
}

function selectRange(range: (typeof ranges)[number]) {
  modelValue.value = computeStart(range);
}

const table = useTemplateRef("table");

type Payment = {
  id: string;
  date: string;
  email: string;
  amount: number;
};
const data = ref<Payment[]>([
  {
    id: "4600",
    date: "2026-06-16T15:30:00",
    email: "RH",
    amount: 594,
  },
  {
    id: "4599",
    date: "2026-06-11T10:10:00",
    email: "Marketing",
    amount: 276,
  },
  {
    id: "4598",
    date: "2026-06-11T08:50:00",
    email: "Mobile",
    amount: 315,
  },
  {
    id: "4597",
    date: "2026-06-10T19:45:00",
    email: "Portal do cliente",
    amount: 529,
  },
]);
const columns: TableColumn<Payment>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: {
      class: {
        th: "text-right",
        td: "text-right font-medium",
      },
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
    },
  },
];

const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
});

const newProjectOpen = ref(false)
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6 dark:bg-slate-900 min-h-screen">
    <div
      class="flex items-center justify-between md:flex-col lg:flex-row gap-4"
    >
      <div>
        <h1
          class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100"
        >
          Projetos        </h1>
      </div>
      <UButton
        label="Criar novo projeto"
        trailing-icon="i-heroicons-plus"
        size="md"
        color="secondary"
        variant="subtle"
        class="bg-violet-600 hover:bg-violet-700 text-white cursor-pointer"
        @click="newProjectOpen = true"
      />
    </div>
    <!-- Os elementos do topo da págima, talez meser no icone do botção se acharem melhor a outra opção-->
    <ul
      class="mt-4 flex flex-col gap-4 md:flex-col lg:flex-row md:w-full lg:w-full md:justify-center"
    >
      <li>
        <div
          class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 lg:w-54 lg:h-32 border-t-violet-600 border-t-4 dark:border-t-violet-600 hover:translate-y-1 transition-transform duration-400 hover:shadow-lg"
        >
          <UIcon
            name="i-heroicons-inbox-stack"
            class="size-12 rounded-full bg-[#bd52c9] p-2 text-fuchsia-100 shadow-lg shadow-fuchsia-800/40"
          />
          <div class="flex flex-col sm:items-center md:items-start lg:items-start hover:translate-y-1 transition-transform duration-400">
            <p class="font-medium text-slate-700 dark:text-slate-300">
              Total de projetos
            </p>
            <h1 class="text-2xl font-bold text-violet-600">7</h1>
          </div>
        </div>
      </li>
      <li>
        <div
          class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 lg:w-54 lg:h-32 border-t-orange-400 border-t-4 dark:border-t-orange-400 hover:translate-y-1 transition-transform duration-400 hover:shadow-lg"
        >
          <UIcon
            name="i-heroicons-play-circle"
            class="size-12 text-yellow-200 bg-orange-400 rounded-full p-2 shadow-lg shadow-orange-800/50"
          />
          <div class="flex flex-col sm:items-center md:items-center lg:items-start">
            <p class="font-medium text-slate-700 dark:text-slate-300">
              em andamento
            </p>
            <h1 class="text-2xl font-bold text-orange-500">5</h1>
          </div>
        </div>
      </li>
      <li>
        <div
          class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 lg:w-54 lg:h-32 border-t-green-600 border-t-4 dark:border-t-green-600 hover:translate-y-1 transition-transform duration-400 hover:shadow-lg"
        >
          <UIcon
            name="i-heroicons-check-badge"
            class="size-12 text-emerald-200 bg-green-600 rounded-full p-2 shadow-lg shadow-emerald-800/50"
          />
          <div class="flex flex-col  sm:items-center md:items-center lg:items-start hover:translate-y-1 transition-transform duration-400">
            <p class="font-medium text-slate-700 dark:text-slate-300">
              Concluídos
            </p>
            <h1 class="text-2xl font-bold text-green-600">2</h1>
          </div>
        </div>
      </li>
      <li>
        <div
          class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 lg:w-54 lg:h-32 border-t-red-600 border-t-4 dark:border-t-red-600 hover:translate-y-1 transition-transform duration-400 hover:shadow-lg"
        >
          <UIcon
            name="i-heroicons-exclamation-circle"
            class="size-12 text-rose-200 bg-red-500 rounded-full p-2 shadow-lg shadow-red-800/50"
          />
          <div class="flex flex-col sm:items-center md:items-center lg:items-start  hover:translate-y-1 transition-transform duration-400">
            <p class="font-medium text-slate-700 dark:text-slate-300">
              Atrasados
            </p>
            <h1 class="text-2xl font-bold text-red-500">3</h1>
          </div>
        </div>
      </li>
      <li>
        <div
          class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-2 border-slate-200 dark:border-slate-700 lg:w-54 lg:h-32 border-t-blue-600 border-t-4 dark:border-t-blue-600 hover:translate-y-1 transition-transform duration-400 hover:shadow-lg"
        >
          <UIcon
            name="i-heroicons-user-group"
            class="size-12 text-sky-300 bg-blue-600 rounded-full p-2 shadow-lg shadow-sky-800/50"
          />
          <div class="flex flex-col sm:items-center md:items-center lg:items-start hover:translate-y-1 transition-transform duration-400">
            <p class="font-medium text-slate-700 dark:text-slate-300">
              Gestores ativos
            </p>
            <h1 class="text-2xl font-bold text-blue-600">12</h1>
          </div>
        </div>
      </li>
    </ul>
    <!--Cards de progresso dos projetos, para ficar mais visual para o usuário. PS: Niguém mexe nesse troço, principalmente na responsividade dele, pffffff!!!!-->
    <div class="w-full space-y-4 pb-4">
      <div class="flex px-4 py-3.5 border-b border-accented">
        <UInput
          v-model="globalFilter"
          class="max-w-sm"
          placeholder="Filtro..."
          color="secondary"
        />
      </div>

      <UTable
        ref="table"
        v-model:pagination="pagination"
        v-model:global-filter="globalFilter"
        :data="data"
        :columns="columns"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel(),
        }"
        class="flex-1"
      />
     
      

      <div class="flex justify-end border-t border-default pt-4 px-4">
        <UPagination
          :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>

    <ProjetosNewProjectModal v-model:open="newProjectOpen" />
  </div>
</template>
