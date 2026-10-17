<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { getEventById } from '../services/eventServices'
import { getEventImageUrl } from '../utils/media'

import LikeButton from '../components/LikeButton.vue'
import CommentSection from '../components/CommentSection.vue'

const commentsCount = ref(0)

const route = useRoute()

const event = ref(null)
const isOwner = ref(false)

const loading = ref(true)
const errorMessage = ref('')

async function loadEvent() {
  loading.value = true
  errorMessage.value = ''
  event.value = null
  isOwner.value = false


  try {
    const response = await getEventById(route.params.id)
    const body = response.data
    const eventData = body?.data ?? body

    event.value = eventData
    commentsCount.value = eventData.commentsCount ?? 0
    isOwner.value = Boolean(eventData?.isOwner)
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Não foi possível carregar o evento.'
  } finally {
    loading.value = false
  }
}

onMounted(loadEvent)

watch(
  () => route.params.id,
  () => loadEvent()
)
</script>

<template>
  <main class="detail-page">
    <RouterLink to="/feed" class="back-link">
      ← Voltar ao Feed
    </RouterLink>

    <p v-if="loading" class="status-message">
      Carregando evento...
    </p>

    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <article v-else-if="event" class="detail-card">
      <img
        v-if="event.image"
        :src="getEventImageUrl(event.image)"
        :alt="event.title"
        class="detail-image"
      />

      <div class="detail-content">
        <h1>{{ event.title }}</h1>

        <div class="event-meta">
          <span>
            Por:
            {{
              event.creator?.fullName ||
              event.creator?.username ||
              'Autor desconhecido'
            }}
          </span>

          <span>
            Visualizações: {{ event.viewsCount }}
          </span>

          <span>
            {{
              new Date(event.createdAt)
                .toLocaleDateString('pt-BR')
            }}
          </span>
        </div>

        <h2>Sobre o evento</h2>

        <p class="description">
          {{ event.description }}
        </p>
        <div class="interactions">
          <LikeButton
            :event-id="event.id"
            :initial-liked="Boolean(event.isLiked)"
            :initial-count="event.likesCount ?? 0"
          />
          <span class="comments-counter">
            <i class="bi bi-chat"></i> {{ commentsCount }}
          </span>
        </div>
        <CommentSection
          :event-id="event.id"
          @count-change="commentsCount = $event"
        />
      </div>
    </article>
  </main>
</template>

<style scoped>
.detail-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 35px 20px;
}

.back-link {
  display: inline-block;
  margin-bottom: 25px;
  color: #6c4ab6;
  text-decoration: none;
  font-weight: bold;
}

.detail-card {
  overflow: hidden;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.detail-image {
  display: block;
  width: 100%;
  max-height: 650px;
  object-fit: contain;
  background: #f4f4f4;
}

.detail-content {
  padding: 30px;
}

.interactions {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 24px;
}

h1 {
  color: #6c4ab6;
  margin-bottom: 15px;
}

h2 {
  margin-top: 30px;
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  color: #666;
  font-size: 14px;
}

.description {
  white-space: pre-wrap;
  line-height: 1.7;
  color: #444;
}

.status-message {
  text-align: center;
}

.error-message {
  padding: 20px;
  border-radius: 8px;
  background: #fde7e7;
  color: #a52121;
}
</style>
