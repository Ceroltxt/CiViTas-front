<script setup lang="ts">
definePageMeta({ layout: "blank" });

const showAlert = ref(false);
const email = ref("");
const isLoading = ref(false);
const senha = ref("");
const confirmarSenha = ref("");
const showPassword = ref(false);

const requisitosSenha = computed(() => ({
  maiusculaENumero: /[A-Z]/.test(senha.value) && /\d/.test(senha.value),
  caractereEspecial: /[^A-Za-z0-9]/.test(senha.value),
  minimoOitoCaracteres: senha.value.length >= 8,
  senhasCorrespondem:
    senha.value.length > 0 && senha.value === confirmarSenha.value,
}));

function handleLogin() {
  showAlert.value = true;
}
</script>

<template>
  <div
    class="flex min-h-screen bg-linear-to-r from-purple-600/95 via-red-400/95 to-amber-400/95"
  >
    <div class="hidden md:flex flex-1 items-center justify-center p-8 lg:p-16">
      <!-- imagem da logo no fundo -->
      <img
        src="../../equipe-icon.png"
        class="absolute w-2/3 max-w-md pointer-events-none select-none"
      />
    </div>
    <div class="flex flex-1 items-center justify-center p-4 md:p-8">
      <div
        class="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 md:p-10 space-y-6"
      >
        <img
          src="/civitas-logo-transparent.png"
          alt="Logo Civitas"
          class="w-32 mx-auto"
        />

        <UAlert
          v-if="showAlert"
          title="Senha redefinida com sucesso!"
          description="Sua senha foi redefinida com sucesso! Acesse o Civitas com sua nova senha."
          color="info"
          variant="soft"
          icon="i-lucide-badge-check"
          class="text-xs"
        />

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Alerta de envio para o e-mail com a senha do user -->

          <UFormField label="E-mail" name="email">
            <UInput
              v-model="email"
              type="email"
              required
              placeholder="seuemail@email.com"
              class="w-full"
              color="primary"
              :disabled="isLoading"
            />
          </UFormField>

                    <UFormField label="Redefinir senha" name="senha">
            <UInput
              v-model="senha"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Digite sua nova senha"
              class="w-full"
              :disabled="isLoading"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="ghost"
                  :icon="
                    showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                  "
                  :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                  :disabled="isLoading"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <div class="-mt-2 space-y-1 text-xs" aria-live="polite">
            <p
              class="flex items-center gap-1.5"
              :class="
                requisitosSenha.maiusculaENumero
                  ? 'text-emerald-600'
                  : 'text-slate-500 dark:text-slate-400'
              "
            >
              <span aria-hidden="true">{{
                requisitosSenha.maiusculaENumero ? "✓" : "○"
              }}</span>
              Ter no mínimo 1 maiúscula e 1 número
            </p>
            <p
              class="flex items-center gap-1.5"
              :class="
                requisitosSenha.caractereEspecial
                  ? 'text-emerald-600'
                  : 'text-slate-500 dark:text-slate-400'
              "
            >
              <span aria-hidden="true">{{
                requisitosSenha.caractereEspecial ? "✓" : "○"
              }}</span>
              Ter 1 caractere especial
            </p>
            <p
              class="flex items-center gap-1.5"
              :class="
                requisitosSenha.minimoOitoCaracteres
                  ? 'text-emerald-600'
                  : 'text-slate-500 dark:text-slate-400'
              "
            >
              <span aria-hidden="true">{{
                requisitosSenha.minimoOitoCaracteres ? "✓" : "○"
              }}</span>
              Ter no mínimo 8 caracteres
            </p>
          </div>

                    <UFormField label="Confirmar senha" name="confirmarSenha">
            <UInput
              v-model="confirmarSenha"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Digite sua senha"
              class="w-full"
              :disabled="isLoading"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="ghost"
                  :icon="
                    showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                  "
                  :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                  :disabled="isLoading"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <p
            class="-mt-2 flex items-center gap-1.5 text-xs"
            :class="
              requisitosSenha.senhasCorrespondem
                ? 'text-emerald-600'
                : 'text-slate-500 dark:text-slate-400'
            "
            aria-live="polite"
          >
            <span aria-hidden="true">{{
              requisitosSenha.senhasCorrespondem ? "✓" : "○"
            }}</span>
            Senhas correspondentes nos dois campos
          </p>

          <UButton type="submit" color="primary" block class="mt-2">
            Redefinir sua senha
          </UButton>
        </form>
        <hr class="border-slate-200 dark:border-slate-600" />
        <UButton
          block
          variant="outline"
          color="neutral"
          icon="i-lucide-arrow-left"
          @click="navigateTo('/login')"
        >
          Voltar
        </UButton>
      </div>
    </div>
  </div>
</template>
