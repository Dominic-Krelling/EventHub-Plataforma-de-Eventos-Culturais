<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api'
import { getEventImageUrl } from '../../utils/media'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const currentImage = ref('')
const selectedFile = ref(null)
const previewUrl = ref(null)

const form = reactive({
  title: '',
  description: ''
})

async function loadEvent() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get(`/events/${route.params.id}/edit`)
    const body = response.data
    const eventData = body?.data ?? body

    if (!eventData?.id) {
      errorMessage.value = 'Evento não encontrado.'
      return
    }

    form.title = eventData.title || ''
    form.description = eventData.description || ''
    currentImage.value = eventData.image || ''
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Não foi possível carregar o evento.'
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

  errorMessage.value = ''

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.title.trim()) {
    errorMessage.value = 'O título é obrigatório.'
    return
  }

  if (!form.description.trim()) {
    errorMessage.value = 'A descrição é obrigatória.'
    return
  }

  saving.value = true

  try {
    const formData = new FormData()
    formData.append('title', form.title.trim())
    formData.append('description', form.description.trim())

    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    // Não defina Content-Type manualmente: o navegador cria o boundary.
    const response = await api.put(`/events/${route.params.id}`, formData)
    console.log('PUT status:', response.status)

    successMessage.value = 'Evento atualizado com sucesso!'
    router.push('/events/mine') // ajuste para a rota da sua lista "Meus eventos"
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      'Não foi possível salvar o evento.'
  } finally {
    saving.value = false
  }
}

onMounted(loadEvent)

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<template>
  <main class="container py-4">
    <h1>Editar evento</h1>

    <p v-if="loading">Carregando evento...</p>

    <form v-else @submit.prevent="handleSubmit">
      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-success">{{ successMessage }}</p>

      <div class="mb-3">
        <label for="title" class="form-label">Título</label>
        <input id="title" v-model="form.title" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Descrição</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="form-control"
        ></textarea>
      </div>

      <div class="mb-3">
        <img
          v-if="previewUrl || currentImage"
          :src="previewUrl || getEventImageUrl(currentImage)"
          alt="Imagem do evento"
          style="max-width: 100%; max-height: 220px; object-fit: cover"
        />
      </div>

      <div class="mb-3">
        <label for="image" class="form-label">Trocar imagem (opcional)</label>
        <input
          id="image"
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          class="form-control"
          @change="handleFileChange"
        />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="saving">
        {{ saving ? 'Salvando...' : 'Salvar alterações' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.edit-event {
  max-width: 700px;
  margin: 32px auto;
  padding: 24px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input,
textarea,
button {
  padding: 10px;
  font: inherit;
}

.current-image img {
  display: block;
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.error {
  color: #c62828;
}
</style>