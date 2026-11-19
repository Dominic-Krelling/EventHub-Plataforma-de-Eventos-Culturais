<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toggleFollow } from '../services/followService'

const props = defineProps({
  userId: { type: [Number, String], required: true }
})

const following = defineModel('following', { type: Boolean, default: false })
const followersCount = defineModel('followersCount', { type: Number, default: 0 })

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isBusy = ref(false)
const errorMessage = ref('')

async function handleClick() {
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  if (isBusy.value) return

  isBusy.value = true
  errorMessage.value = ''

  const previousFollowing = following.value
  const previousCount = followersCount.value

  const nowFollowing = !previousFollowing
  following.value = nowFollowing
  followersCount.value = Math.max(0, previousCount + (nowFollowing ? 1 : -1))

  try {
    const response = await toggleFollow(props.userId)
    const data = response.data?.data ?? response.data

    following.value = data.isFollowing
    followersCount.value = data.followersCount
  } catch (error) {
    following.value = previousFollowing
    followersCount.value = previousCount

    errorMessage.value =
      error.message ||
      error.response?.data?.message ||
      'Não foi possível atualizar o seguir.'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="follow-wrapper">
    <button
      type="button"
      class="follow-button"
      :class="{ active: following }"
      :disabled="isBusy"
      :aria-pressed="following"
      @click="handleClick"
    >
      <i :class="following ? 'bi bi-person-check-fill' : 'bi bi-person-plus'"></i>
      <span>{{ following ? 'Seguindo' : 'Seguir' }}</span>
    </button>

    <p v-if="errorMessage" class="follow-error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.follow-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border: 1px solid #6c4ab6;
  border-radius: 999px;
  background: #6c4ab6;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
}

.follow-button.active {
  background: #fff;
  color: #6c4ab6;
}

.follow-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.follow-error {
  margin: 8px 0 0;
  color: #c62828;
  font-size: 0.9rem;
}
</style>