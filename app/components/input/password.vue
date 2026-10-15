<script setup lang="ts">
const show = ref(false);
const password = ref("");
const email = ref("");
const password = ref("");

const auth = useAuth();
const { login, isLoading, errorMessage } = auth;

async function handleLogin() {
  if (!email.value || !password.value) return;
  const result = await login(email.value, password.value);
  if (result.success && result.targetRoute) {
    await navigateTo(result.targetRoute);
  }
}
</script>

<template>
  <UInput
    v-model="password"
    placeholder="Senha"
    :type="show ? 'text' : 'password'"
    :ui="{ trailing: 'pe-1' }"
    :disabled="isLoading"
  >
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="show ? 'Hide password' : 'Show password'"
        :aria-pressed="show"
        aria-controls="password"
        @click="show = !show"
      />
    </template>
  </UInput>
</template>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
  display: none;
}
</style>
