<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref
} from 'vue'

import {
  getMyProfile,
  updateProfile
} from '../../services/profileService'

import {
  getProfilePictureUrl
} from '../../utils/media'

import {
  useAuthStore
} from '../../stores/auth'

const authStore =
  useAuthStore()

const loading =
  ref(true)

const saving =
  ref(false)

const errorMessage =
  ref('')

const successMessage =
  ref('')

const selectedFile =
  ref(null)

const previewUrl =
  ref(null)

const profile =
  ref(null)

const form =
  reactive({
    fullName: '',
    bio: ''
  })

const errors =
  reactive({
    fullName: '',
    bio: '',
    profilePicture: ''
  })

const currentImage =
  computed(() => {
    if (previewUrl.value) {
      return previewUrl.value
    }

    return getProfilePictureUrl(
      profile.value
        ?.profilePicture
    )
  })

function clearErrors() {
  errors.fullName =
    ''

  errors.bio =
    ''

  errors.profilePicture =
    ''
}

function validateForm() {
  clearErrors()

  if (
    !form.fullName.trim()
  ) {
    errors.fullName =
      'O nome completo é obrigatório.'
  }

  if (
    form.fullName.trim()
      .length > 100
  ) {
    errors.fullName =
      'O nome completo deve ter no máximo 100 caracteres.'
  }

  if (
    form.bio.length >
    255
  ) {
    errors.bio =
      'A bio deve ter no máximo 255 caracteres.'
  }

  if (
    selectedFile.value &&
    selectedFile.value.size >
      5 * 1024 * 1024
  ) {
    errors.profilePicture =
      'A imagem deve ter no máximo 5 MB.'
  }

  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ]

  if (
    selectedFile.value &&
    !validTypes.includes(
      selectedFile.value.type
    )
  ) {
    errors.profilePicture =
      'Selecione uma imagem JPG, PNG ou WEBP.'
  }

  return (
    !errors.fullName &&
    !errors.bio &&
    !errors.profilePicture
  )
}

async function loadProfile() {
  loading.value =
    true

  errorMessage.value =
    ''

  try {
    const response =
      await getMyProfile()

    profile.value =
      response.data

    form.fullName =
      response.data
        .fullName || ''

    form.bio =
      response.data
        .bio || ''

    authStore.setUser(
      response.data
    )

    console.log(
      'Perfil autenticado OK:',
      response.data
    )
  } catch (error) {
    errorMessage.value =
      error.message ||
      'Não foi possível carregar o perfil.'
  } finally {
    loading.value =
      false
  }
}

function handleFileChange(
  event
) {
  errorMessage.value =
    ''

  successMessage.value =
    ''

  errors.profilePicture =
    ''

  const file =
    event.target.files[0]

  if (!file) {
    return
  }

  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ]

  if (
    !validTypes.includes(
      file.type
    )
  ) {
    errors.profilePicture =
      'Selecione uma imagem JPG, PNG ou WEBP.'

    event.target.value =
      ''

    return
  }

  if (
    file.size >
    5 * 1024 * 1024
  ) {
    errors.profilePicture =
      'A imagem deve ter no máximo 5 MB.'

    event.target.value =
      ''

    return
  }

  if (
    previewUrl.value
  ) {
    URL.revokeObjectURL(
      previewUrl.value
    )
  }

  selectedFile.value =
    file

  previewUrl.value =
    URL.createObjectURL(
      file
    )
}

async function handleSubmit() {
  errorMessage.value =
    ''

  successMessage.value =
    ''

  if (!validateForm()) {
    return
  }

  saving.value =
    true

  try {
    const formData =
      new FormData()

    formData.append(
      'fullName',
      form.fullName.trim()
    )

    formData.append(
      'bio',
      form.bio.trim()
    )

    if (
      selectedFile.value
    ) {
      formData.append(
        'profilePicture',
        selectedFile.value
      )
    }

    const response =
      await updateProfile(
        formData
      )

    profile.value =
      response.data

    authStore.setUser(
      response.data
    )

    form.fullName =
      response.data
        .fullName || ''

    form.bio =
      response.data
        .bio || ''

    selectedFile.value =
      null

    if (
      previewUrl.value
    ) {
      URL.revokeObjectURL(
        previewUrl.value
      )

      previewUrl.value =
        null
    }

    successMessage.value =
      'Perfil atualizado com sucesso!'
  } catch (error) {
    errorMessage.value =
      error.message ||
      'Não foi possível atualizar o perfil.'
  } finally {
    saving.value =
      false
  }
}

onMounted(() => {
  loadProfile()
})

onUnmounted(() => {
  if (
    previewUrl.value
  ) {
    URL.revokeObjectURL(
      previewUrl.value
    )
  }
})
</script>

