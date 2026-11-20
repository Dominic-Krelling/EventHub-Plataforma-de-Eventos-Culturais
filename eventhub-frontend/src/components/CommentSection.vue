
<script setup>
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { createComment, getComments } from '../services/commentService'
import { getProfileImageUrl } from '../utils/media'
import { formatDateTime } from '../utils/format'
import { LIMITS } from '../config/constants'
import { useAsyncData } from '../composables/useAsyncData'

const MAX = LIMITS.COMMENT_MAX

const props = defineProps({
  eventId: { type: [Number, String], required: true }
})

const emit = defineEmits(['count-change'])

const authStore = useAuthStore()
const route = useRoute()

const {
  data: comments,
  isLoading: loading,
  error: loadError,
  execute: reloadComments
} = useAsyncData(
  async () => {
    const response = await getComments(props.eventId)
    const result = response.data?.data ?? response.data
    return Array.isArray(result) ? result : []
  },
  {
    watch: () => props.eventId,
    initialData: () => []
  }
)

const content = ref('')
const sending = ref(false)
const formError = ref('')

async function handleSubmit() {
  formError.value = ''

  const text = content.value.trim()

  if (!text) {
    formError.value = 'Escreva um comentário.'
    return
  }

  if (text.length > MAX) {
    formError.value = `O comentário deve ter no máximo ${MAX} caracteres.`
    return
  }

  sending.value = true

  try {
    const response = await createComment(props.eventId, text)
    const newComment = response.data?.data ?? response.data

    comments.value.unshift(newComment)
    content.value = ''

    emit('count-change', comments.value.length)
  } catch (error) {
    formError.value =
      error.response?.data?.message ||
      error.message ||
      'Não foi possível publicar o comentário.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="comments">
    <h2>Comentários ({{ comments.length }})</h2>

    <form
      v-if="authStore.isAuthenticated"
      class="comment-form"
      @submit.prevent="handleSubmit"
    >
      <textarea
        v-model="content"
        rows="3"
        placeholder="Escreva um comentário..."
        :disabled="sending"
      ></textarea>

      <div class="form-footer">
        <small :class="{ over: content.length > MAX }">
          {{ content.length }}/{{ MAX }}
        </small>

        <button type="submit" :disabled="sending">
          {{ sending ? 'Enviando...' : 'Comentar' }}
        </button>
      </div>

      <p v-if="formError" class="error">{{ formError }}</p>
    </form>

    <p v-else class="login-hint">
      <RouterLink :to="{ path: '/login', query: { redirect: route.fullPath } }">
        Entre
      </RouterLink>
      para comentar.
    </p>

    <p v-if="loading">Carregando comentários...</p>
    <p v-else-if="loadError" class="error">
      {{ loadError }}
      <button type="button" @click="reloadComments">
        Tentar novamente
      </button>
    </p>
    <p v-else-if="comments.length === 0">
      Ainda não há comentários.
    </p>

    <ul v-else class="comment-list">
      <li
        v-for="comment in comments"
        :key="comment.id"
        class="comment"
      >
        <img
          :src="getProfileImageUrl(comment.author?.profilePicture)"
          alt=""
          class="comment-avatar"
        />

        <div class="comment-body">
          <header>
            <RouterLink :to="`/profile/${comment.author?.username}`">
              {{ comment.author?.fullName || comment.author?.username || 'Usuário' }}
            </RouterLink>

            <small>{{ formatDateTime(comment.createdAt) }}</small>
          </header>

          <p class="comment-text">{{ comment.content }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.comments {
  margin-top: 32px;
}

.comment-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.form-footer button {
  padding: 8px 18px;
  border: 0;
  border-radius: 6px;
  background: #6c4ab6;
  color: #fff;
  cursor: pointer;
}

.form-footer button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.over {
  color: #c62828;
}

.error {
  color: #c62828;
}

.comment-list {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.comment {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #eee;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-body {
  min-width: 0;
}

.comment-body header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
}

.comment-body header a {
  color: #6c4ab6;
  font-weight: bold;
  text-decoration: none;
}

.comment-text {
  margin: 4px 0 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
