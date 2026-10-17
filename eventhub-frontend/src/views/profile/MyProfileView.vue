<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref
} from 'vue'

import api from '../../services/api'
import { updateProfile } from '../../services/profileService'
import { getProfileImageUrl } from '../../utils/media'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const profile = ref(null)
const loading = ref(true)
const saving = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

const selectedFile = ref(null)
const previewUrl = ref(null)

const form = reactive({
  fullName: '',
  bio: ''
})

const currentImage = computed(() => {
  if (previewUrl.value) {
    return previewUrl.value
  }

  return getProfileImageUrl(
    profile.value?.profilePicture
  )
})

async function loadProfile() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/profile/me')

    profile.value = response.data

    form.fullName = response.data.fullName || ''
    form.bio = response.data.bio || ''

    console.log('Perfil autenticado OK:', response.data)
  } catch (error) {
    errorMessage.value =
      error.message || 'Não foi possível carregar o perfil.'
  } finally {
    loading.value = false
  }
}

function handleFileChange(event) {
  const file = event.target.files?.[0]

  if (!file) return

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    errorMessage.value = 'Selecione uma imagem JPG, PNG ou WEBP.'
    event.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'A imagem deve ter no máximo 5 MB.'
    event.target.value = ''
    return
  }

  errorMessage.value = ''

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.fullName.trim()) {
    errorMessage.value = 'O nome completo é obrigatório.'
    return
  }

  if (form.fullName.length > 100 || form.bio.length > 255) {
    errorMessage.value = 'Verifique os limites dos campos.'
    return
  }

  saving.value = true

  try {
    const formData = new FormData()

    formData.append('fullName', form.fullName.trim())
    formData.append('bio', form.bio.trim())

    if (selectedFile.value) {
      formData.append('profilePicture', selectedFile.value)
    }

    const response = await updateProfile(formData)

    profile.value = response.data

    form.fullName = response.data.fullName || ''
    form.bio = response.data.bio || ''

    authStore.setUser(response.data)

    selectedFile.value = null

    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }

    successMessage.value = 'Perfil atualizado com sucesso!'
  } catch (error) {
    errorMessage.value =
      error.message || 'Não foi possível atualizar o perfil.'
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<template>
  <div class="container py-4">
    <h1 class="mb-4 eventhub-brand">Meu Perfil</h1>

    <div v-if="loading" class="alert alert-info">
      Carregando perfil...
    </div>

    <div v-else class="card shadow-sm">
      <div class="card-body p-4">
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <template v-if="profile">
          <div class="d-flex align-items-center gap-4 mb-4">
            <img
              :src="currentImage"
              alt="Foto de perfil"
              class="profile-picture"
            />

            <div>
              <h3>{{ profile.fullName }}</h3>
              <p class="mb-1">@{{ profile.username }}</p>
              <p class="text-muted">{{ profile.email }}</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="fullName" class="form-label">
                Nome completo
              </label>

              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                class="form-control"
                maxlength="100"
              />
            </div>

            <div class="mb-3">
              <label for="bio" class="form-label">
                Bio
              </label>

              <textarea
                id="bio"
                v-model="form.bio"
                class="form-control"
                rows="4"
                maxlength="255"
              ></textarea>

              <small class="text-muted">
                {{ form.bio.length }}/255
              </small>
            </div>

            <div class="mb-4">
              <label for="profilePicture" class="form-label">
                Foto de perfil
              </label>

              <input
                id="profilePicture"
                type="file"
                class="form-control"
                accept=".jpg,.jpeg,.png,.webp"
                @change="handleFileChange"
              />
            </div>

            <button
              type="submit"
              class="btn btn-eventhub w-100"
              :disabled="saving"
            >
              {{ saving ? 'Salvando...' : 'Salvar alterações' }}
            </button>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-picture {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #6c4ab6;
}
</style>