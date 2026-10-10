
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getEventImageUrl } from '../utils/media'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const imageUrl = computed(() =>
  getEventImageUrl(props.event.image)
)

const creatorName = computed(() =>
  props.event.creator?.fullName ||
  props.event.creator?.username ||
  'Autor desconhecido'
)

const formattedDate = computed(() => {
  if (!props.event.createdAt) return ''

  return new Date(props.event.createdAt)
    .toLocaleDateString('pt-BR')
})
</script>

<template>
  <RouterLink
    :to="`/event/${event.id}`"
    class="event-card"
  >
    <div class="event-image-wrapper">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="event.title"
        class="event-image"
      />

      <div v-else class="no-image">
        Sem imagem
      </div>
    </div>

    <div class="event-content">
      <h3>{{ event.title }}</h3>

      <p class="event-description">
        {{ event.description }}
      </p>

      <div class="event-footer">
        <span>{{ creatorName }}</span>
        <span>{{ formattedDate }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.event-card {
  display: block;
  overflow: hidden;
  background: white;
  border-radius: 14px;
  color: inherit;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
}

.event-image-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #eee;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #777;
}

.event-content {
  padding: 18px;
}

h3 {
  margin: 0 0 10px;
  color: #6c4ab6;
}

.event-description {
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 60px;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
  font-size: 13px;
  color: #777;
}
</style>
