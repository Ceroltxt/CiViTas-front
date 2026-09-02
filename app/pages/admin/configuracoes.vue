<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({ sidebarWidget: 'project' })

const user = useCurrentUser()
const name = ref('Costa Neves')
const email = ref('gestor@civitas.com')
const role = ref('Gestor')

const notifications = ref(true)
const weeklyDigest = ref(false)
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value) => (colorMode.preference = value ? 'dark' : 'light'),
})

function saveChanges() {
  alert('Alterações salvas com sucesso!')
}

function changePassword() {
  alert('Funcionalidade de alterar senha em breve!')
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
    <!-- Cabeçalho -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Configurações e Perfil</h1>
        <p class="text-sm text-slate-400">Gerencie sua conta e preferências do sistema</p>
      </div>
      <UButton
        icon="i-heroicons-check"
        label="Salvar Alterações"
        class="bg-[#bd52c9] hover:bg-[#a942b4] text-white font-semibold flex items-center gap-1.5 px-4 py-2 rounded-lg"
        @click="saveChanges"
      />
    </div>

    <!-- Dados do Perfil -->
    <UiSectionCard title="Dados do Perfil">
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <UAvatar :src="user.avatar" :alt="name" size="xl" class="size-16" />
          <div class="space-y-1">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-heroicons-camera"
              label="Alterar foto"
              class="bg-white text-slate-700 border-slate-200"
            />
            <p class="text-xs text-slate-400">JPG, GIF ou PNG. Máximo de 2MB.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-4">
            <UInput v-model="name" icon="i-heroicons-user" class="w-full bg-white dark:bg-slate-900" />
            <UInput v-model="role" icon="i-heroicons-briefcase" class="w-full bg-white dark:bg-slate-900" disabled />
          </div>
          <div class="space-y-4">
            <UInput v-model="email" icon="i-heroicons-envelope" class="w-full bg-white dark:bg-slate-900" />
          </div>
        </div>
      </div>
    </UiSectionCard>

    <!-- Preferências -->
    <UiSectionCard title="Preferências">
      <div class="divide-y divide-slate-100 dark:divide-slate-800">
        <div class="flex items-center justify-between py-4">
          <div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Modo escuro</p>
            <p class="text-xs text-slate-400">Alterna o tema da interface para cores escuras</p>
          </div>
          <USwitch v-model="isDark" />
        </div>
        <div class="flex items-center justify-between py-4">
          <div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Notificações</p>
            <p class="text-xs text-slate-400">Receber alertas de tarefas, mensagens e prazos no sistema</p>
          </div>
          <USwitch v-model="notifications" />
        </div>
        <div class="flex items-center justify-between py-4">
          <div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Resumo semanal por e-mail</p>
            <p class="text-xs text-slate-400">Receba um relatório com as atividades e progresso da sua equipe toda sexta-feira</p>
          </div>
          <USwitch v-model="weeklyDigest" />
        </div>
      </div>
    </UiSectionCard>

    <!-- Segurança -->
    <UiSectionCard title="Segurança">
      <div class="flex items-center justify-between py-2">
        <div>
          <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Senha de Acesso</p>
          <p class="text-xs text-slate-400">A última alteração foi feita há 3 meses</p>
        </div>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-key"
          label="Alterar Senha"
          class="bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
          @click="changePassword"
        />
      </div>
    </UiSectionCard>
  </div>
</template>
