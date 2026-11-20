
<script setup>
import EventCard from '../../components/EventCard.vue'
import { getFollowingEvents } from '../../services/followService'
import { usePaginatedList } from '../../composables/usePaginatedList'

const {
  items: events,
  hasMore,
  isLoading,
  error,
  loadMore
} = usePaginatedList(
  async (page, limit) => (await getFollowingEvents(page, limit)).data
)
</script>

<template>
  <main class="following-page">
    <header class="following-header">
      <h1>Eventos de quem você segue</h1>
      <p>Só aparecem eventos publicados pelas pessoas que você segue.</p>
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
        @author-click="(username) => $router.push(`/profile/${username}`)"
      />
    </div>

    <p
      v-else-if="!isLoading && !error"
      class="empty-message"
    >
      Nada por aqui ainda. Siga pessoas para ver os eventos delas ou
      <RouterLink to="/feed">explore o Feed</RouterLink>.
    </p>

    <div class="following-actions">
      <p v-if="isLoading">Carregando eventos...</p>

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
  .events-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
