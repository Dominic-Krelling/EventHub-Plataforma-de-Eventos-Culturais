<script setup>
import { RouterLink } from 'vue-router'
import { useAsyncData } from '../../composables/useAsyncData'
import { getAdminDashboard } from '../../services/adminService'
import { formatCount } from '../../utils/format'

const { data: stats, isLoading, error, execute } = useAsyncData(
  async () => (await getAdminDashboard()).data
)

const cards = [
  { key: 'users', label: 'Usuários', icon: 'people' },
  { key: 'blockedUsers', label: 'Usuários bloqueados', icon: 'person-slash' },
  { key: 'events', label: 'Eventos', icon: 'calendar-event' },
  { key: 'comments', label: 'Comentários', icon: 'chat-dots' },
  { key: 'likes', label: 'Curtidas', icon: 'heart' },
  { key: 'reviewedReports', label: 'Denúncias revisadas', icon: 'check2-circle' }
]
</script>

<template>
  <div>
    <header class="header">
      <h2>Dashboard</h2>

      <button type="button" class="btn-refresh" :disabled="isLoading" @click="execute">
        <i class="bi bi-arrow-clockwise"></i> Atualizar
      </button>
    </header>

    <p v-if="isLoading" role="status">Carregando estatísticas...</p>

    <p v-else-if="error" class="error" role="alert">
      {{ error }}
      <button type="button" @click="execute">Tentar novamente</button>
    </p>

    <div v-else-if="stats" class="grid">
      <article v-for="card in cards" :key="card.key" class="card">
        <i :class="['bi', `bi-${card.icon}`, 'icon']" aria-hidden="true"></i>
        <strong class="value">{{ formatCount(stats[card.key]) }}</strong>
        <span class="label">{{ card.label }}</span>
      </article>

      <RouterLink :to="{ name: 'admin-reports' }" class="card card-alert">
        <i class="bi bi-flag icon" aria-hidden="true"></i>
        <strong class="value">{{ formatCount(stats.pendingReports) }}</strong>
        <span class="label">Denúncias pendentes</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.header h2 { margin: 0; font-size: 1.25rem; }
.btn-refresh { padding: 8px 16px; border: 1px solid #6c4ab6; border-radius: 8px; background: #fff; color: #6c4ab6; cursor: pointer; }
.btn-refresh:disabled { opacity: 0.6; cursor: wait; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.card { display: flex; flex-direction: column; gap: 4px; padding: 18px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); color: inherit; text-decoration: none; }
.icon { font-size: 1.4rem; color: #6c4ab6; }
.value { font-size: 1.8rem; }
.label { color: #555; }
.card-alert { background: #c62828; color: #fff; }
.card-alert .icon, .card-alert .label { color: #fff; }
.card-alert:hover { background: #a91f1f; }
.error { color: #c62828; }
</style>