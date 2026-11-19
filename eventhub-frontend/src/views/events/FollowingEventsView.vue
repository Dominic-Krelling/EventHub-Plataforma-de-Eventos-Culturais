<script setup>
import { onMounted, ref } from 'vue'
import EventCard from '../../components/EventCard.vue'
import { getFollowingEvents } from '../../services/followService'

const events = ref([])
const page = ref(1)
const limit = 12

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
    const response = await getFollowingEvents(page.value, limit)
    const items = Array.isArray(response.data) ? response.data : []

    const existingIds = new Set(events.value.map(event => event.id))
    events.value.push(...items.filter(event => !existingIds.has(event.id)))

    hasMore.value = items.length === limit
    page.value += 1
  } catch (error) {
    errorMessage.value = error.message || 'Erro ao carregar eventos.'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadEvents(true))
</script>

<template>
  <main class="following-page">
    <header class="following-header">
      <h1>Eventos de quem você segue</h1>
      <p>Só aparecem eventos publicados pelas pessoas que você segue.</p>
    </header>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
      <button type="button" @click="loadEvents()">Tentar novamente</button>
    </div>

    <div v-if="events.length" class="events-grid">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
        @author-click="(username) => $router.push(`/profile/${username}`)"
      />
    </div>

    <p v-else-if="!loading && !errorMessage" class="empty-message">
      Nada por aqui ainda. Siga pessoas para ver os eventos delas ou
      <RouterLink to="/feed">explore o Feed</RouterLink>.
    </p>

    <div class="following-actions">
      <p v-if="loading">Carregando eventos...</p>

      <button
        v-if="hasMore && !loading"
        type="button"
        class="load-more"
        @click="loadEvents()"
      >
        Carregar mais
      </button>
    </div>
  </main>
</template>

<style scoped>
.following-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 35px 20px;
}

.following-header h1 {
  color: #6c4ab6;
}

.following-header p {
  color: #666;
  margin-bottom: 30px;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.following-actions {
  margin-top: 30px;
  text-align: center;
}

.load-more {
  padding: 12px 20px;
  border: 0;
  border-radius: 8px;
  background: #6c4ab6;
  color: white;
  font-weight: bold;
  cursor: pointer;
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
  .events-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 600px) {
  .events-grid { grid-template-columns: 1fr; }
}
</style>