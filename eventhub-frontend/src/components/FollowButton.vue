
<script setup>
import { toggleFollow } from '../services/followService'
import { useAuthenticatedAction } from '../composables/useAuthenticatedAction'
import { runOptimistic } from '../utils/optimistic'

const props = defineProps({
  userId: { type: [Number, String], required: true }
})

const following = defineModel('following', {
  type: Boolean,
  default: false
})

const followersCount = defineModel('followersCount', {
  type: Number,
  default: 0
})

const { run, isBusy } = useAuthenticatedAction()

function handleClick() {
  return run(() => {
    const previousFollowing = following.value
    const previousCount = followersCount.value

    return runOptimistic({
      apply() {
        const nowFollowing = !previousFollowing

        following.value = nowFollowing
        followersCount.value = Math.max(
          0,
          previousCount + (nowFollowing ? 1 : -1)
        )

        return () => {
          following.value = previousFollowing
          followersCount.value = previousCount
        }
      },

      request: () => toggleFollow(props.userId),

      confirm(data) {
        following.value = data.isFollowing
        followersCount.value = data.followersCount
      }
    })
  })
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
</style>
