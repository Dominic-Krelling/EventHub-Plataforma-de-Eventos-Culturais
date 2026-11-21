<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import EventCard from '../components/EventCard.vue'
import { useAsyncData } from '../composables/useAsyncData'
import { useDebouncedValue } from '../composables/useDebouncedValue'
import { search } from '../services/searchServices'
import { getProfileImageUrl } from '../utils/media'
import { SEARCH } from '../config/constants'

const route = useRoute()
const router = useRouter()

// ?q= pode vir como array (?q=a&q=b): só texto é aceito
function queryFromUrl() {
  return typeof route.query.q === 'string' ? route.query.q : ''
}

const typedText = ref(queryFromUrl())                       // o que o campo mostra
const term = useDebouncedValue(typedText, SEARCH.DEBOUNCE_MS) // só muda depois da pausa
const normalizedTerm = computed(() => term.value.trim())

const typedLength = computed(() => typedText.value.trim().length)
const isTooShort = computed(() => typedLength.value > 0 && typedLength.value < SEARCH.MIN_LENGTH)

const emptyResults = (query = '') => ({ query, events: [], users: [] })

// termo curto: resposta vazia pronta, sem rede; lastCallId descarta respostas atrasadas
const { data: results, isLoading, error, execute: reload } = useAsyncData(
  () => {
    if (normalizedTerm.value.length < SEARCH.MIN_LENGTH) {
      return Promise.resolve(emptyResults(normalizedTerm.value))
    }

    return search(normalizedTerm.value).then((response) => response.data)
  },
  { watch: normalizedTerm, initialData: () => emptyResults() }
)

const events = computed(() => results.value?.events ?? [])
const users = computed(() => results.value?.users ?? [])
const hasResults = computed(() => events.value.length > 0 || users.value.length > 0)
const hasSearched = computed(() => normalizedTerm.value.length >= SEARCH.MIN_LENGTH)

// URL → campo (Navbar, link, "voltar"): só se for diferente
watch(() => route.query.q, () => {
  const fromUrl = queryFromUrl().trim()
  if (fromUrl !== normalizedTerm.value) typedText.value = fromUrl
})

// termo → URL com replace (Voltar não passa por cada pausa)
watch(normalizedTerm, (value) => {
  if (value === queryFromUrl().trim()) return

  router.replace({ query: value ? { q: value } : {} })
})

// foco por código
const inputRef = ref(null)
onMounted(() => inputRef.value?.focus())
</script>

<template>
  <main class="search-page">
    <h1>Explorar</h1>

    <form class="search-form" role="search" @submit.prevent>
      <label for="search-input" class="visually-hidden">Buscar eventos e pessoas</label>
      <input
        id="search-input"
        ref="inputRef"
        v-model="typedText"
        type="search"
        placeholder="Buscar eventos e pessoas..."
        autocomplete="off"
        :maxlength="SEARCH.MAX_LENGTH"
      />
    </form>

    <p v-if="typedLength === 0 || isTooShort" class="hint">
      Digite pelo menos {{ SEARCH.MIN_LENGTH }} letras para buscar.
    </p>

    <p v-else-if="isLoading" class="hint" role="status">Buscando...</p>

    <div v-else-if="error" class="error-message" role="alert">
      {{ error }}
      <button type="button" @click="reload">Tentar novamente</button>
    </div>

    <template v-else-if="hasSearched">
      <p v-if="!hasResults" class="hint">Nada encontrado para “{{ results.query }}”.</p>

      <section v-if="users.length" class="results" aria-labelledby="people-title">
        <h2 id="people-title">Pessoas</h2>

        <ul class="people">
          <li v-for="person in users" :key="person.id">
            <RouterLink :to="`/profile/${person.username}`" class="person">
              <img :src="getProfileImageUrl(person.profilePicture)" alt="" />
              <div>
                <strong>{{ person.fullName || person.username }}</strong>
                <span>@{{ person.username }}</span>
              </div>
            </RouterLink>
          </li>
        </ul>
      </section>

      <section v-if="events.length" class="results" aria-labelledby="events-title">
        <h2 id="events-title">Eventos</h2>

        <div class="grid">
          <EventCard
            v-for="event in events"
            :key="event.id"
            :event="event"
            @author-click="(username) => router.push(`/profile/${username}`)"
          />
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.search-page { max-width: 1100px; margin: 0 auto; padding: 24px; }
.search-page h1 { color: #6c4ab6; }
.search-form input { width: 100%; max-width: 560px; padding: 12px 14px; border: 1px solid #cfc8e6; border-radius: 8px; font-size: 1rem; }
.search-form input:focus { outline: 2px solid #6c4ab6; outline-offset: 1px; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.hint { margin: 24px 0; color: #777; }
.error-message { margin: 20px 0; padding: 15px; border-radius: 8px; background: #fde7e7; color: #a52121; }
.results { margin-top: 28px; }
.results h2 { color: #3b2a6b; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
.people { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin: 0; padding: 0; list-style: none; }
.person { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; background: #fff; color: inherit; text-decoration: none; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.person img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.person div { display: flex; flex-direction: column; }
.person span { color: #777; font-size: 0.9rem; }
</style>