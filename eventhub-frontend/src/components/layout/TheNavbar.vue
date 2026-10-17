<script setup>
import { useAuthStore } from '../../stores/auth'
import UserMenu from '../UserMenu.vue'

const authStore = useAuthStore()
</script>

<template>
  <nav class="eventhub-navbar">
    <router-link to="/" class="brand">
      <i class="bi bi-calendar-event me-2"></i>
      EventHub
    </router-link>

    <div class="nav-links">
      <router-link to="/">Início</router-link>
      <router-link to="/feed">Eventos</router-link>
      <router-link to="/search">Buscar</router-link>

      <template v-if="authStore.isAuthenticated">
        <router-link to="/events/create">
          <i class="bi bi-calendar-plus me-1"></i>
          Publicar Evento
        </router-link>

        <router-link to="/my-events">
          <i class="bi bi-calendar-check me-1"></i>
          Meus Eventos
        </router-link>

        <UserMenu v-if="authStore.user" />
      </template>

      <template v-else>
        <router-link to="/login">Entrar</router-link>
        <router-link to="/register">Criar Conta</router-link>
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

@media (max-width: 768px) {
  .eventhub-navbar {
    flex-direction: column;
  }

  .nav-links {
    justify-content: center;
  }
}
</style>