
<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { createEvent } from '../services/eventServices'

const form = reactive({
  title: '',
  description: ''
})

const imageFile = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

const loading = ref(false)
const progress = ref(0)
const uploadStarted = ref(false)

const successMessage = ref('')
const errorMessage = ref('')

const errors = reactive({
  title: '',
  description: '',
  image: ''
})

function clearPreview() {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = null
  }
}

function handleImageChange(event) {
  const file = event.target.files?.[0]

  clearPreview()
  imageFile.value = null
  errors.image = ''
  successMessage.value = ''
  errorMessage.value = ''

  if (!file) return

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ]

  if (!allowedTypes.includes(file.type)) {
    errors.image = 'Selecione uma imagem JPG, PNG ou WEBP.'
    event.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    errors.image = 'A imagem deve ter no máximo 5 MB.'
    event.target.value = ''
    return
  }

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function validateForm() {
  errors.title = ''
  errors.description = ''
  errors.image = ''

  if (!form.title.trim()) {
    errors.title = 'O título é obrigatório.'
  } else if (form.title.length > 150) {
    errors.title = 'O título deve ter até 150 caracteres.'
  }

  if (!form.description.trim()) {
    errors.description = 'A descrição é obrigatória.'
  } else if (form.description.length > 2000) {
    errors.description = 'A descrição deve ter até 2000 caracteres.'
  }

  if (!imageFile.value) {
    errors.image = 'Selecione uma imagem.'
  }

  return !Object.values(errors).some(Boolean)
}

async function handleSubmit() {
  successMessage.value = ''
  errorMessage.value = ''

  if (!validateForm()) return

  const formData = new FormData()

  formData.append('title', form.title.trim())
  formData.append('description', form.description.trim())

  // O nome precisa ser exatamente "image".
  formData.append('image', imageFile.value)

  // Diagnóstico: confira os três campos no Console.
  console.log('Campos enviados:')
  for (const [key, value] of formData.entries()) {
    console.log(key, value)
  }

  loading.value = true
  uploadStarted.value = true
  progress.value = 0

  try {
    const response = await createEvent(
      formData,
      (event) => {
        if (event.total) {
          progress.value = Math.min(
            100,
            Math.round((event.loaded / event.total) * 100)
          )
        }
      }
    )

    progress.value = 100

    successMessage.value =
      response?.message || 'Evento publicado com sucesso!'

    form.title = ''
    form.description = ''

    imageFile.value = null
    clearPreview()

    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    console.error('Erro no upload:', error)

    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Erro ao publicar o evento.'
  } finally {
    loading.value = false
  }
}

onUnmounted(clearPreview)
</script>

<template>
  <div class="event-form-page">
    <div class="event-form-card">
      <h2>Publicar Evento</h2>

      <p class="subtitle">
        Compartilhe um evento cultural no EventHub.
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Título do evento</label>

          <input
            id="title"
            v-model="form.title"
            type="text"
            maxlength="150"
            placeholder="Ex.: Festival Cultural EventHub"
            :disabled="loading"
          />

          <small v-if="errors.title" class="error">
            {{ errors.title }}
          </small>
        </div>

        <div class="form-group">
          <label for="description">Descrição</label>

          <textarea
            id="description"
            v-model="form.description"
            maxlength="2000"
            rows="5"
            placeholder="Descreva o evento..."
            :disabled="loading"
          ></textarea>

          <small v-if="errors.description" class="error">
            {{ errors.description }}
          </small>
        </div>

        <div class="form-group">
          <label for="image">Imagem de divulgação</label>

          <input
            id="image"
            ref="fileInput"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            :disabled="loading"
            @change="handleImageChange"
          />

          <small>
            Formatos permitidos: JPG, PNG e WEBP.
            Tamanho máximo: 5 MB.
          </small>

          <small v-if="errors.image" class="error">
            {{ errors.image }}
          </small>
        </div>

        <div v-if="imagePreview" class="preview-container">
          <h3>Prévia da imagem</h3>

          <img
            :src="imagePreview"
            alt="Prévia do evento"
            class="event-preview"
          />
        </div>

        <div v-if="uploadStarted" class="upload-progress">
          <div class="progress-label">
            <span>Progresso do upload</span>
            <strong>{{ progress }}%</strong>
          </div>

          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
        </div>

        <div v-if="errorMessage" class="alert-error">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="alert-success">
          {{ successMessage }}
        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="loading"
        >
          {{ loading ? 'Enviando evento...' : 'Publicar Evento' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.event-form-page {
  display: flex;
  justify-content: center;
  padding: 35px 20px;
}

.event-form-card {
  width: 100%;
  max-width: 700px;
  padding: 30px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
}

h2 {
  color: #6c4ab6;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  margin-bottom: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

label {
  font-weight: 600;
  color: #333;
}

input,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font: inherit;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #6c4ab6;
}

.form-group small {
  color: #777;
}

.form-group .error {
  color: #c62828;
}

.preview-container {
  margin-bottom: 25px;
  text-align: center;
}

.preview-container h3 {
  margin-bottom: 12px;
  color: #6c4ab6;
}

.event-preview {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 10px;
  border: 2px solid #6c4ab6;
}

.upload-progress {
  margin-bottom: 20px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-track {
  height: 24px;
  background: #e4e4e4;
  border-radius: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #6c4ab6;
  transition: width 0.15s ease;
}

.alert-error,
.alert-success {
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.alert-error {
  background: #fde7e7;
  color: #a52121;
}

.alert-success {
  background: #e3f6e8;
  color: #216e39;
}

.submit-button {
  width: 100%;
  padding: 13px;
  background: #6c4ab6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.submit-button:hover:not(:disabled) {
  background: #563895;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
