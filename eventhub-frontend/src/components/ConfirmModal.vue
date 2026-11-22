<script setup>
import BaseModal from './base/BaseModal.vue'

defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirmar' },
  confirmVariant: { type: String, default: 'danger' },
  busy: { type: Boolean, default: false }
})

const emit = defineEmits(['confirm', 'close'])
</script>

<template>
  <BaseModal :model-value="true" :title="title" :busy="busy" @update:model-value="emit('close')">
    <p class="message">{{ message }}</p>

    <template #footer>
      <button type="button" class="btn-cancel" :disabled="busy" @click="emit('close')">
        Cancelar
      </button>

      <button
        type="button"
        class="btn-confirm"
        :class="confirmVariant"
        :disabled="busy"
        @click="emit('confirm')"
      >
        {{ busy ? 'Aguarde...' : confirmLabel }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.message { margin: 0; line-height: 1.5; }
.btn-cancel, .btn-confirm { padding: 0.6rem 1rem; border: 0; border-radius: 8px; cursor: pointer; }
.btn-cancel { background: #ececf3; color: #242333; }
.btn-confirm { color: #fff; background: #6c4ab6; }
.btn-confirm.danger { background: #c62828; }
.btn-cancel:disabled, .btn-confirm:disabled { opacity: 0.6; cursor: wait; }
</style>