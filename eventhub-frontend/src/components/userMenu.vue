<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useClickOutside } from '../composables/useClickOutside'
import { getProfileImageUrl } from '../utils/media'

const authStore = useAuthStore()
const router = useRouter()

const open = ref(false)
const root = ref(null)

function close() {
  open.value = false
}

function toggle() {
  open.value = !open.value
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

function handleLogout() {
  close()
  authStore.logout() 
  router.push('/login')
}

useClickOutside(root, close)

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div ref="root" class="user-menu">
    <button
      type="button"
      class="avatar-btn"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="toggle"
    >
      <img
        :src="getProfileImageUrl(authStore.user?.profilePicture)"
        alt="Menu do usuário"
      />
    </button>

    <ul v-if="open" class="dropdown" role="menu">
      <li>
        <RouterLink to="/profile" @click="close">Editar Perfil</RouterLink>
      </li>
      <li>
        <RouterLink :to="`/profile/${authStore.user?.username}`" @click="close">
          Ver Perfil
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/my-events" @click="close">Meus Itens</RouterLink>
      </li>
      <li>
        <button type="button" @click="handleLogout">Sair</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.user-menu { position: relative; }

.avatar-btn {
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;
}

.avatar-btn img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 48px;
  z-index: 1000;
  min-width: 180px;
  margin: 0;
  padding: 6px 0;
  list-style: none;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.dropdown a,
.dropdown button {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  border: 0;
  background: none;
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

.dropdown a:hover,
.dropdown button:hover { background: #f3eefb; }
</style>