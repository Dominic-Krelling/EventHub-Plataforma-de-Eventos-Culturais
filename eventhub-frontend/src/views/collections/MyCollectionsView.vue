<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseModal from '../../components/base/BaseModal.vue'
import CreateCollectionModal from '../../components/CreateCollectionModal.vue'
import { useAsyncData } from '../../composables/useAsyncData'
import { useToast } from '../../composables/useToast'
import { deleteCollection, getMyCollections } from '../../services/collectionService'

const toast = useToast()

const { data: collections, isLoading, error, execute: reload } = useAsyncData(
  async () => (await getMyCollections()).data ?? [],
  { initialData: () => [] }
)

const isCreating = ref(false)
const collectionToDelete = ref(null)
const isDeleting = ref(false)

// entra no TOPO, num array novo
function handleCreated(collection) {
  collections.value = [collection, ...collections.value]
  toast.success('Coleção criada com sucesso.')
}

// excluir ESPERA a API; se falhar, o modal continua aberto (toast do interceptor)
async function confirmDelete() {
  const target = collectionToDelete.value
  if (!target || isDeleting.value) return

  isDeleting.value = true

  try {
    await deleteCollection(target.id)
    collections.value = collections.value.filter((item) => item.id !== target.id)
    collectionToDelete.value = null
    toast.success('Coleção excluída com sucesso.')
  } catch {
    // aviso: toast do interceptor
  } finally {
    isDeleting.value = false
  }
}

function countLabel(count) {
  return `${count} ${count === 1 ? 'evento' : 'eventos'}`
}
</script>

<template>
  <main class="collections-page">
    <header class="page-header">
      <h1>Minhas Coleções</h1>
      <button type="button" class="btn-primary" @click="isCreating = true">
        <i class="bi bi-plus-lg"></i> Nova coleção
      </button>
    </header>

    <p v-if="isLoading">Carregando coleções...</p>

    <p v-else-if="error" class="error">
      {{ error }}
      <button type="button" @click="reload">Tentar novamente</button>
    </p>

    <p v-else-if="collections.length === 0" class="empty">
      Você ainda não tem coleções. Clique em “Nova coleção” para criar a primeira
      e depois use o botão “Salvar” na página de um evento.
    </p>

    <section v-else class="grid">
      <article v-for="collection in collections" :key="collection.id" class="card">
        <span class="badge" :class="collection.isPublic ? 'public' : 'private'">
          {{ collection.isPublic ? 'Pública' : 'Privada' }}
        </span>

        <h2>
          <RouterLink :to="`/collections/${collection.id}`" class="stretched-link">
            {{ collection.title }}
          </RouterLink>
        </h2>

        <p v-if="collection.description" class="description">{{ collection.description }}</p>
        <p class="count">{{ countLabel(collection.eventsCount) }}</p>

        <!-- por cima do link esticado (position + z-index) -->
        <button type="button" class="btn-delete" @click="collectionToDelete = collection">Excluir</button>
      </article>
    </section>

    <CreateCollectionModal v-model="isCreating" @created="handleCreated" />

    <BaseModal
      :model-value="Boolean(collectionToDelete)"
      title="Excluir coleção"
      :busy="isDeleting"
      @update:model-value="collectionToDelete = null"
      @confirm="confirmDelete"
    >
      <p>
        Deseja realmente excluir <strong>{{ collectionToDelete?.title }}</strong>?
        Os eventos continuam existindo; só a coleção é apagada.
      </p>
    </BaseModal>
  </main>
</template>

<style scoped>
.collections-page { max-width: 1100px; margin: 0 auto; padding: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
.page-header h1 { color: #6c4ab6; }
.btn-primary { padding: 10px 18px; border: 0; border-radius: 8px; background: #6c4ab6; color: #fff; cursor: pointer; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.card { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 18px; background: #fff; border-radius: 12px; box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08); }
.card h2 { margin: 0; font-size: 1.15rem; }
.card a { color: inherit; text-decoration: none; }
.stretched-link::after { content: ''; position: absolute; inset: 0; z-index: 1; }
.description { margin: 0; color: #555; }
.count { margin: 0; color: #777; font-size: 0.9rem; }
.badge { align-self: flex-start; padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold; }
.badge.public { background: #e3f6e8; color: #1b7a3a; }
.badge.private { background: #eee; color: #555; }
.btn-delete { position: relative; z-index: 2; align-self: flex-start; padding: 6px 12px; border: 1px solid #c62828; border-radius: 8px; background: #fff; color: #c62828; cursor: pointer; }
.error { color: #c62828; }
</style>