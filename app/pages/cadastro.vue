<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const { register, isLoading, errorMessage } = useAuth()

const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const departamento = ref('')
const telefone = ref('')
const aceitaTermos = ref(false)
const erroLocal = ref<string | null>(null)

const requisitosSenha = computed(() => ({
  maiusculaENumero: /[A-Z]/.test(senha.value) && /\d/.test(senha.value),
  caractereEspecial: /[^A-Za-z0-9]/.test(senha.value),
  minimoOitoCaracteres: senha.value.length >= 8,
  senhasCorrespondem: senha.value.length > 0 && senha.value === confirmarSenha.value
}))

const senhaValida = computed(() => Object.values(requisitosSenha.value).every(Boolean))

async function handleRegister() {
  if (!aceitaTermos.value || !senhaValida.value) return
  erroLocal.value = null

  const res = await register({
    nome: nome.value,
    email: email.value,
    password: senha.value,
    departamento: departamento.value,
  })

  if (res.success) {
    await navigateTo('/ponte')
  } else {
    erroLocal.value = res.error || errorMessage.value || 'Erro ao criar conta.'
  }
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

        <div
          v-if="erroLocal"
          class="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 flex items-center gap-2"
        >
          <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 shrink-0" />
          <span>{{ erroLocal }}</span>
        </div>

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

          <div class="-mt-2 space-y-1 text-xs" aria-live="polite">
            <p
              class="flex items-center gap-1.5"
              :class="requisitosSenha.maiusculaENumero ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'"
            >
              <span aria-hidden="true">{{ requisitosSenha.maiusculaENumero ? '✓' : '○' }}</span>
              Ter no mínimo 1 maiúscula e 1 número
            </p>
            <p
              class="flex items-center gap-1.5"
              :class="requisitosSenha.caractereEspecial ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'"
            >
              <span aria-hidden="true">{{ requisitosSenha.caractereEspecial ? '✓' : '○' }}</span>
              Ter 1 caractere especial
            </p>
            <p
              class="flex items-center gap-1.5"
              :class="requisitosSenha.minimoOitoCaracteres ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'"
            >
              <span aria-hidden="true">{{ requisitosSenha.minimoOitoCaracteres ? '✓' : '○' }}</span>
              Ter no mínimo 8 caracteres
            </p>
          </div>

          <UFormField label="Confirmar senha" name="confirmarSenha">
            <UInput
              v-model="confirmarSenha"
              type="password"
              required
              placeholder="Digite a senha novamente"
              class="w-full"
            />
          </UFormField>

          <p
            class="-mt-2 flex items-center gap-1.5 text-xs"
            :class="requisitosSenha.senhasCorrespondem ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'"
            aria-live="polite"
          >
            <span aria-hidden="true">{{ requisitosSenha.senhasCorrespondem ? '✓' : '○' }}</span>
            Senhas correspondentes nos dois campos
          </p>

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
            :loading="isLoading"
            :disabled="!aceitaTermos || !senhaValida || isLoading"
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
