<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ConfirmModal from '../../components/ConfirmModal.vue'
import { useAuth } from '../../composables/useAuth'
import { useDebouncedValue } from '../../composables/useDebouncedValue'
import { usePaginatedList } from '../../composables/usePaginatedList'
import { useToast } from '../../composables/useToast'
import { getAdminUsers, setUserBlocked } from '../../services/adminService'
import { getProfileImageUrl } from '../../utils/media'
import { SEARCH } from '../../config/constants'

const toast = useToast()
const { user: currentUser } = useAuth()

const typedText = ref('')
const term = useDebouncedValue(typedText, SEARCH.DEBOUNCE_MS)

const { items: users, hasMore, isLoading, error, loadMore, reload } = usePaginatedList(
  async (page, limit) => (await getAdminUsers(term.value.trim(), page, limit)).data,
  { watch: term }
)

const busyIds = reactive(new Set())
const userToBlock = ref(null)

async function changeBlocked(user, isBlocked) {
  if (busyIds.has(user.id)) return

  busyIds.add(user.id)

  try {
    const response = await setUserBlocked(user.id, isBlocked)

    user.isBlocked = response.data.isBlocked
    toast.success(response.message)
    userToBlock.value = null
  } catch {
    // toast de erro: do interceptor. O modal continua aberto.
  } finally {
    busyIds.delete(user.id)
  }
}
</script>

<template>
  <div>
    <header class="header">
      <h2>Usuários</h2>

      <button type="button" class="btn-refresh" :disabled="isLoading" @click="reload">
        <i class="bi bi-arrow-clockwise"></i> Atualizar
      </button>
    </header>

    <input
      v-model="typedText"
      type="search"
      class="search"
      placeholder="Buscar por nome de usuário, nome ou e-mail"
      aria-label="Buscar usuários"
      autocomplete="off"
    />

    <p v-if="isLoading && users.length === 0" role="status">Carregando usuários...</p>

    <p v-else-if="error" class="error" role="alert">
      {{ error }}
      <button type="button" @click="reload">Tentar novamente</button>
    </p>

    <ul v-else-if="users.length" class="list">
      <li v-for="user in users" :key="user.id" class="row">
        <img :src="getProfileImageUrl(user.profilePicture)" alt="" class="avatar" />

        <div class="body">
          <RouterLink :to="`/profile/${user.username}`" class="username">
            @{{ user.username }}
          </RouterLink>
          <small v-if="user.fullName">{{ user.fullName }}</small>
          <small>{{ user.email }}</small>
        </div>

        <div class="badges">
          <span v-if="user.isAdmin" class="badge admin">Admin</span>
          <span v-if="user.isBlocked" class="badge blocked">Bloqueado</span>
        </div>

        <div class="action">
          <span v-if="user.id === currentUser?.id" class="muted">Você</span>
          <span v-else-if="user.isAdmin" class="muted">Administrador</span>
          <button
            v-else-if="user.isBlocked"
            type="button"
            class="btn-unblock"
            :disabled="busyIds.has(user.id)"
            @click="changeBlocked(user, false)"
          >
            {{ busyIds.has(user.id) ? 'Salvando...' : 'Desbloquear' }}
          </button>
          <button v-else type="button" class="btn-block" @click="userToBlock = user">
            Bloquear
          </button>
        </div>
      </li>
    </ul>

    <p v-else-if="!isLoading" class="empty">Nenhum usuário encontrado.</p>

    <div class="footer">
      <p v-if="isLoading && users.length > 0" role="status">Carregando...</p>

      <button v-if="hasMore && !isLoading" type="button" class="btn-more" @click="loadMore">
        Carregar mais usuários
      </button>
    </div>

    <ConfirmModal
      v-if="userToBlock"
      title="Bloquear usuário"
      :message="`@${userToBlock.username} não conseguirá mais entrar nem usar a conta. Você pode desbloquear depois.`"
      confirm-label="Bloquear"
      :busy="busyIds.has(userToBlock.id)"
      @confirm="changeBlocked(userToBlock, true)"
      @close="userToBlock = null"
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
.avatar { width: 48px; height: 48px; flex-shrink: 0; border-radius: 50%; object-fit: cover; }
.body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.username { font-weight: bold; color: #242333; text-decoration: none; }
.username:hover { text-decoration: underline; }
.body small { color: #666; overflow-wrap: anywhere; }
.badges { display: flex; gap: 6px; }
.badge { padding: 3px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: bold; }
.badge.admin { background: #ece6f8; color: #563793; }
.badge.blocked { background: #fdecea; color: #c62828; }
.action { min-width: 110px; text-align: right; }
.muted { color: #777; }
.btn-block, .btn-unblock { padding: 6px 12px; border: 0; border-radius: 8px; color: #fff; cursor: pointer; }
.btn-block { background: #c62828; }
.btn-unblock { background: #1e7e34; }
.btn-unblock:disabled { opacity: 0.6; cursor: wait; }
.footer { margin-top: 20px; text-align: center; }
.error { color: #c62828; }
.empty { color: #666; }
</style>