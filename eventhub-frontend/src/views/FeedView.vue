
<script setup>
import { onMounted, ref } from 'vue'
import EventCard from '../components/EventCard.vue'
import { getFeed } from '../services/eventServices'

const events = ref([])
const page = ref(1)
const limit = 6

const loading = ref(false)
const hasMore = ref(false)
const errorMessage = ref('')

async function loadEvents(reset = false) {
  if (loading.value) return

  if (reset) {
    page.value = 1
    events.value = []
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await getFeed(page.value, limit)

    const items = response.data?.items || []
    const pagination = response.data?.pagination || {}

    const existingIds = new Set(
      events.value.map(event => event.id)
    )

    const newItems = items.filter(
      event => !existingIds.has(event.id)
    )

    events.value.push(...newItems)

    hasMore.value = Boolean(pagination.hasMore)

    page.value += 1
  } catch (error) {
    errorMessage.value =
      error.message || 'Erro ao carregar eventos.'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadEvents(true))
</script>

<template>
  <main class="feed-page">
    <header class="feed-header">
      <div>
        <h1>Feed Cultural</h1>
        <p>Descubra os eventos publicados pela comunidade.</p>
      </div>

      <RouterLink
        to="/events/create"
        class="create-link"
      >
        + Publicar Evento
      </RouterLink>
    </header>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}

      <button @click="loadEvents()">
        Tentar novamente
      </button>
    </div>

    <div v-if="events.length" class="events-grid">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
      />
    </div>

    <p
      v-else-if="!loading && !errorMessage"
      class="empty-message"
    >
      Nenhum evento publicado ainda.
    </p>

    <div class="feed-actions">
      <p v-if="loading">Carregando eventos...</p>

      <button
        v-if="hasMore && !loading"
        class="load-more"
        @click="loadEvents()"
      >
        Carregar mais
      </button>
    </div>
  </main>
</template>

<style scoped>
.feed-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 35px 20px;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.feed-header h1 {
  color: #6c4ab6;
}

.feed-header p {
  color: #666;
}

.create-link,
.load-more {
  display: inline-block;
  padding: 12px 20px;
  border: 0;
  border-radius: 8px;
  background: #6c4ab6;
  color: white;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.feed-actions {
  margin-top: 30px;
  text-align: center;
}

.empty-message {
  text-align: center;
  padding: 50px;
  color: #777;
}

.error-message {
  padding: 15px;
  margin-bottom: 20px;
  color: #a52121;
  background: #fde7e7;
  border-radius: 8px;
}

@media (max-width: 900px) {
  .events-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .events-grid {
    grid-template-columns: 1fr;
  }

  .feed-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
