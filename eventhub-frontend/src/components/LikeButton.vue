<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toggleLike } from '../services/likeService'
import { formatCount } from '../utils/format'

const props = defineProps({
  eventId: { type: [Number, String], required: true },
  initialLiked: { type: Boolean, default: false },
  initialCount: { type: Number, default: 0 }
})

const emit = defineEmits(['change'])

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const liked = ref(props.initialLiked)
const count = ref(props.initialCount)
const isBusy = ref(false)
const errorMessage = ref('')

watch(
  () => [props.initialLiked, props.initialCount],
  ([newLiked, newCount]) => {
    liked.value = newLiked
    count.value = newCount
  }
)

async function handleClick() {
  // Visitante: vai ao login e volta para esta página
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  if (isBusy.value) return

  isBusy.value = true
  errorMessage.value = ''

  // Passo 1: guardar o estado anterior
  const previousLiked = liked.value
  const previousCount = count.value

  // Passo 2: atualizar a tela na hora
  liked.value = !previousLiked
  count.value = Math.max(0, previousCount + (previousLiked ? -1 : 1))

  try {
    const response = await toggleLike(props.eventId)
    const data = response.data?.data ?? response.data

    // Confirma com o valor real do servidor
    liked.value = data.liked
    count.value = data.likesCount

    emit('change', { liked: liked.value, likesCount: count.value })
  } catch (error) {
    // Passo 3: rollback se a API falhar
    liked.value = previousLiked
    count.value = previousCount

    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Não foi possível atualizar a curtida.'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="like-wrapper">
    <button
      type="button"
      class="like-button"
      :class="{ active: liked }"
      :disabled="isBusy"
      :aria-pressed="liked"
      @click="handleClick"
    >
      <i :class="liked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
      <span>{{ formatCount(count) }}</span>
    </button>

    <p v-if="errorMessage" class="like-error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.like-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #6c4ab6;
  border-radius: 999px;
  background: #fff;
  color: #6c4ab6;
  cursor: pointer;
  font-size: 1rem;
}

.like-button.active {
  background: #e53e5a;
  border-color: #e53e5a;
  color: #fff;
}

.like-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.like-error {
  margin: 8px 0 0;
  color: #c62828;
  font-size: 0.9rem;
}
</style>