
<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="eventhub-navbar">
    <router-link to="/" class="brand">
      <i class="bi bi-calendar-event me-2"></i>
      EventHub
    </router-link>

    <div class="nav-links">
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
        <router-link to="/events/create">
          <i class="bi bi-calendar-plus me-1"></i>
          Publicar Evento
        </router-link>

        <router-link to="/profile">
          <i class="bi bi-person-circle me-1"></i>
          Meu Perfil
        </router-link>

        <button
          type="button"
          class="logout-button"
          @click="handleLogout"
        >
          <i class="bi bi-box-arrow-right me-1"></i>
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
.eventhub-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px 30px;
  background: #6c4ab6;
  color: white;
}

.brand {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #ffd966;
}

.logout-button {
  padding: 6px 12px;
  border: 1px solid white;
  border-radius: 6px;
  background: transparent;
  color: white;
  cursor: pointer;
}

.logout-button:hover {
  background: white;
  color: #6c4ab6;
}

@media (max-width: 768px) {
  .eventhub-navbar {
    flex-direction: column;
  }

  .nav-links {
    justify-content: center;
  }
}
</style>
