# Funcionalidades e Telas — EventHub

## Aula 04 — Login com JWT, Pinia e Proteção de Rotas

### Funcionalidades do frontend

| Funcionalidade | Tela / arquivo | Rota |
|---|---|---|
| Landing / página inicial | `src/views/LandingView.vue` | `/` |
| Cadastro de usuário | `src/views/auth/RegisterView.vue` | `/register` |
| Login | `src/views/auth/LoginView.vue` | `/login` |
| Feed de eventos | `src/views/FeedView.vue` | `/feed` |
| Busca | `src/views/SearchView.vue` | `/search` |
| Detalhes de evento | `src/views/EventDetailView.vue` | `/event/:id` |
| Favoritos | `src/views/favorites/MyFavoritesView.vue` | `/favorites` |
| Notificações | `src/views/NotificationsView.vue` | `/notifications` |
| Meu perfil | `src/views/profile/MyProfileView.vue` | `/profile` |
| Perfil público | `src/views/profile/PublicProfileView.vue` | `/profile/:id` |
| Dashboard administrativo | `src/views/admin/AdminDashboardView.vue` | `/admin` |
| Administração de eventos | `src/views/admin/AdminEventsView.vue` | `/admin/events` |
| Criar evento | `src/views/admin/EventCreateView.vue` | `/admin/events/create` |
| Editar evento | `src/views/admin/EventEditView.vue` | `/admin/events/:id/edit` |
| Administração de usuários | `src/views/admin/AdminUsersView.vue` | `/admin/users` |
| Relatórios | `src/views/admin/AdminReportsView.vue` | `/admin/reports` |
| Página não encontrada | `src/views/NotFoundView.vue` | `/:pathMatch(.*)*` |

## Componentes de layout

| Componente | Arquivo | Função |
|---|---|---|
| Navbar | `src/components/layout/TheNavbar.vue` | Navegação superior e opções de autenticação |
| Sidebar | `src/components/layout/TheSidebar.vue` | Navegação lateral |
| Footer | `src/components/layout/TheFooter.vue` | Rodapé da aplicação |

A Navbar mostra opções diferentes conforme o estado de autenticação.

**Usuário deslogado:** Início, Eventos, Buscar, Entrar e Criar Conta.

**Usuário logado:** Início, Eventos, Buscar, Favoritos, Notificações, Perfil e Sair.

## Arquivos de autenticação do frontend

| Arquivo | Responsabilidade |
|---|---|
| `src/stores/auth.js` | Store Pinia, token, usuário e persistência em `localStorage` |
| `src/services/api.js` | Instância Axios e interceptors |
| `src/services/authService.js` | Requisições de registro, login e logout |
| `src/router/index.js` | Rotas e guarda `requiresAuth` |
| `src/views/auth/LoginView.vue` | Formulário e fluxo de login |
| `src/views/profile/MyProfileView.vue` | Consulta de `/api/profile/me` |
| `src/assets/main.css` | Identidade visual e cor de marca |
| `src/main.js` | Registro da Pinia antes do Router |

## Rotas protegidas no frontend

As rotas que exigem autenticação utilizam:

```js
meta: {
  requiresAuth: true
}
```

Entre elas:

- `/favorites`
- `/notifications`
- `/profile`
- rotas administrativas que também exigem autenticação

Ao tentar acessar uma rota protegida sem token, o Router redireciona para:

```text
/login?redirect=<rota-original>
```

## Endpoints do backend relacionados à autenticação

| Método | Endpoint | Resultado esperado |
|---|---|---|
| POST | `/api/register` | Cadastro de usuário |
| POST | `/api/login` | JWT + dados do usuário |
| POST | `/api/logout` | Resposta de logout |
| GET | `/api/profile/me` | Perfil autenticado com token válido |
| GET | `/api/profile/:username` | Perfil público |

## Arquivos do backend envolvidos

| Arquivo | Responsabilidade |
|---|---|
| `config/jwt.js` | Gerar e verificar JWT |
| `middlewares/auth.js` | Middleware `isAuthenticated` |
| `modules/user/userService.js` | `loginUser` e `getUserProfile` |
| `modules/user/userValidator.js` | `loginValidator` |
| `modules/user/userController.js` | `login`, `logout` e `getMyProfile` |
| `modules/user/userRoutes.js` | Rotas de autenticação e perfil |

A rota `/profile/me` deve estar declarada antes de `/profile/:username`, evitando que `me` seja interpretado como um nome de usuário.

## Dados principais do projeto

- Projeto: **EventHub**
- Tema: **Eventos Culturais**
- Entidade principal: **evento**
- Nome plural usado na busca: **events**
- Campo de contagem: **eventsCount**
- Banco: **eventhub_db**
- Cor de marca: **#6c4ab6**
- API: **http://localhost:3000/api**
- Frontend: **http://localhost:5173**
