<template>
  <main class="liked">
    <h1>Eventos curtidos</h1>

    <p v-if="loading">Carregando eventos...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="events.length === 0">
      Você ainda não curtiu nenhum evento.
      <RouterLink to="/feed">Explorar o feed</RouterLink>
    </p>

    <section v-else class="events-grid">
      <article v-for="event in events" :key="event.id" class="event-card">
        <RouterLink :to="`/event/${event.id}`">
          <img
            v-if="event.image"
            :src="getEventImageUrl(event.image)"
            :alt="event.title"
          />
          <h2>{{ event.title }}</h2>
        </RouterLink>

        <p>{{ event.description }}</p>

        <RouterLink
          v-if="event.creator?.username"
          :to="`/profile/${event.creator.username}`"
          class="author"
        >
          por {{ event.creator.fullName || event.creator.username }}
        </RouterLink>

        <div class="card-counters">
          <span><i class="bi bi-heart-fill"></i> {{ event.likesCount ?? 0 }}</span>
          <span><i class="bi bi-chat"></i> {{ event.commentsCount ?? 0 }}</span>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getLikedEvents } from '../../services/likeService'
import { getEventImageUrl } from '../../utils/media'

const events = ref([])
const loading = ref(true)
const errorMessage = ref('')

async function loadEvents() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await getLikedEvents()
    const body = response.data
    events.value = Array.isArray(body) ? body : body?.data || []
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Não foi possível carregar os eventos curtidos.'
  } finally {
    loading.value = false
  }
}

onMounted(loadEvents)
</script>

<style scoped>
.liked {
  max-width: 1100px;
  margin: 32px auto;
  padding: 24px;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.event-card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.event-card img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.event-card a {
  color: inherit;
}

.author {
  font-size: 0.9rem;
  color: #6c4ab6 !important;
}

.card-counters {
  display: flex;
  gap: 14px;
  margin-top: 8px;
  color: #666;
  font-size: 0.9rem;
}

.error {
  color: #c62828;
}
</style>