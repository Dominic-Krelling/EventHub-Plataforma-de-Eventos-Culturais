
<script setup>
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import BaseModal from './base/BaseModal.vue'
import { useAsyncData } from '../composables/useAsyncData'
import { addEventToCollection, getCollectionsStatus, removeEventFromCollection } from '../services/collectionService'
import { runOptimistic } from '../utils/optimistic'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  eventId: { type: [Number, String], required: true }
})

const emit = defineEmits(['update:modelValue'])

// Estado inicial vem do SERVIDOR (hasEvent)
const { data: collections, isLoading, error, execute: reload } = useAsyncData(
  async () => (await getCollectionsStatus(props.eventId)).data ?? [],
  { initialData: () => [] }
)

// "Cerca por linha": cada caixa trava sozinha
const pending = reactive(new Set())

function toggle(collection) {
  if (pending.has(collection.id)) return

  pending.add(collection.id)

  const wasInCollection = collection.hasEvent
  const previousCount = collection.eventsCount

  return runOptimistic({
    apply() {
      collection.hasEvent = !wasInCollection
      collection.eventsCount = Math.max(0, previousCount + (wasInCollection ? -1 : 1))

      return () => {
        collection.hasEvent = wasInCollection
        collection.eventsCount = previousCount
      }
    },
    request: () =>
      wasInCollection
        ? removeEventFromCollection(collection.id, props.eventId)
        : addEventToCollection(collection.id, props.eventId),
    confirm(data) {
      collection.eventsCount = data.eventsCount
    }
  }).finally(() => pending.delete(collection.id))
}
</script>

<template>
  <BaseModal :model-value="modelValue" title="Salvar em coleção" @update:model-value="emit('update:modelValue', $event)">
    <p v-if="isLoading">Carregando suas coleções...</p>

    <p v-else-if="error" class="error">
      {{ error }}
      <button type="button" @click="reload">Tentar novamente</button>
    </p>

    <div v-else-if="collections.length === 0" class="empty">
      <p>Você ainda não tem coleções.</p>
      <RouterLink to="/collections" @click="emit('update:modelValue', false)">Criar a primeira coleção</RouterLink>
    </div>

    <ul v-else class="list">
      <li v-for="collection in collections" :key="collection.id">
        <label class="row">
          <!-- :checked só de ida; a mudança entra por @change (nunca v-model) -->
          <input
            type="checkbox"
            :checked="collection.hasEvent"
            :disabled="pending.has(collection.id)"
            @change="toggle(collection)"
          />
          <span class="name">{{ collection.title }}</span>
          <i v-if="!collection.isPublic" class="bi bi-lock-fill" title="Privada" aria-label="Coleção privada"></i>
          <small class="count">{{ collection.eventsCount }}</small>
        </label>
      </li>
    </ul>

    <template #footer="{ close }">
      <button type="button" class="btn-close" @click="close">Fechar</button>
    </template>
  </BaseModal>
</template>

<style scoped>
.list { margin: 0; padding: 0; list-style: none; }
.row { display: flex; align-items: center; gap: 10px; padding: 10px 4px; cursor: pointer; border-bottom: 1px solid #f0eef6; }
.name { flex: 1; }
.count { color: #777; }
.bi-lock-fill { font-size: 0.85rem; }
.error { color: #c62828; }
.btn-close { padding: 0.6rem 1rem; border: 0; border-radius: 8px; background: #6c4ab6; color: #fff; cursor: pointer; }
</style>
