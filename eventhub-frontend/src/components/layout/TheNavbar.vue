<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push({
    name: 'login'
  })
}
</script>
<template>
  <nav class="navbar">
    <h2>EventHub</h2>

    <div class="links">
      <router-link to="/">
        Início
      </router-link>

      <router-link to="/feed">
        Eventos
      </router-link>

      <router-link to="/search">
        Buscar
      </router-link>

      <template v-if="authStore.isAuthenticated">
        <router-link to="/favorites">
          Favoritos
        </router-link>

        <router-link to="/notifications">
          Notificações
        </router-link>

        <router-link to="/profile">
          Perfil
        </router-link>

        <button
          type="button"
          class="logout-button"
          @click="handleLogout"
        >
          Sair
        </button>
      </template>

      <template v-else>
        <router-link to="/login">
          Entrar
        </router-link>

        <router-link to="/register">
          Criar Conta
        </router-link>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  background: #6c4ab6;
  color: white;
}
.navbar h2 {
  margin: 0;
}
.links {
  display: flex;
  align-items: center;
  gap: 20px;
}
.links a {
  color: white;
  text-decoration: none;
}
.links a:hover,
.links a.router-link-active {
  color: #ffd966;
}
.logout-button {
  border: 1px solid white;
  background: transparent;
  color: white;
  padding: 7px 14px;
  border-radius: 6px;
  cursor: pointer;
}
.logout-button:hover {
  background: white;
  color: #6c4ab6;
}
</style>