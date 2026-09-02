<template>
  <aside class="sidebar">
    <h3>EventHub</h3>

    <router-link to="/feed">🏠 Eventos</router-link>
    <router-link to="/search">🔎 Buscar</router-link>
    <router-link to="/favorites">❤️ Favoritos</router-link>
    <router-link to="/notifications">🔔 Notificações</router-link>
    <router-link to="/profile">👤 Meu perfil</router-link>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
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

.sidebar a:hover {
  background: #6c4ab6;
}
</style>
