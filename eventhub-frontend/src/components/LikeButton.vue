
<script setup>
import { ref, watch } from 'vue'
import { toggleLike } from '../services/likeService'
import { formatCount } from '../utils/format'
import { useAuthenticatedAction } from '../composables/useAuthenticatedAction'

const props = defineProps({
  eventId: { type: [Number, String], required: true },
  initialLiked: { type: Boolean, default: false },
  initialCount: { type: Number, default: 0 }
})

const emit = defineEmits(['change'])

const { run, isBusy } = useAuthenticatedAction()

const liked = ref(props.initialLiked)
const count = ref(props.initialCount)

watch(
  () => [props.initialLiked, props.initialCount],
  ([newLiked, newCount]) => {
    liked.value = newLiked
    count.value = newCount
  }
)

function handleClick() {
  return run(async () => {
    const previousLiked = liked.value
    const previousCount = count.value

    const nowLiked = !previousLiked

    liked.value = nowLiked
    count.value = Math.max(
      0,
      previousCount + (nowLiked ? 1 : -1)
    )

    try {
      const response = await toggleLike(props.eventId)
      const data = response.data?.data ?? response.data

      liked.value = data.liked
      count.value = data.likesCount

      emit('change', {
        liked: liked.value,
        likesCount: count.value
      })
    } catch {
      liked.value = previousLiked
      count.value = previousCount
    }
  })
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
</style>
