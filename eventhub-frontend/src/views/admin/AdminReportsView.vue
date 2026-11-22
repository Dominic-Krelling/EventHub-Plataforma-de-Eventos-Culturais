<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { usePaginatedList } from '../../composables/usePaginatedList'
import { useToast } from '../../composables/useToast'
import { getAdminReports, reviewAdminReport } from '../../services/adminService'
import { getEventImageUrl } from '../../utils/media'
import { formatDateTime } from '../../utils/format'
import { REPORT_FILTERS, REPORT_REASONS } from '../../config/constants'

const toast = useToast()

const reasonLabels = Object.fromEntries(REPORT_REASONS.map((reason) => [reason.value, reason.label]))

const statusFilter = ref('pending')

const { items: reports, hasMore, isLoading, error, loadMore, reload } = usePaginatedList(
  async (page, limit) => (await getAdminReports(statusFilter.value, page, limit)).data,
  { watch: statusFilter }
)

const busyIds = reactive(new Set())

async function markAsReviewed(report) {
  if (busyIds.has(report.id)) return

  busyIds.add(report.id)

  try {
    const response = await reviewAdminReport(report.id)

    report.status = response.data.status
    report.reviewedAt = response.data.reviewedAt

    toast.success(response.message)
  } catch {
    // o toast de erro já foi mostrado pelo interceptor
  } finally {
    busyIds.delete(report.id)
  }
}
</script>

<template>
  <div>
    <header class="header">
      <h2>Denúncias</h2>

      <button type="button" class="btn-refresh" :disabled="isLoading" @click="reload">
        <i class="bi bi-arrow-clockwise"></i> Atualizar
      </button>
    </header>

    <div class="filters" role="group" aria-label="Filtrar denúncias por situação">
      <button
        v-for="filter in REPORT_FILTERS"
        :key="filter.value"
        type="button"
        class="filter"
        :class="{ active: statusFilter === filter.value }"
        :aria-pressed="statusFilter === filter.value"
        @click="statusFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <p v-if="isLoading && reports.length === 0" role="status">Carregando denúncias...</p>

    <p v-else-if="error" class="error" role="alert">
      {{ error }}
      <button type="button" @click="reload">Tentar novamente</button>
    </p>

    <ul v-else-if="reports.length" class="list">
      <li v-for="report in reports" :key="report.id" class="row">
        <RouterLink v-if="report.event" :to="`/event/${report.event.id}`" class="thumb-link">
          <img :src="getEventImageUrl(report.event.image)" alt="" class="thumb" />
        </RouterLink>

        <div class="body">
          <RouterLink v-if="report.event" :to="`/event/${report.event.id}`" class="title">
            {{ report.event.title }}
          </RouterLink>

          <small>Autor do evento: @{{ report.event?.creator?.username }}</small>
          <small>
            Motivo: <strong>{{ reasonLabels[report.reason] ?? report.reason }}</strong>
          </small>
          <small>
            Denunciado por @{{ report.Reporter?.username }} em {{ formatDateTime(report.createdAt) }}
          </small>
          <small v-if="report.reviewedAt">Revisada em {{ formatDateTime(report.reviewedAt) }}</small>
        </div>

        <div class="actions">
          <span class="badge" :class="report.status">
            {{ report.status === 'reviewed' ? 'Revisada' : 'Pendente' }}
          </span>

          <button
            v-if="report.status === 'pending'"
            type="button"
            class="btn-review"
            :disabled="busyIds.has(report.id)"
            @click="markAsReviewed(report)"
          >
            {{ busyIds.has(report.id) ? 'Salvando...' : 'Marcar como revisada' }}
          </button>
        </div>
      </li>
    </ul>

    <p v-else-if="!isLoading" class="empty">Nenhuma denúncia nesta situação.</p>

    <div class="footer">
      <p v-if="isLoading && reports.length > 0" role="status">Carregando...</p>

      <button v-if="hasMore && !isLoading" type="button" class="btn-more" @click="loadMore">
        Carregar mais denúncias
      </button>
    </div>
  </div>
</template>

<style scoped>
.header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.header h2 { margin: 0; font-size: 1.25rem; }
.btn-refresh, .btn-more { padding: 8px 16px; border: 1px solid #6c4ab6; border-radius: 8px; background: #fff; color: #6c4ab6; cursor: pointer; }
.btn-refresh:disabled { opacity: 0.6; cursor: wait; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.filter { padding: 6px 14px; border: 1px solid #d9d0f0; border-radius: 999px; background: #fff; color: #6c4ab6; cursor: pointer; }
.filter.active { background: #6c4ab6; color: #fff; border-color: #6c4ab6; }
.list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.row { display: flex; align-items: center; gap: 14px; padding: 12px 14px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); }
.thumb { width: 72px; height: 54px; border-radius: 8px; object-fit: cover; display: block; }
.body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.title { font-weight: bold; color: #242333; text-decoration: none; }
.title:hover { text-decoration: underline; }
.body small { color: #666; }
.actions { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.badge { padding: 3px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: bold; }
.badge.pending { background: #fdecea; color: #c62828; }
.badge.reviewed { background: #e6f4ea; color: #1e7e34; }
.btn-review { padding: 6px 12px; border: 0; border-radius: 8px; background: #6c4ab6; color: #fff; cursor: pointer; }
.btn-review:disabled { opacity: 0.6; cursor: wait; }
.footer { margin-top: 20px; text-align: center; }
.error { color: #c62828; }
.empty { color: #666; }
</style>