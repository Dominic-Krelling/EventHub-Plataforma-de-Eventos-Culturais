<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import ConfirmModal from '../../components/ConfirmModal.vue'
import { useDebouncedValue } from '../../composables/useDebouncedValue'
import { usePaginatedList } from '../../composables/usePaginatedList'
import { useToast } from '../../composables/useToast'
import { deleteAdminEvent, getAdminEvents } from '../../services/adminService'
import { getEventImageUrl } from '../../utils/media'
import { SEARCH } from '../../config/constants'

const toast = useToast()

const typedText = ref('')
const term = useDebouncedValue(typedText, SEARCH.DEBOUNCE_MS)

const { items: events, hasMore, isLoading, error, loadMore, reload } = usePaginatedList(
  async (page, limit) => (await getAdminEvents(term.value.trim(), page, limit)).data,
  { watch: term }
)

const eventToDelete = ref(null)
const isDeleting = ref(false)

async function confirmDelete() {
  const event = eventToDelete.value

  if (!event || isDeleting.value) return

  isDeleting.value = true

  try {
    const response = await deleteAdminEvent(event.id)

    events.value = events.value.filter((item) => item.id !== event.id)
    toast.success(response.message)
    eventToDelete.value = null
  } catch {
    // toast de erro: do interceptor; o modal continua aberto
  } finally {
    isDeleting.value = false
  }
}

function pendingLabel(count) {
  return count === 1 ? '1 denúncia pendente' : `${count} denúncias pendentes`
}
</script>

<template>
  <div>
    <header class="header">
      <h2>Eventos</h2>

      <button type="button" class="btn-refresh" :disabled="isLoading" @click="reload">
        <i class="bi bi-arrow-clockwise"></i> Atualizar
      </button>
    </header>

    <input
      v-model="typedText"
      type="search"
      class="search"
      placeholder="Buscar eventos pelo título"
      aria-label="Buscar eventos"
      autocomplete="off"
    />

    <p v-if="isLoading && events.length === 0" role="status">Carregando eventos...</p>

    <p v-else-if="error" class="error" role="alert">
      {{ error }}
      <button type="button" @click="reload">Tentar novamente</button>
    </p>

    <ul v-else-if="events.length" class="list">
      <li v-for="event in events" :key="event.id" class="row">
        <RouterLink :to="`/event/${event.id}`" class="thumb-link">
          <img :src="getEventImageUrl(event.image)" alt="" class="thumb" />
        </RouterLink>

        <div class="body">
          <RouterLink :to="`/event/${event.id}`" class="title">{{ event.title }}</RouterLink>
          <small>por @{{ event.creator?.username }}</small>
        </div>

        <span v-if="event.pendingReportsCount > 0" class="badge">
          {{ pendingLabel(event.pendingReportsCount) }}
        </span>

        <button type="button" class="btn-delete" @click="eventToDelete = event">Excluir</button>
      </li>
    </ul>

    <p v-else-if="!isLoading" class="empty">Nenhum evento encontrado.</p>

    <div class="footer">
      <p v-if="isLoading && events.length > 0" role="status">Carregando...</p>

      <button v-if="hasMore && !isLoading" type="button" class="btn-more" @click="loadMore">
        Carregar mais eventos
      </button>
    </div>

    <ConfirmModal
      v-if="eventToDelete"
      title="Excluir evento"
      :message="`O evento “${eventToDelete.title}” será apagado junto com as suas curtidas, comentários, denúncias, notificações e a presença em coleções, e a imagem será removida. Não dá para desfazer.`"
      confirm-label="Excluir"
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="eventToDelete = null"
    />
  </div>
</template>

<style scoped>
.header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.header h2 { margin: 0; font-size: 1.25rem; }
.btn-refresh, .btn-more { padding: 8px 16px; border: 1px solid #6c4ab6; border-radius: 8px; background: #fff; color: #6c4ab6; cursor: pointer; }
.btn-refresh:disabled { opacity: 0.6; cursor: wait; }
.search { width: 100%; box-sizing: border-box; padding: 10px 14px; margin-bottom: 16px; border: 1px solid #d9d0f0; border-radius: 8px; font-size: 1rem; }
.list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.row { display: flex; align-items: center; gap: 14px; padding: 12px 14px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); }
.thumb { width: 72px; height: 54px; border-radius: 8px; object-fit: cover; display: block; }
.body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.title { font-weight: bold; color: #242333; text-decoration: none; }
.title:hover { text-decoration: underline; }
.body small { color: #666; }
.badge { padding: 3px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: bold; background: #fdecea; color: #c62828; }
.btn-delete { padding: 6px 12px; border: 0; border-radius: 8px; background: #c62828; color: #fff; cursor: pointer; }
.footer { margin-top: 20px; text-align: center; }
.error { color: #c62828; }
.empty { color: #666; }
</style>