<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const email = ref('')
const password = ref('')

const auth = useAuth()
const { login, isLoading, errorMessage } = auth

async function handleLogin() {
  if (!email.value || !password.value) return
  const result = await login(email.value, password.value)
  if (result.success && result.targetRoute) {
    await navigateTo(result.targetRoute)
  }
}
</script>

<template>
  <div class="flex min-h-screen bg-gradient-to-r from-purple-600/95 via-red-400/95 to-amber-400/95">

    <!-- ilustração -->
    <div class="hidden md:flex flex-1 items-center justify-center p-8 lg:p-16">
      <!-- imagem da logo no fundo -->
      <img
        src="/Civitas_Image.png"
        class="absolute w-2/3 max-w-md opacity-36 pointer-events-none select-none bottom-0"
      />
      <!-- ilustração na frente -->
      <img
        src="/equipe-icon.png"
        alt="Ilustração de equipe"
        class="relative z-10 w-full max-w-xs lg:max-w-sm xl:max-w-md h-auto object-contain"
      />
    </div>

    <!-- card de login -->
    <div class="flex flex-1 items-center justify-center p-4 md:p-8">
      <div class="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 md:p-10 space-y-6">

        <img
          src="/civitas-logo-transparent.png"
          alt="Logo Civitas"
          class="w-32 mx-auto"
        />

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Alerta de Erro -->
          <UAlert
            v-if="errorMessage"
            title="Falha no Acesso"
            :description="errorMessage"
            color="error"
            variant="soft"
            icon="i-lucide-alert-circle"
            class="text-xs"
          />

          <UFormField label="E-mail" name="email">
            <UInput
              v-model="email"
              type="email"
              required
              placeholder="seuemail@email.com"
              class="w-full"
              :disabled="isLoading"
            />
          </UFormField>

          <UFormField label="Senha" name="password">
            <template #hint>
              <NuxtLink
                to="/forgot-password"
                class="text-xs text-blue-500 hover:underline"
              >
                Esqueceu sua senha?
              </NuxtLink>
            </template>
            <UInput
              v-model="password"
              type="password"
              required
              placeholder="Digite sua senha"
              class="w-full"
              :disabled="isLoading"
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            block
            class="mt-2"
            :loading="isLoading"
          >
            Entrar
          </UButton>
        </form>

        <hr class="border-slate-200 dark:border-slate-600" />

        <UButton
          block
          variant="outline"
          color="neutral"
          icon="i-lucide-user-plus"
          @click="navigateTo('/cadastro')"
        >
          Não tenho conta
        </UButton>

      </div>
    </div>

  </div>
</template>