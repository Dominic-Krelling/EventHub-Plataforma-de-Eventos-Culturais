# Funcionalidades e Telas — EventHub
| Grupo | Funcionalidade | Tela equivalente | Rota | Vale para o projeto? |
|---------------|---|---|---|---|
| Usuário       | Landing / página inicial               | `LandingView.vue`               | `/`                      | Sim |
| Usuário       | Cadastro                               | `auth/RegisterView.vue`         | `/register`              | Sim |
| Usuário       | Login / autenticação                   | `auth/LoginView.vue`            | `/login`                 | Sim |
| Usuário       | Exploração de eventos (Feed)           | `FeedView.vue`                  | `/feed`                  | Sim |
| Usuário       | Visualização dos detalhes de um evento | `EventDetailView.vue`           | `/event/:id`             | Sim |
| Usuário       | Busca de eventos                       | `SearchView.vue`                | `/search`                | Sim |
| Usuário       | Notificações                           | `NotificationsView.vue`         | `/notifications`         | Sim |
| Usuário       | Eventos favoritos                      | `favorites/MyFavoritesView.vue` | `/favorites`             | Sim |
| Usuário       | Visualização do próprio perfil         | `profile/MyProfileView.vue`     | `/profile`               | Sim |
| Usuário       | Visualização de perfil público         | `profile/PublicProfileView.vue` | `/profile/:id`           | Sim |
| Administrador | Dashboard administrativo               | `admin/AdminDashboardView.vue`  | `/admin`                 | Sim |
| Administrador | Gerenciamento de eventos               | `admin/AdminEventsView.vue`     | `/admin/events`          | Sim |
| Administrador | Criação de evento                      | `admin/EventCreateView.vue`     | `/admin/events/create`   | Sim |
| Administrador | Edição de evento                       | `admin/EventEditView.vue`       | `/admin/events/:id/edit` | Sim |
| Administrador | Gerenciamento de usuários              | `admin/AdminUsersView.vue`      | `/admin/users`           | Sim |
| Administrador | Relatórios e moderação                 | `admin/AdminReportsView.vue`    | `/admin/reports`         | Sim |
| Sistema       | Página de rota não encontrada          | `NotFoundView.vue`              | `/:pathMatch(.*)*`       | Sim |

## Observações

As funcionalidades foram divididas entre usuários comuns e administradores.

### Funcionalidades de usuários

- Acessar a Landing Page.
- Realizar cadastro.
- Realizar login.
- Explorar eventos disponíveis.
- Visualizar detalhes de eventos.
- Pesquisar eventos.
- Visualizar notificações.
- Gerenciar eventos favoritos.
- Visualizar e gerenciar o próprio perfil.
- Visualizar perfis públicos de outros usuários.

### Funcionalidades administrativas

- Acessar o dashboard administrativo.
- Gerenciar eventos.
- Criar eventos.
- Editar eventos.
- Gerenciar usuários.
- Visualizar relatórios e realizar atividades de moderação.

### Rotas protegidas

As funcionalidades que necessitam de autenticação utilizam:

`meta: { requiresAuth: true }`

As funcionalidades exclusivas de administradores utilizam:

`meta: { requiresAuth: true, requiresAdmin: true }`

### Entidade principal

A entidade principal do projeto EventHub é o **evento**.