
<script setup>
import EventCard from '../components/EventCard.vue'
import { getFeed } from '../services/eventServices'
import { usePaginatedList } from '../composables/usePaginatedList'

const {
  items: events,
  hasMore,
  isLoading,
  error,
  loadMore
} = usePaginatedList(
  async (page, limit) => (await getFeed(page, limit)).data
)
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

    <div v-if="error" class="error-message">
      {{ error }}

      <button type="button" @click="loadMore">
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
      v-else-if="!isLoading && !error"
      class="empty-message"
    >
      Nenhum evento publicado ainda.
    </p>

    <div class="feed-actions">
      <p v-if="isLoading">
        Carregando eventos...
      </p>

      <button
        v-if="hasMore && !isLoading"
        type="button"
        class="load-more"
        @click="loadMore"
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
