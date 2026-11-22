<script setup>
import { RouterLink, RouterView } from 'vue-router'

const tabs = [
  { name: 'admin-dashboard', label: 'Dashboard' },
  { name: 'admin-reports', label: 'Denúncias' },
  { name: 'admin-users', label: 'Usuários' },
  { name: 'admin-events', label: 'Eventos' }
]
</script>

<template>
  <section class="admin-layout">
    <h1 class="title">Administração</h1>

    <nav aria-label="Seções da administração">
      <ul class="nav nav-pills tabs">
        <li v-for="tab in tabs" :key="tab.name">
          <RouterLink :to="{ name: tab.name }" class="nav-link" active-class="active">
            {{ tab.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <RouterView />
  </section>
</template>

<style scoped>
.admin-layout { max-width: 1000px; margin: 0 auto; }
.title { color: #6c4ab6; margin-bottom: 16px; }
.tabs { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 24px; padding: 0; list-style: none; }
.nav-link { display: block; padding: 8px 16px; border-radius: 999px; background: #fff; color: #6c4ab6; text-decoration: none; border: 1px solid #d9d0f0; }
.nav-link:hover { background: #f3eefb; }
.nav-link.active { background: #6c4ab6; color: #fff; border-color: #6c4ab6; }
</style>