
<template>
  <main class="my-events">
    <header class="page-header">
      <h1>Meus eventos</h1>
      <RouterLink to="/events/create">Publicar evento</RouterLink>
    </header>

    <p v-if="isLoading">Carregando eventos...</p>

    <p v-else-if="error" class="error">
      {{ error }}
      <button type="button" @click="reload">
        Tentar novamente
      </button>
    </p>

    <p v-else-if="events.length === 0">
      Você ainda não publicou eventos.
    </p>

    <section v-else class="events-grid">
      <article
        v-for="event in events"
        :key="event.id"
        class="event-card"
      >
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
          <RouterLink :to="`/event/${event.id}`">
            Abrir
          </RouterLink>

          <RouterLink :to="`/event/${event.id}/edit`">
            Editar
          </RouterLink>

          <button
            type="button"
            :disabled="isDeleting"
            @click="askToDelete(event)"
          >
            Excluir
          </button>
        </div>
      </article>
    </section>

    <BaseModal
      :model-value="Boolean(eventToDelete)"
      title="Excluir evento"
      :busy="isDeleting"
      @update:model-value="eventToDelete = null"
      @confirm="confirmDelete"
    >
      <p>
        Deseja realmente excluir
        <strong>{{ eventToDelete?.title }}</strong>?
        Esta ação não pode ser desfeita.
      </p>
    </BaseModal>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { deleteEvent, getMyEvents } from '../../services/eventServices'
import { getEventImageUrl } from '../../utils/media'
import { useAsyncData } from '../../composables/useAsyncData'
import { useToast } from '../../composables/useToast'
import BaseModal from '../../components/base/BaseModal.vue'

const toast = useToast()

const {
  data: events,
  isLoading,
  error,
  execute: reload
} = useAsyncData(
  async () => (await getMyEvents()).data ?? [],
  { initialData: () => [] }
)

const eventToDelete = ref(null)
const isDeleting = ref(false)

function askToDelete(event) {
  eventToDelete.value = event
}

async function confirmDelete() {
  const target = eventToDelete.value

  if (!target || isDeleting.value) return

  isDeleting.value = true

  try {
    await deleteEvent(target.id)

    events.value = events.value.filter(
      (event) => event.id !== target.id
    )

    eventToDelete.value = null
    toast.success('Evento excluído com sucesso.')
  } catch {
    // O interceptor da API já apresenta a mensagem de erro.
  } finally {
    isDeleting.value = false
  }
}
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
