<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

const SUPPORT_EMAIL = 'suporte@civitas.com'
</script>

<template>
  <UModal
    v-model:open="open"
    title="Central de Ajuda"
    :ui="{ content: 'max-w-md' }"
  >
    <template #body>
      <div class="space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <p>Precisa de suporte? Aqui estão algumas opções rápidas:</p>
        <ul class="list-inside list-disc space-y-1 text-slate-500">
          <li>Consulte a documentação do CiViTas</li>
          <li>Entre em contato com o suporte: <strong>{{ SUPPORT_EMAIL }}</strong></li>
          <li>Fale com seu gestor direto sobre dúvidas de projeto</li>
        </ul>
      </div>
    </template>
  </UModal>
</template>
