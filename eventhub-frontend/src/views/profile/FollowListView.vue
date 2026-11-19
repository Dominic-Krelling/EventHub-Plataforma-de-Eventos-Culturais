<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPublicProfile } from '../../services/profileService'
import { getFollowers, getFollowing } from '../../services/followService'
import { getProfileImageUrl } from '../../utils/media'

const props = defineProps({
  kind: { type: String, required: true } 
})

const route = useRoute()

const profile = ref(null)
const people = ref([])
const loading = ref(false)
const errorMessage = ref('')

const displayName = computed(
  () => profile.value?.fullName || profile.value?.username || ''
)

async function loadList() {
  loading.value = true
  errorMessage.value = ''
  people.value = []

  try {
    const profileResponse = await getPublicProfile(route.params.username)
    profile.value = profileResponse.data?.data ?? profileResponse.data

    const listResponse =
      props.kind === 'followers'
        ? await getFollowers(profile.value.id)
        : await getFollowing(profile.value.id)

    people.value = listResponse.data?.data ?? listResponse.data ?? []
  } catch (error) {
    profile.value = null
    errorMessage.value =
      error.status === 404
        ? 'Usuário não encontrado.'
        : error.message || 'Não foi possível carregar a lista.'
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.kind, route.params.username],
  loadList,
  { immediate: true }
)
</script>

<template>
  <main class="follow-list">
    <RouterLink
      v-if="profile || route.params.username"
      :to="`/profile/${route.params.username}`"
      class="back-link"
    >
      ← Voltar ao perfil
    </RouterLink>

    <h1 v-if="profile">{{ displayName }}</h1>

    <nav class="tabs" aria-label="Seguidores e seguindo">
      <RouterLink
        :to="`/profile/${route.params.username}/followers`"
        class="tab"
        :class="{ active: kind === 'followers' }"
      >
        Seguidores
      </RouterLink>
      <RouterLink
        :to="`/profile/${route.params.username}/following`"
        class="tab"
        :class="{ active: kind === 'following' }"
      >
        Seguindo
      </RouterLink>
    </nav>

    <p v-if="loading">Carregando...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>

    <p v-else-if="people.length === 0" class="empty">
      <template v-if="kind === 'followers'">
        {{ displayName }} ainda não tem seguidores.
      </template>
      <template v-else>
        {{ displayName }} ainda não segue ninguém.
      </template>
    </p>

    <ul v-else class="people">
      <li v-for="person in people" :key="person.id">
        <RouterLink :to="`/profile/${person.username}`" class="person">
          <img :src="getProfileImageUrl(person.profilePicture)" alt="Foto de perfil" />
          <div>
            <strong>{{ person.fullName || person.username }}</strong>
            <span>@{{ person.username }}</span>
          </div>
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.follow-list {
  max-width: 700px;
  margin: 32px auto;
  padding: 24px;
}

.back-link {
  color: #6c4ab6;
  text-decoration: none;
}

.tabs {
  display: flex;
  gap: 8px;
  margin: 16px 0 24px;
  border-bottom: 2px solid #e3e0ee;
}

.tab {
  padding: 10px 18px;
  color: #555;
  text-decoration: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab.active {
  color: #6c4ab6;
  font-weight: bold;
  border-bottom-color: #6c4ab6;
}

.people {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.person {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  color: inherit;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.person img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.person div {
  display: flex;
  flex-direction: column;
}

.person span {
  color: #777;
  font-size: 0.9rem;
}

.empty {
  color: #777;
}

.error {
  color: #c62828;
}
</style>