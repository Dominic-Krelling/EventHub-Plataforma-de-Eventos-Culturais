<script setup>
import { useAuth } from '../../composables/useAuth'

const { isAdmin } = useAuth()
</script>

<template>
  <aside class="sidebar">
    <h3>EventHub</h3>

    <router-link to="/feed">
      Eventos
    </router-link>

    <router-link to="/following-events">
      Seguindo
    </router-link>

    <router-link to="/search">
      Buscar
    </router-link>

    <router-link to="/collections">
      Minhas Coleções
    </router-link>

    <router-link to="/favorites">
      Favoritos
    </router-link>

    <router-link to="/notifications">
      Notificações
    </router-link>

    <router-link to="/profile">
      Meu perfil
    </router-link>

    <template v-if="isAdmin">
      <h4 class="section-title">Administração</h4>

      <router-link to="/admin">
        Painel de administração
      </router-link>
    </template>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  flex-shrink: 0;
  padding: 25px 15px;
  background: #241b35;
  color: white;
}

.sidebar h3 {
  margin-bottom: 30px;
}

.sidebar a {
  display: block;
  padding: 12px;
  color: white;
  text-decoration: none;
  border-radius: 6px;
}

.sidebar a:hover,
.sidebar a.router-link-active {
  background: #6c4ab6;
}

.section-title {
  margin: 24px 12px 8px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #b9aee0;
}
</style>
