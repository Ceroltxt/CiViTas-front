<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const nome = ref('')
const email = ref('')
const senha = ref('')
const departamento = ref('')
const telefone = ref('')
const aceitaTermos = ref(false)

async function handleRegister() {
  if (!aceitaTermos.value) return
  console.log('Cadastro:', { nome: nome.value, email: email.value, senha: senha.value, departamento: departamento.value, telefone: telefone.value })
}
</script>

<template>
  <div class="flex min-h-screen bg-gradient-to-r from-purple-500 via-red-400 to-amber-400">

    <!-- Lado esquerdo: ilustração (some no mobile) -->
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

    <!-- Lado direito: card de cadastro -->
    <div class="flex flex-1 items-center justify-center p-4 md:p-8">
      <div class="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 md:p-10 space-y-6">

        <img
          src="/civitas-logo-transparent.png"
          alt="Logo Civitas"
          class="w-32 mx-auto"
        />

        <form @submit.prevent="handleRegister" class="space-y-4">

          <UFormField label="Nome completo" name="nome">
            <UInput
              v-model="nome"
              type="text"
              required
              placeholder="Seu nome completo"
              class="w-full"
            />
          </UFormField>

          <UFormField label="E-mail" name="email">
            <UInput
              v-model="email"
              type="email"
              required
              placeholder="seuemail@email.com"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Senha" name="senha">
            <UInput
              v-model="senha"
              type="password"
              required
              placeholder="Crie uma senha"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Departamento" name="departamento">
            <UInput
              v-model="departamento"
              type="text"
              required
              placeholder="Ex: TI, RH, Financeiro..."
              class="w-full"
            />
          </UFormField>

          <UFormField label="Telefone" name="telefone">
            <UInput
              v-model="telefone"
              type="tel"
              required
              placeholder="(11) 99999-9999"
              class="w-full"
            />
          </UFormField>

          <!-- Termos e condições -->
          <div class="flex items-start gap-3 pt-1">
            <UCheckbox
              v-model="aceitaTermos"
              name="termos"
              required
            />
            <span class="text-sm text-slate-600 dark:text-slate-300 leading-snug">
              Li e concordo com os
              <NuxtLink to="/termos" class="text-blue-500 hover:underline font-medium">
                termos e condições
              </NuxtLink>
            </span>
          </div>

          <UButton
            type="submit"
            color="primary"
            block
            class="mt-2"
            :disabled="!aceitaTermos"
            @click="navigateTo('/ponte')" 
          >
            Criar conta
          </UButton>

        </form>

        <hr class="border-slate-200 dark:border-slate-600" />

        <span class="text-sm text-slate-600 dark:text-slate-300 text-center block">
            Já tem uma conta?
            <NuxtLink to="/login" class="text-blue-500 hover:underline font-medium">
            Faça seu login
            </NuxtLink>
        </span>

      </div>
    </div>

  </div>
</template>