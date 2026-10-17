<template>
  <main class="public-profile">
    <p v-if="loading">Carregando perfil...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>

    <template v-else-if="profile">
      <section class="profile-header">
        <img
          v-if="profile.profilePicture"
          :src="getProfileImageUrl(profile.profilePicture)"
          alt="Foto de perfil"
        />

        <div v-else class="placeholder">Sem foto</div>

        <div class="profile-info">
          <h1>{{ profile.fullName || profile.username }}</h1>
          <p>@{{ profile.username }}</p>
          <p>{{ profile.bio || 'Este usuário ainda não adicionou uma biografia.' }}</p>

          <div class="stats">
            <span>Seguidores: {{ profile.followersCount ?? 0 }}</span>
            <span>Seguindo: {{ profile.followingCount ?? 0 }}</span>
            <span>Eventos: {{ profile.eventsCount ?? profile.events?.length ?? 0 }}</span>
          </div>
          <RouterLink v-if="isOwner" to="/profile" class="btn btn-outline-secondary btn-sm">
            Editar Perfil
          </RouterLink>
          <button v-else-if="isLogged" type="button" class="btn btn-primary btn-sm">
            Seguir
          </button>
        </div>
      </section>

      <section class="published-events">
        <h2>Eventos publicados</h2>

        <p v-if="!profile.events?.length">
          Este usuário ainda não publicou eventos.
        </p>

        <div v-else class="events-grid">
          <article
            v-for="event in profile.events"
            :key="event.id"
            class="event-card"
          >
            <RouterLink :to="`/event/${event.id}`">
              <img
                v-if="event.image"
                :src="getEventImageUrl(event.image)"
                :alt="event.title"
              />
              <h3>{{ event.title }}</h3>
            </RouterLink>

            <p>{{ event.description }}</p>
          </article>
        </div>
      </section>
    </template>
    <p v-else>Perfil não encontrado.</p>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { getPublicProfile } from '../../services/profileService'
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'


import {
  getProfileImageUrl,
  getEventImageUrl
} from '../../utils/media'

const route = useRoute()

const profile = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const authStore = useAuthStore()
const isOwner = computed(() => Boolean(profile.value?.isOwner))
const isLogged = computed(() => Boolean(authStore.user))

async function loadProfile() {
  loading.value = true
  errorMessage.value = ''
  profile.value = response.data?.data ?? response.data

  try {
    const response = await getPublicProfile(route.params.username)
    profile.value = response.data.data
  } catch (error) {
    errorMessage.value =
      error.response?.status === 404
        ? 'Perfil não encontrado.'
        : error.response?.data?.message ||
          'Não foi possível carregar este perfil.'
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)

watch(
  () => route.params.username,
  () => loadProfile()
)
</script>

<style scoped>
.public-profile {
  max-width: 1000px;
  margin: 32px auto;
  padding: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.profile-header > img,
.placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.placeholder {
  display: grid;
  place-items: center;
  background: #ddd;
}

.profile-info {
  min-width: 0;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.event-card img {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
}

.event-card a {
  color: inherit;
  text-decoration: none;
}

.error {
  color: #c62828;
}

@media (max-width: 600px) {
  .profile-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>