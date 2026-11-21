<script setup>
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { usePaginatedList } from '../composables/usePaginatedList'
import { useNotificationsStore } from '../stores/notifications'
import { getNotifications, markNotificationAsRead } from '../services/notificationService'
import { runOptimistic } from '../utils/optimistic'
import { getProfileImageUrl } from '../utils/media'
import { NOTIFICATION_TEXT } from '../config/constants'

const store = useNotificationsStore()

const { items: notifications, hasMore, isLoading, error, loadMore, reload } = usePaginatedList(
  async (page, limit) => (await getNotifications(page, limit)).data
)

const busyIds = reactive(new Set())

async function handleRefresh() {
  await reload()
  store.refresh()
}

function markAsRead(notification) {
  if (notification.isRead || busyIds.has(notification.id)) return undefined

  busyIds.add(notification.id)

  return runOptimistic({
    apply() {
      notification.isRead = true
      store.setUnreadCount(store.unreadCount - 1)

      return () => {
        notification.isRead = false
        store.setUnreadCount(store.unreadCount + 1)
      }
    },
    request: () => markNotificationAsRead(notification.id),
    confirm(data) {
      store.setUnreadCount(data.unreadCount)
    }
  }).finally(() => busyIds.delete(notification.id))
}

function targetOf(notification) {
  if (notification.type === 'follow' || !notification.event) {
    return `/profile/${notification.Actor?.username}`
  }

  return `/event/${notification.event.id}`
}

function formatDate(value) {
  return new Date(value).toLocaleString('pt-BR')
}
</script>

<template>
  <main class="notifications-page">
    <header class="page-header">
      <h1>Notificações</h1>

      <button type="button" class="btn-refresh" :disabled="isLoading" @click="handleRefresh">
        <i class="bi bi-arrow-clockwise"></i> Atualizar
      </button>
    </header>

    <p v-if="isLoading && notifications.length === 0" role="status">Carregando notificações...</p>

    <p v-else-if="error" class="error" role="alert">
      {{ error }}
      <button type="button" @click="handleRefresh">Tentar novamente</button>
    </p>

    <ul v-else-if="notifications.length" class="list">
      <li
        v-for="notification in notifications"
        :key="notification.id"
        class="item"
        :class="{ unread: !notification.isRead }"
      >
        <img :src="getProfileImageUrl(notification.Actor?.profilePicture)" alt="" class="avatar" />

        <div class="body">
          <RouterLink :to="targetOf(notification)" class="text" @click="markAsRead(notification)">
            <strong>@{{ notification.Actor?.username }}</strong>
            {{ NOTIFICATION_TEXT[notification.type] }}
            <em v-if="notification.event">“{{ notification.event.title }}”</em>
          </RouterLink>

          <small class="date">{{ formatDate(notification.createdAt) }}</small>
        </div>

        <button
          v-if="!notification.isRead"
          type="button"
          class="btn-read"
          :disabled="busyIds.has(notification.id)"
          @click="markAsRead(notification)"
        >
          Marcar como lida
        </button>
      </li>
    </ul>

    <p v-else-if="!isLoading" class="empty">
      Você ainda não tem notificações. Quando alguém curtir ou comentar um evento seu,
      ou começar a seguir você, o aviso aparece aqui.
    </p>

    <div class="footer">
      <p v-if="isLoading && notifications.length > 0" role="status">Carregando...</p>

      <button v-if="hasMore && !isLoading" type="button" class="btn-more" @click="loadMore">
        Carregar mais notificações
      </button>
    </div>
  </main>
</template>

<style scoped>
.notifications-page { max-width: 760px; margin: 0 auto; padding: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
.page-header h1 { color: #6c4ab6; }
.btn-refresh, .btn-more { padding: 8px 16px; border: 1px solid #6c4ab6; border-radius: 8px; background: #fff; color: #6c4ab6; cursor: pointer; }
.btn-refresh:disabled { opacity: 0.6; cursor: wait; }
.list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); }
.item.unread { background: #f3eefb; font-weight: bold; border-left: 4px solid #6c4ab6; }
.avatar { width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; object-fit: cover; }
.body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.text { color: inherit; text-decoration: none; }
.text:hover { text-decoration: underline; }
.date { color: #777; font-weight: normal; }
.btn-read { padding: 6px 12px; border: 0; border-radius: 8px; background: #6c4ab6; color: #fff; cursor: pointer; font-weight: normal; }
.btn-read:disabled { opacity: 0.6; cursor: wait; }
.footer { margin-top: 20px; text-align: center; }
.error { color: #c62828; }
.empty { color: #666; }
</style>