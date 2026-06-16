<script setup lang="ts">
definePageMeta({ sidebarWidget: 'none' })

const user = useCurrentUser()
const notifications = ref(true)
const weeklyDigest = ref(false)
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value) => (colorMode.preference = value ? 'dark' : 'light'),
})
</script>

<template>
  <div class="space-y-5 p-4 sm:p-4 dark:bg-slate-900 h-full">


          <div>
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Configurações</h1>
      <p class="text-sm text-slate-400">Gerencie sua conta e preferências</p>
    </div>

    <UiSectionCard title="Perfil">
      <div class="flex items-center gap-4">
        <UAvatar :src="user.avatar" :alt="user.name" size="xl" />
        <div>
          <p class="font-semibold text-slate-800 dark:text-slate-100">{{ user.name }}</p>
          <p class="text-sm text-slate-400">{{ user.role }}</p>
        </div>
        <UButton color="neutral" variant="outline" label="Editar perfil" class="ml-auto" />
      </div>
    </UiSectionCard>

    <UiSectionCard title="Preferências">
      <div class="divide-y divide-slate-100 dark:divide-slate-800">
        <div class="flex items-center justify-between py-3">
          <div>
            <p class="text-sm font-medium text-slate-700 dark:text-slate-200">Modo escuro</p>
            <p class="text-xs text-slate-400">Alterna o tema da interface</p>
          </div>
          <USwitch v-model="isDark" />
        </div>
        <div class="flex items-center justify-between py-3">
          <div>
            <p class="text-sm font-medium text-slate-700 dark:text-slate-200">Notificações</p>
            <p class="text-xs text-slate-400">Receber alertas de tarefas e prazos</p>
          </div>
          <USwitch v-model="notifications" />
        </div>
        <div class="flex items-center justify-between py-3">
          <div>
            <p class="text-sm font-medium text-slate-700 dark:text-slate-200">Resumo semanal</p>
            <p class="text-xs text-slate-400">Enviar um e-mail com o resumo da semana</p>
          </div>
          <USwitch v-model="weeklyDigest" />
        </div>
      </div>
    </UiSectionCard>
    </div>


</template>
