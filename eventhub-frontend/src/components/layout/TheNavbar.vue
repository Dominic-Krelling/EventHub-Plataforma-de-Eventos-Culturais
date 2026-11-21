
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { SEARCH } from '../../config/constants'
import UserMenu from '../userMenu.vue'

const authStore = useAuthStore()
const router = useRouter()

const searchText = ref('')

function submitSearch() {
  const q = searchText.value.trim()

  if (!q) return

  router.push({ name: 'search', query: { q } })
  searchText.value = ''
}
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

      <form
        class="nav-search"
        role="search"
        @submit.prevent="submitSearch"
      >
        <input
          v-model="searchText"
          type="search"
          placeholder="Buscar eventos e pessoas"
          aria-label="Buscar eventos e pessoas"
          autocomplete="off"
          :maxlength="SEARCH.MAX_LENGTH"
        />

        <button type="submit" aria-label="Buscar">
          <i class="bi bi-search"></i>
        </button>
      </form>

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

.nav-search {
  display: flex;
}

.nav-search input {
  width: 200px;
  padding: 6px 10px;
  border: 0;
  border-radius: 6px 0 0 6px;
  font-size: 0.9rem;
}

.nav-search button {
  padding: 6px 12px;
  border: 0;
  border-radius: 0 6px 6px 0;
  background: #ffd966;
  color: #3b2a6b;
  cursor: pointer;
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