<template>
  <div
    class="container py-4"
  >
    <div
      class="row justify-content-center"
    >
      <div
        class="col-12 col-lg-8"
      >
        <div
          class="card shadow-sm"
        >
          <div
            class="card-body p-4"
          >
            <h1
              class="eventhub-brand mb-4"
            >
              Meu Perfil
            </h1>

            <div
              v-if="loading"
              class="alert alert-info"
            >
              Carregando perfil...
            </div>

            <template
              v-else
            >
              <div
                v-if="errorMessage"
                class="alert alert-danger"
              >
                {{
                  errorMessage
                }}
              </div>

              <div
                v-if="successMessage"
                class="alert alert-success"
              >
                {{
                  successMessage
                }}
              </div>

              <div
                class="profile-header"
              >
                <img
                  :src="currentImage"
                  alt="Foto de perfil"
                  class="profile-picture"
                >

                <div>
                  <h4
                    class="mb-1"
                  >
                    {{
                      profile?.fullName
                    }}
                  </h4>

                  <p
                    class="text-muted mb-1"
                  >
                    @{{
                      profile?.username
                    }}
                  </p>

                  <p
                    class="text-muted mb-0"
                  >
                    {{
                      profile?.email
                    }}
                  </p>
                </div>
              </div>

              <hr>

              <form
                @submit.prevent="
                  handleSubmit
                "
              >
                <div
                  class="mb-3"
                >
                  <label
                    for="fullName"
                    class="form-label"
                  >
                    Nome completo
                  </label>

                  <input
                    id="fullName"
                    v-model="
                      form.fullName
                    "
                    name="fullName"
                    type="text"
                    class="form-control"
                    maxlength="100"
                  >

                  <div
                    v-if="
                      errors.fullName
                    "
                    class="text-danger mt-1"
                  >
                    {{
                      errors.fullName
                    }}
                  </div>
                </div>

                <div
                  class="mb-3"
                >
                  <label
                    for="bio"
                    class="form-label"
                  >
                    Bio
                  </label>

                  <textarea
                    id="bio"
                    v-model="
                      form.bio
                    "
                    name="bio"
                    class="form-control"
                    rows="4"
                    maxlength="255"
                  ></textarea>

                  <div
                    class="d-flex justify-content-between mt-1"
                  >
                    <div>
                      <span
                        v-if="
                          errors.bio
                        "
                        class="text-danger"
                      >
                        {{
                          errors.bio
                        }}
                      </span>
                    </div>

                    <small
                      class="text-muted"
                    >
                      {{
                        form.bio.length
                      }}/255
                    </small>
                  </div>
                </div>

                <div
                  class="mb-4"
                >
                  <label
                    for="profilePicture"
                    class="form-label"
                  >
                    Foto de perfil
                  </label>

                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    class="form-control"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    @change="
                      handleFileChange
                    "
                  >

                  <div
                    v-if="
                      errors.profilePicture
                    "
                    class="text-danger mt-1"
                  >
                    {{
                      errors.profilePicture
                    }}
                  </div>

                  <small
                    class="text-muted"
                  >
                    JPG, PNG ou WEBP.
                    Máximo de 5 MB.
                  </small>
                </div>

                <div
                  class="profile-stats mb-4"
                >
                  <div>
                    <strong>
                      {{
                        profile?.followersCount
                      }}
                    </strong>

                    <span>
                      Seguidores
                    </span>
                  </div>

                  <div>
                    <strong>
                      {{
                        profile?.followingCount
                      }}
                    </strong>

                    <span>
                      Seguindo
                    </span>
                  </div>

                  <div>
                    <strong>
                      {{
                        profile?.eventsCount
                      }}
                    </strong>

                    <span>
                      Eventos
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-eventhub w-100"
                  :disabled="
                    saving
                  "
                >
                  {{
                    saving
                      ? 'Salvando...'
                      : 'Salvar alterações'
                  }}
                </button>
              </form>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-header {
  display:
    flex;

  align-items:
    center;

  gap:
    20px;

  margin-bottom:
    20px;
}

.profile-picture {
  width:
    130px;

  height:
    130px;

  border-radius:
    50%;

  object-fit:
    cover;

  border:
    4px solid #6c4ab6;
}

.profile-stats {
  display:
    flex;

  justify-content:
    space-around;

  padding:
    18px;

  background:
    #f5f6fa;

  border-radius:
    10px;
}

.profile-stats div {
  display:
    flex;

  flex-direction:
    column;

  text-align:
    center;
}

.profile-stats strong {
  font-size:
    1.3rem;

  color:
    #6c4ab6;
}

.profile-stats span {
  color:
    #6c757d;

  font-size:
    0.9rem;
}

@media (
  max-width: 576px
) {
  .profile-header {
    flex-direction:
      column;

    text-align:
      center;
  }

  .profile-stats {
    gap:
      10px;
  }
}
</style>