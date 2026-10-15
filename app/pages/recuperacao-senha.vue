<script setup lang="ts">
definePageMeta({ layout: "blank" });

const showAlert = ref(false);
const email = ref("");
const isLoading = ref(false);

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
          title="E-mail enviado com sucesso!"
          description="Verifique sua caixa de entrada e siga as instruções para redefinir sua senha."
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
              color="secondary"
              :disabled="isLoading"
            />
          </UFormField>

          <UButton type="submit" color="secondary" block class="mt-2">
            Enviar Email de Recuperação
          </UButton>
        </form>
        <hr class="border-slate-200 dark:border-slate-600" />
        <UButton
          block
          variant="outline"
          color="neutral"
          icon="i-lucide-arrow-left"
          (event:@click)="navigateTo('/login')"
        >
          Voltar
        </UButton>
      </div>
    </div>
  </div>
</template>
