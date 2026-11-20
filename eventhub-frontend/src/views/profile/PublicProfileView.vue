
<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getPublicProfile } from '../../services/profileService'
import FollowButton from '../../components/FollowButton.vue'
import { useAsyncData } from '../../composables/useAsyncData'

import {
  getProfileImageUrl,
  getEventImageUrl
} from '../../utils/media'

const route = useRoute()

const {
  data: profile,
  isLoading,
  error,
  execute: reload
} = useAsyncData(
  async () => {
    const response = await getPublicProfile(route.params.username)
    return response.data?.data ?? response.data
  },
  {
    watch: () => route.params.username
  }
)

const isOwner = computed(() => Boolean(profile.value?.isOwner))
</script>

<template>
  <main class="public-profile">
    <p v-if="isLoading">Carregando perfil...</p>

    <p v-else-if="error" class="error">
      {{ error }}
      <button type="button" @click="reload">Tentar novamente</button>
    </p>

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
            <RouterLink :to="`/profile/${profile.username}/followers`">
              Seguidores: {{ profile.followersCount ?? 0 }}
            </RouterLink>

            <RouterLink :to="`/profile/${profile.username}/following`">
              Seguindo: {{ profile.followingCount ?? 0 }}
            </RouterLink>

            <span>
              Eventos: {{ profile.eventsCount ?? profile.events?.length ?? 0 }}
            </span>
          </div>

          <RouterLink
            v-if="isOwner"
            to="/profile"
            class="btn btn-outline-secondary btn-sm"
          >
            Editar Perfil
          </RouterLink>

          <FollowButton
            v-else
            :user-id="profile.id"
            v-model:following="profile.isFollowing"
            v-model:followers-count="profile.followersCount"
          />
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

.stats a {
  color: #6c4ab6;
  text-decoration: none;
}

.stats a:hover {
  text-decoration: underline;
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
