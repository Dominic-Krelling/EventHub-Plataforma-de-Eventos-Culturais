
<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getLikedEvents } from '../../services/likeService'
import { getEventImageUrl } from '../../utils/media'
import { formatCount } from '../../utils/format'

const events = ref([])
const loading = ref(true)
const errorMessage = ref('')

async function loadFavorites() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await getLikedEvents()

    // O interceptor de api.js já retorna response.data.
    const result = response?.data ?? response
    const items = result?.data ?? result

    events.value = Array.isArray(items) ? items : []
  } catch (error) {
    errorMessage.value =
      error.message ||
      'Não foi possível carregar seus favoritos.'
  } finally {
    loading.value = false
  }
}

onMounted(loadFavorites)
</script>

<template>
  <main class="favorites-page">
    <header class="page-header">
      <div class="heading-icon">
        <i class="bi bi-heart-fill"></i>
      </div>

      <div>
        <h1>Meus Favoritos</h1>
        <p>Encontre os eventos que você curtiu.</p>
      </div>
    </header>

    <div v-if="loading" class="state-card" role="status">
      <i class="bi bi-arrow-repeat loading-icon"></i>
      <p>Carregando seus favoritos...</p>
    </div>

    <div v-else-if="errorMessage" class="state-card error-state">
      <i class="bi bi-exclamation-circle"></i>
      <h2>Não foi possível carregar</h2>
      <p>{{ errorMessage }}</p>

      <button type="button" class="primary-button" @click="loadFavorites">
        <i class="bi bi-arrow-clockwise"></i>
        Tentar novamente
      </button>
    </div>

    <div v-else-if="events.length === 0" class="state-card empty-state">
      <div class="empty-icon">
        <i class="bi bi-heart"></i>
      </div>

      <h2>Nenhum favorito por enquanto</h2>
      <p>
        Explore os eventos do EventHub e curta aqueles que
        você deseja encontrar novamente.
      </p>

      <RouterLink to="/feed" class="primary-button">
        <i class="bi bi-compass"></i>
        Explorar eventos
      </RouterLink>
    </div>

    <template v-else>
      <div class="results-header">
        <p>
          <strong>{{ events.length }}</strong>
          {{ events.length === 1 ? 'evento salvo' : 'eventos salvos' }}
        </p>

        <RouterLink to="/feed" class="explore-link">
          <i class="bi bi-plus-circle"></i>
          Explorar mais
        </RouterLink>
      </div>

      <section class="favorites-grid" aria-label="Eventos favoritos">
        <article
          v-for="event in events"
          :key="event.id"
          class="favorite-card"
        >
          <RouterLink
            :to="`/event/${event.id}`"
            class="event-image-link"
            :aria-label="`Ver detalhes de ${event.title}`"
          >
            <img
              v-if="event.image"
              :src="getEventImageUrl(event.image)"
              :alt="event.title"
              class="event-image"
              loading="lazy"
            />

            <div v-else class="image-placeholder">
              <i class="bi bi-calendar-event"></i>
              <span>Evento EventHub</span>
            </div>

            <span class="favorite-badge">
              <i class="bi bi-heart-fill"></i>
              Favorito
            </span>
          </RouterLink>

          <div class="card-content">
            <RouterLink
              :to="`/event/${event.id}`"
              class="event-title-link"
            >
              <h2>{{ event.title }}</h2>
            </RouterLink>

            <p class="event-description">
              {{ event.description || 'Sem descrição disponível.' }}
            </p>

            <RouterLink
              v-if="event.creator?.username"
              :to="`/profile/${event.creator.username}`"
              class="event-author"
            >
              <i class="bi bi-person-circle"></i>
              {{ event.creator.fullName || event.creator.username }}
            </RouterLink>

            <div class="card-divider"></div>

            <div class="card-footer">
              <div class="event-stat" :aria-label="`${event.likesCount ?? 0} curtidas`">
                <i class="bi bi-heart-fill"></i>
                <span>{{ formatCount(event.likesCount) }}</span>
              </div>

              <div
                class="event-stat"
                :aria-label="`${event.commentsCount ?? 0} comentários`"
              >
                <i class="bi bi-chat-dots"></i>
                <span>{{ formatCount(event.commentsCount) }}</span>
              </div>

              <RouterLink
                :to="`/event/${event.id}`"
                class="details-link"
              >
                Ver evento
                <i class="bi bi-arrow-up-right"></i>
              </RouterLink>
            </div>
          </div>
        </article>
      </section>
    </template>
  </main>
