<script setup>
import { ref, watch } from 'vue'
import BaseModal from './base/BaseModal.vue'
import { createCollection } from '../services/collectionService'
import { LIMITS } from '../config/constants'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'created'])

const title = ref('')
const description = ref('')
const isPublic = ref(false) // privada por padrão
const isSubmitting = ref(false)
const formError = ref('')

watch(() => props.modelValue, (open) => {
  if (!open) return
  title.value = ''
  description.value = ''
  isPublic.value = false
  formError.value = ''
})

function validate() {
  const text = title.value.trim()

  if (text.length < LIMITS.COLLECTION_TITLE_MIN || text.length > LIMITS.COLLECTION_TITLE_MAX) {
    return `O título deve ter entre ${LIMITS.COLLECTION_TITLE_MIN} e ${LIMITS.COLLECTION_TITLE_MAX} caracteres.`
  }

  return ''
}

async function submit() {
  if (isSubmitting.value) return

  formError.value = validate()
  if (formError.value) return // erro no campo: sem requisição, sem toast

  isSubmitting.value = true

  try {
    const response = await createCollection({
      title: title.value.trim(),
      description: description.value.trim(),
      isPublic: isPublic.value
    })

    emit('created', response.data)
    emit('update:modelValue', false)
  } catch (error) {
    formError.value = error?.message || 'Não foi possível criar a coleção.' // dentro do modal
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <BaseModal :model-value="modelValue" title="Nova coleção" :busy="isSubmitting" @update:model-value="emit('update:modelValue', $event)">
    <form id="create-collection-form" novalidate @submit.prevent="submit">
      <label class="field">
        <span>Título</span>
        <input v-model="title" type="text" :maxlength="LIMITS.COLLECTION_TITLE_MAX" placeholder="Ex.: Para ver neste fim de semana" />
      </label>

      <label class="field">
        <span>Descrição (opcional)</span>
        <textarea v-model="description" rows="3" :maxlength="LIMITS.COLLECTION_DESCRIPTION_MAX"></textarea>
      </label>

      <label class="check">
        <input v-model="isPublic" type="checkbox" />
        <span>Coleção pública (qualquer pessoa com o link pode ver)</span>
      </label>

      <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
    </form>

    <template #footer="{ close, busy }">
      <button type="button" class="btn-cancel" :disabled="busy" @click="close">Cancelar</button>
      <button type="submit" form="create-collection-form" class="btn-submit" :disabled="busy">
        {{ busy ? 'Criando...' : 'Criar coleção' }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
.field input, .field textarea { padding: 10px; border: 1px solid #cfc8e6; border-radius: 8px; font: inherit; }
.check { display: flex; align-items: center; gap: 8px; }
.form-error { margin: 12px 0 0; color: #c62828; }
.btn-cancel, .btn-submit { padding: 0.6rem 1rem; border: 0; border-radius: 8px; cursor: pointer; }
.btn-cancel { background: #eee; }
.btn-submit { background: #6c4ab6; color: #fff; }
button:disabled { opacity: 0.7; cursor: wait; }
</style>