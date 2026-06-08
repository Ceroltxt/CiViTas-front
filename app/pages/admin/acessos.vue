<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { useClipboard } from '@vueuse/core'
definePageMeta({ sidebarWidget: 'none' })


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
  <div class="mx-auto max-w-7xl space-y-5 p-4 sm:p-6 dark:bg-slate-900 h-full">
    <div class="flex items-center justify-between md:flex-col lg:flex-row gap-4">
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Acessos</h1>
      <div class="flex items-center justify-end gap-2">
          <UModal title="Convidar novo colaborador">
    <UButton label="Convidar novo colaborador" trailing-icon="i-heroicons-plus" size="md" color="secondary" variant="subtle" />

    <template #body>
      <Placeholder class="h-48" />
        <UFormField label="Email">
    <UInput placeholder="Enter your email" />
  </UFormField>
    </template>
  </UModal>
          <UDropdownMenu :items="items" :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }">
    <UButton
      class="w-16 border-2 border-slate-200 dark:border-slate-700"
      color="neutral"
      variant="soft"
      block
      trailing-icon="i-heroicons-chevron-down"
          :avatar="{
      src: 'https://github.com/nuxt.png',
      loading: 'lazy'
    }"
    size="md"
    />
  </UDropdownMenu>
      </div>
      </div>


    <div class="flex flex-col gap-4 ">
      <ul class="flex items-center gap-2">
        <li><UButton size="md" color="secondary" variant="solid">Todos</UButton></li>
          <li><UButton size="md" color="secondary" variant="subtle">Administradores</UButton></li>
          <li><UButton size="md" color="secondary" variant="subtle">Gestores</UButton></li>
        <li><UButton size="md" color="secondary" variant="subtle">Colaboradores</UButton></li>
      </ul>

<UTable :data="data" :columns="columns" class="flex-1">
    <template #name-cell="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar
          :src="`https://i.pravatar.cc/120?img=${row.original.id}`"
          size="lg"
          loading="lazy"
          :alt="`${row.original.name} avatar`"
        />
        <div>
          <p class="font-medium text-highlighted">
            {{ row.original.name }}
          </p>
          <p>
            {{ row.original.position }}
          </p>
        </div>
      </div>
    </template>
    <template #action-cell="{ row }">
      <UDropdownMenu :items="getDropdownActions(row.original)">
        <UButton
          icon="i-heroicons-ellipsis-vertical"
          color="neutral"
          variant="ghost"
          aria-label="Actions"
        />
      </UDropdownMenu>
    </template>
  </UTable>
  </div>
      </div>
</template>