<script setup lang="ts">
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
definePageMeta({ sidebarWidget: "none" });

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

const globalFilter = ref("");
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6 dark:bg-slate-900 h-full">
    <div
      class="flex items-center justify-between md:flex-col lg:flex-row gap-4"
    >
      <div>
        <h1
          class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100"
        >
          Projetos
        </h1>
      </div>
      <UButton
        icon="i-heroicons-plus"
        size="lg"
        color="secondary"
        variant="subtle"
        >Novo projeto</UButton
      >
    </div>
    <!-- Os elementos do topo da págima, talez meser no icone do botção se acharem melhor a outra opção-->
    <ul
      class="mt-4 flex flex-col gap-4 md:flex-col lg:flex-row md:w-full lg:w-full md:justify-center"
    >
      <li>
        <div
          class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-4 border-slate-200 dark:border-slate-700"
        >
          <UIcon
            name="i-heroicons-inbox-stack"
            class="size-14 text-violet-600 bg-violet-300 rounded-full p-2"
          />
          <div class="flex flex-col">
            <p class="font-medium text-slate-700 dark:text-slate-300">
              Total de projetos
            </p>
            <h1 class="text-2xl font-bold text-violet-600">7</h1>
          </div>
        </div>
      </li>
      <li>
        <div
          class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-4 border-slate-200 dark:border-slate-700"
        >
          <UIcon
            name="i-heroicons-play-circle"
            class="size-14 text-orange-500 bg-yellow-200 rounded-full p-2"
          />
          <div class="flex flex-col">
            <p class="font-medium text-slate-700 dark:text-slate-300">
              Projetos em andamento
            </p>
            <h1 class="text-2xl font-bold text-orange-500">5</h1>
          </div>
        </div>
      </li>
      <li>
        <div
          class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-4 border-slate-200 dark:border-slate-700"
        >
          <UIcon
            name="i-heroicons-check-badge"
            class="size-14 text-green-600 bg-emerald-200 rounded-full p-2"
          />
          <div class="flex flex-col">
            <p class="font-medium text-slate-700 dark:text-slate-300">
              Projetos concluídos
            </p>
            <h1 class="text-2xl font-bold text-green-600">2</h1>
          </div>
        </div>
      </li>
      <li>
        <div
          class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-4 border-slate-200 dark:border-slate-700"
        >
          <UIcon
            name="i-heroicons-exclamation-circle"
            class="size-14 text-red-500 bg-rose-200 rounded-full p-2"
          />
          <div class="flex flex-col">
            <p class="font-medium text-slate-700 dark:text-slate-300">
              Projetos em atraso
            </p>
            <h1 class="text-2xl font-bold text-red-500">3</h1>
          </div>
        </div>
      </li>
      <li>
        <div
          class="flex items-center gap-4 flex-col md:flex-row lg:flex-row border-2 rounded-lg p-4 border-slate-200 dark:border-slate-700"
        >
          <UIcon
            name="i-heroicons-user-group"
            class="size-14 text-blue-600 bg-sky-300 rounded-full p-2"
          />
          <div class="flex flex-col">
            <p class="font-medium text-slate-700 dark:text-slate-300">
              Gestores ativos
            </p>
            <h1 class="text-2xl font-bold text-blue-600">12</h1>
          </div>
        </div>
      </li>
    </ul>
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
  </div>
</template>
