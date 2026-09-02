<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { useClipboard } from '@vueuse/core'
definePageMeta({ sidebarWidget: 'project' })


interface User {
  id: number
  name: string
  position: string
  email: string
  role: string
}

const toast = useToast()
const { copy } = useClipboard()

const data = ref<User[]>([
  {
    id: 1,
    name: 'Lindsay Walton',
    position: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Colaborador'
  },
  {
    id: 2,
    name: 'Courtney Henry',
    position: 'Designer',
    email: 'courtney.henry@example.com',
    role: 'Colaborador'
  },
  {
    id: 3,
    name: 'Tom Cook',
    position: 'Diretor de produção',
    email: 'tom.cook@example.com',
    role: 'Colaborador'
  },
  {
    id: 4,
    name: 'Whitney Francis',
    position: 'Copywriter',
    email: 'whitney.francis@example.com',
    role: 'Colaborador'
  },
  {
    id: 5,
    name: 'Leonard Krasner',
    position: 'Senior Designer',
    email: 'leonard.krasner@example.com',
    role: 'Administrador'
  },  
  {
    id: 6,
    name: 'Floyd Miles',
    position: 'Principal Designer',
    email: 'floyd.miles@example.com',
    role: 'Gestor'
  }
])

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'role',
    header: 'Role'
  },
  {
    id: 'action'
  }
]

function getDropdownActions(user: User): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Copy user Id',
        icon: 'i-heroicons-document-duplicate',
        onSelect: () => {
          copy(user.id.toString())

          toast.add({
            title: 'User ID copied to clipboard!',
            color: 'success',
            icon: 'i-heroicons-circle-check'
          })
        }
      }
    ],
    [
      {
        label: 'Edit',
        icon: 'i-heroicons-pencil'
      },
      {
        label: 'Delete',
        icon: 'i-heroicons-trash',
        color: 'error'
      }
    ]
  ]
}



const items: DropdownMenuItem[][] = [
  [
    {
      label: 'View',
      icon: 'i-heroicons-eye'
    },
    {
      label: 'Copy',
      icon: 'i-heroicons-document-duplicate'
    },
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil'
    }
  ],
  [
    {
      label: 'Delete',
      color: 'error',
      icon: 'i-heroicons-trash'
    }
  ]
]
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Acessos</h1>
        <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Gerencie usuários, permissões e convites para a plataforma.</p>
      </div>
      <div class="flex items-center gap-3">
        <UModal title="Convidar colaborador">
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            label="Convidar"
          />
          <template #body>
            <div class="space-y-4">
              <UFormField label="Email">
                <UInput placeholder="exemplo@email.com" />
              </UFormField>
              <UFormField label="Perfil de acesso">
                <USelect :options="['Administrador', 'Gestor', 'Colaborador']" />
              </UFormField>
            </div>
          </template>
        </UModal>
      </div>
    </div>

    <div class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-1.5 overflow-x-auto pb-0.5 sm:pb-0">
        <button
          type="button"
          class="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300"
        >
          Todos
        </button>
        <button
          type="button"
          class="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          Administradores
        </button>
        <button
          type="button"
          class="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          Gestores
        </button>
        <button
          type="button"
          class="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          Colaboradores
        </button>
      </div>
      <UInput icon="i-heroicons-magnifying-glass" placeholder="Buscar usuários" class="w-full sm:w-56" />
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <UTable :data="data" :columns="columns" class="w-full">
        <template #name-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="`https://i.pravatar.cc/120?img=${row.original.id}`"
              size="md"
              loading="lazy"
              :alt="`${row.original.name} avatar`"
            />
            <div>
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {{ row.original.name }}
              </p>
              <p class="text-xs text-slate-500">
                {{ row.original.position }}
              </p>
            </div>
          </div>
        </template>
        <template #action-cell="{ row }">
          <div class="flex justify-end">
            <UDropdownMenu :items="getDropdownActions(row.original)">
              <UButton
                icon="i-heroicons-ellipsis-vertical"
                color="neutral"
                variant="ghost"
                aria-label="Ações"
              />
            </UDropdownMenu>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>