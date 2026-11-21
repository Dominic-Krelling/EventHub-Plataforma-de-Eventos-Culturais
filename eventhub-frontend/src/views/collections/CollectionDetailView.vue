<script setup>
import { computed, reactive } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import EventCard from '../../components/EventCard.vue'
import { useAsyncData } from '../../composables/useAsyncData'
import { useToast } from '../../composables/useToast'
import { useAuthStore } from '../../stores/auth'
import { getCollectionById, removeEventFromCollection } from '../../services/collectionService'

const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

// 400/403/404 caem em `error` e aparecem NO LUGAR do conteúdo (leitura: sem toast)
const { data: collection, isLoading, error, execute: reload } = useAsyncData(
  async () => (await getCollectionById(route.params.id)).data,
  { watch: () => route.params.id }
)

const events = computed(() => collection.value?.events ?? [])
const isOwner = computed(() => Boolean(collection.value?.isOwner))
const ownerName = computed(() => collection.value?.owner?.fullName || collection.value?.owner?.username || '')

// remover é PESSIMISTA: espera a API, só então tira o card
const removing = reactive(new Set())

async function handleRemove(event) {
  if (removing.has(event.id)) return

  removing.add(event.id)

  try {
    const response = await removeEventFromCollection(collection.value.id, event.id)

    collection.value = {
      ...collection.value,
      events: collection.value.events.filter((item) => item.id !== event.id),
      eventsCount: response.data.eventsCount // contador do servidor
    }

    toast.success('Evento removido da coleção.')
  } catch {
    // o card fica; o toast vem do interceptor
  } finally {
    removing.delete(event.id)
  }
}
</script>

<template>
  <main class="detail-page">
    <p v-if="isLoading">Carregando coleção...</p>

    <div v-else-if="error" class="state-box" role="alert">
      <p>{{ error }}</p>
      <div class="state-actions">
        <button type="button" @click="reload">Tentar novamente</button>
        <RouterLink :to="authStore.isAuthenticated ? '/collections' : '/'">
          {{ authStore.isAuthenticated ? 'Ir para Minhas Coleções' : 'Ir para o início' }}
        </RouterLink>
      </div>
    </div>

    <template v-else-if="collection">
      <header class="header">
        <RouterLink v-if="isOwner" to="/collections" class="back">← Minhas Coleções</RouterLink>

        <h1>{{ collection.title }}</h1>

        <span class="badge" :class="collection.isPublic ? 'public' : 'private'">
          {{ collection.isPublic ? 'Pública' : 'Privada' }}
        </span>

        <p v-if="collection.description" class="description">{{ collection.description }}</p>

        <p class="meta">
          <template v-if="collection.owner">
            Por <RouterLink :to="`/profile/${collection.owner.username}`">{{ ownerName }}</RouterLink> ·
          </template>
          {{ collection.eventsCount }} {{ collection.eventsCount === 1 ? 'evento' : 'eventos' }}
        </p>
      </header>

      <p v-if="events.length === 0" class="empty">
        <template v-if="isOwner">
          Esta coleção está vazia. Abra um evento e use o botão “Salvar” para adicioná-lo.
          <RouterLink to="/search">Explorar eventos</RouterLink>
        </template>
        <template v-else>Esta coleção ainda não tem eventos.</template>
      </p>

      <section v-else class="grid">
        <EventCard v-for="event in events" :key="event.id" :event="event">
          <template v-if="isOwner" #actions>
            <button type="button" class="btn-remove" :disabled="removing.has(event.id)" @click="handleRemove(event)">
              {{ removing.has(event.id) ? 'Removendo...' : 'Remover da coleção' }}
            </button>
          </template>
        </EventCard>
      </section>
    </template>
  </main>
</template>

<style scoped>
.detail-page { max-width: 1100px; margin: 0 auto; padding: 24px; }
.header h1 { margin: 8px 0; color: #6c4ab6; }
.back { color: #6c4ab6; text-decoration: none; font-weight: bold; }
.description { color: #444; white-space: pre-wrap; }
.meta { color: #777; }
.meta a { color: #6c4ab6; }
.badge { padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold; }
.badge.public { background: #e3f6e8; color: #1b7a3a; }
.badge.private { background: #eee; color: #555; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-top: 20px; }
.state-box { padding: 24px; background: #fff; border-radius: 12px; text-align: center; box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08); }
.state-actions { display: flex; justify-content: center; gap: 16px; }
.btn-remove { width: 100%; padding: 8px; border: 1px solid #c62828; border-radius: 8px; background: #fff; color: #c62828; cursor: pointer; }
.btn-remove:disabled { opacity: 0.7; cursor: wait; }
</style>