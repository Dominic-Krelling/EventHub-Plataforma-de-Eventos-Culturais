<script setup>
import { ref, watch } from 'vue'
import BaseModal from './base/BaseModal.vue'
import { reportEvent } from '../services/reportService'
import { REPORT_REASONS } from '../config/constants'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  eventId: { type: [Number, String], required: true }
})

const emit = defineEmits(['update:modelValue', 'reported'])

const reason = ref('')
const isSubmitting = ref(false)
const formError = ref('')

watch(() => props.modelValue, (open) => {
  if (!open) return
  reason.value = ''
  formError.value = ''
})

async function submit() {
  if (isSubmitting.value) return

  if (!reason.value) {
    formError.value = 'Escolha um motivo para continuar.'
    return
  }

  isSubmitting.value = true
  formError.value = ''

  try {
    await reportEvent(props.eventId, reason.value)

    emit('reported')
    emit('update:modelValue', false)
  } catch (error) {
    formError.value = error?.message || 'Não foi possível enviar a denúncia.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Denunciar evento"
    :busy="isSubmitting"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <form id="report-event-form" novalidate @submit.prevent="submit">
      <fieldset :disabled="isSubmitting" class="reasons">
        <legend>Por que você está denunciando este evento?</legend>

        <label v-for="option in REPORT_REASONS" :key="option.value" class="reason">
          <input v-model="reason" type="radio" name="reason" :value="option.value" />
          <span>{{ option.label }}</span>
        </label>
      </fieldset>

      <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
    </form>

    <template #footer="{ close, busy }">
      <button type="button" class="btn-cancel" :disabled="busy" @click="close">Cancelar</button>
      <button type="submit" form="report-event-form" class="btn-submit" :disabled="busy">
        {{ busy ? 'Enviando...' : 'Enviar denúncia' }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.reasons { margin: 0; padding: 0; border: 0; }
.reasons legend { margin-bottom: 10px; font-weight: bold; }
.reason { display: flex; align-items: center; gap: 10px; padding: 8px 0; cursor: pointer; }
.form-error { margin: 12px 0 0; color: #c62828; }
.btn-cancel, .btn-submit { padding: 0.6rem 1rem; border: 0; border-radius: 8px; cursor: pointer; }
.btn-cancel { background: #eee; }
.btn-submit { background: #c62828; color: #fff; }
button:disabled { opacity: 0.7; cursor: wait; }
</style>