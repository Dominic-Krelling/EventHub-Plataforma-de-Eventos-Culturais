# Funcionalidades e Telas — EventHub

## Etapa 3 — Tradução funcionalidade → tela

| Grupo | Funcionalidade | Tela equivalente | Rota |
|---|---|---|---|
| Usuário | Landing / página inicial | `LandingView.vue` | `/` |
| Usuário | Cadastro | `auth/RegisterView.vue` | `/register` |
| Usuário | Login / autenticação | `auth/LoginView.vue` | `/login` |
| Usuário | Exploração de eventos | `FeedView.vue` | `/feed` |
| Usuário | Detalhes de evento | `EventDetailView.vue` | `/event/:id` |
| Usuário | Busca de eventos | `SearchView.vue` | `/search` |
| Usuário | Notificações | `NotificationsView.vue` | `/notifications` |
| Usuário | Eventos favoritos | `favorites/MyFavoritesView.vue` | `/favorites` |
| Usuário | Meu perfil | `profile/MyProfileView.vue` | `/profile` |
| Usuário | Perfil público | `profile/PublicProfileView.vue` | `/profile/:id` |
| Administrador | Dashboard administrativo | `admin/AdminDashboardView.vue` | `/admin` |
| Administrador | Gerenciamento de eventos | `admin/AdminEventsView.vue` | `/admin/events` |
| Administrador | Criação de evento | `admin/EventCreateView.vue` | `/admin/events/create` |
| Administrador | Edição de evento | `admin/EventEditView.vue` | `/admin/events/:id/edit` |
| Administrador | Gerenciamento de usuários | `admin/AdminUsersView.vue` | `/admin/users` |
| Administrador | Relatórios e moderação | `admin/AdminReportsView.vue` | `/admin/reports` |
| Sistema | Rota não encontrada | `NotFoundView.vue` | `/:pathMatch(.*)*` |

## Campo de busca da entidade principal

**Entidade principal:** evento  
**Campo no plural e camelCase:** `events`