</template>

<style scoped>
.favorites-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 48px;
  color: var(--text-color, #242033);
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.heading-icon,
.empty-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #fce8ef;
  color: #df416b;
  font-size: 1.5rem;
}

.page-header h1 {
  margin: 0 0 6px;
  font-size: clamp(1.6rem, 4vw, 2rem);
  font-weight: 750;
}

.page-header p {
  margin: 0;
  color: var(--text-muted, #777184);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.results-header p {
  margin: 0;
  color: var(--text-muted, #777184);
}

.results-header strong {
  color: var(--text-color, #242033);
}

.explore-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color, #6c4ab6);
  font-weight: 600;
  text-decoration: none;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 24px;
}

.favorite-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--border-color, #e8e4ee);
  border-radius: 16px;
  background: var(--card-background, #fff);
  box-shadow: 0 4px 16px rgb(32 20 60 / 5%);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.favorite-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgb(32 20 60 / 10%);
}

.event-image-link {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: var(--surface-color, #f3f0f7);
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.favorite-card:hover .event-image {
  transform: scale(1.04);
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  color: var(--text-muted, #777184);
}

.image-placeholder i {
  font-size: 2.5rem;
}

.favorite-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  background: #fff;
  color: #df416b;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.card-content {
  padding: 18px;
}

.event-title-link {
  color: inherit;
  text-decoration: none;
}

.event-title-link h2 {
  display: -webkit-box;
  overflow: hidden;
  margin: 0 0 10px;
  font-size: 1.15rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.event-title-link:hover {
  color: var(--primary-color, #6c4ab6);
}

.event-description {
  display: -webkit-box;
  overflow: hidden;
  min-height: 44px;
  margin: 0 0 14px;
  color: var(--text-muted, #777184);
  font-size: 0.92rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
  white-space: pre-line;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.event-author {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color, #6c4ab6);
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
}

.card-divider {
  height: 1px;
  margin: 18px 0 14px;
  background: var(--border-color, #e8e4ee);
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 14px;
}

.event-stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted, #777184);
  font-size: 0.88rem;
}

.event-stat:first-child i {
  color: #df416b;
}

.details-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  color: var(--primary-color, #6c4ab6);
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 260px;
  padding: 32px 20px;
  border: 1px solid var(--border-color, #e8e4ee);
  border-radius: 16px;
  background: var(--card-background, #fff);
  text-align: center;
}

.state-card > i {
  font-size: 2rem;
}

.state-card h2,
.state-card p {
  margin: 0;
}

.state-card p {
  max-width: 440px;
  color: var(--text-muted, #777184);
  line-height: 1.6;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

.error-state > i {
  color: #c62828;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  margin-top: 8px;
  padding: 10px 18px;
  border: 0;
  border-radius: 10px;
  background: var(--primary-color, #6c4ab6);
  color: #fff;
  font: inherit;
  font-weight: 650;
  text-decoration: none;
  cursor: pointer;
}

.primary-button:hover {
  filter: brightness(0.94);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .favorites-page {
    padding: 24px 16px 36px;
  }

  .page-header {
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .heading-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
  }

  .results-header {
    align-items: flex-start;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .favorite-card,
  .event-image {
    transition: none;
  }

  .loading-icon {
    animation: none;
  }
}
</style>
