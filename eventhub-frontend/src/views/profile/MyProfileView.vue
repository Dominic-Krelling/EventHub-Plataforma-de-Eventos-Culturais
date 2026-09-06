<script setup>
import { onMounted, ref } from 'vue'
import api from '../../services/api'

const profile = ref(null)
const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const response = await api.get('/profile/me')

    profile.value = response.data

    console.log(
      'Perfil autenticado OK:',
      profile.value
    )
  } catch (error) {
    errorMessage.value =
      error.message ||
      'Não foi possível carregar o perfil.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container py-4">
    <h1 class="mb-4">Meu Perfil</h1>

    <div
      v-if="loading"
      class="alert alert-info"
    >
      Carregando perfil...
    </div>

    <div
      v-else-if="errorMessage"
      class="alert alert-danger"
    >
      {{ errorMessage }}
    </div>

    <div
      v-else-if="profile"
      class="card"
    >
      <div class="card-body">
        <h3 class="card-title">
          {{ profile.fullName }}
        </h3>

        <p class="mb-2">
          <strong>Usuário:</strong>
          @{{ profile.username }}
        </p>

        <p class="mb-2">
          <strong>E-mail:</strong>
          {{ profile.email }}
        </p>

        <p class="mb-2">
          <strong>Bio:</strong>
          {{ profile.bio || 'Nenhuma bio cadastrada.' }}
        </p>

        <hr>

        <div class="d-flex gap-4">
          <span>
            <strong>
              {{ profile.followersCount }}
            </strong>
            seguidores
          </span>

          <span>
            <strong>
              {{ profile.followingCount }}
            </strong>
            seguindo
          </span>

          <span>
            <strong>
              {{ profile.eventsCount }}
            </strong>
            eventos
          </span>
        </div>
      </div>
    </div>
  </div>
</template>