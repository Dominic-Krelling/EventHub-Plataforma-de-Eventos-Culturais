```vue
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getEventImageUrl } from '../utils/media'

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  showAuthor: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['author-click'])

const imageUrl = computed(() =>
  getEventImageUrl(props.event.image)
)

const creatorName = computed(() =>
  props.event.creator?.fullName ||
  props.event.creator?.username ||
  'Autor desconhecido'
)

const creatorUsername = computed(() =>
  props.event.creator?.username || ''
)

const formattedDate = computed(() => {
  if (!props.event.createdAt) return ''

  return new Date(props.event.createdAt)
    .toLocaleDateString('pt-BR')
})
</script>

<template>
  <article class="event-card">
    <RouterLink
      :to="`/event/${event.id}`"
      class="event-card-link"
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
      </div>
    </RouterLink>

    <div class="event-footer">
      <button
        v-if="showAuthor && creatorUsername"
        type="button"
        class="author-link"
        @click="emit('author-click', creatorUsername)"
      >
        {{ creatorName }}
      </button>

      <span v-else>
        {{ creatorName }}
      </span>

      <span>{{ formattedDate }}</span>
    </div>

    <div class="event-actions">
      <slot name="actions" />
    </div>
  </article>
</template>

<style scoped>
.event-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: white;
  border-radius: 14px;
  color: inherit;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
}

.event-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
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
  padding: 18px 18px 0;
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
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
  padding: 0 18px 18px;
  font-size: 13px;
  color: #777;
}

.author-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #6c4ab6;
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.event-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 18px 18px;
}
</style>
```