<template>
  <main class="my-events">
    <header class="page-header">
      <h1>Meus eventos</h1>
      <RouterLink to="/events/create">Publicar evento</RouterLink>
    </header>

    <p v-if="loading">Carregando eventos...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="events.length === 0">Você ainda não publicou eventos.</p>

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

        <div class="actions">
          <RouterLink :to="`/event/${event.id}`">Abrir</RouterLink>
          <RouterLink :to="`/event/${event.id}/edit`">Editar</RouterLink>
          <button
            type="button"
            :disabled="deletingId === event.id"
            @click="handleDelete(event.id)"
          >
            {{ deletingId === event.id ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../../services/api'
import { deleteEvent } from '../../services/eventServices'
import { getEventImageUrl } from '../../utils/media'

const events = ref([])
const loading = ref(true)
const errorMessage = ref('')
const deletingId = ref(null)

async function loadEvents() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/events/mine')
    const body = response.data

    events.value = Array.isArray(body) ? body : (body?.data || [])
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Não foi possível carregar seus eventos.'
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  const confirmed = window.confirm(
    'Deseja realmente excluir este evento? Esta ação não pode ser desfeita.'
  )

  if (!confirmed) return

  deletingId.value = id
  errorMessage.value = ''

  try {
    await deleteEvent(id)
    events.value = events.value.filter((event) => event.id !== id)
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      'Não foi possível excluir o evento.'
  } finally {
    deletingId.value = null
  }
}

onMounted(loadEvents)
</script>

<style scoped>
.my-events {
  max-width: 1100px;
  margin: 32px auto;
  padding: 24px;
}

.page-header,
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
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

.error {
  color: #c62828;
}
</style>