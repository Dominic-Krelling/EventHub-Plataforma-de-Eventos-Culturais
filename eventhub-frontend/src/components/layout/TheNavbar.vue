<template>
  <nav class="navbar">
    <h2>EventHub</h2>

    <div class="links">
      <router-link to="/">Início</router-link>
      <router-link to="/feed">Eventos</router-link>
      <router-link to="/search">Buscar</router-link>
      <router-link to="/favorites">Favoritos</router-link>
      <router-link to="/notifications">Notificações</router-link>
      <router-link to="/profile">Perfil</router-link>
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
</style>
