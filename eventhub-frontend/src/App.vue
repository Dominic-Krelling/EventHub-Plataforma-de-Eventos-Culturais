<script setup>
import TheNavbar from './components/layout/TheNavbar.vue'
import TheSidebar from './components/layout/TheSidebar.vue'
import TheFooter from './components/layout/TheFooter.vue'
</script>

<template>
  <div class="app">
    <TheNavbar />

    <div class="page-layout">
      <TheSidebar />

      <main class="main-content">
        <router-view />
      </main>
    </div>

    <TheFooter />
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  min-height: 100%;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-layout {
  display: flex;
  flex: 1;
  width: 100%;
}

.main-content {
  flex: 1;
  min-width: 0;
  padding: 30px;
  background: #f5f6fa;
}
</style>