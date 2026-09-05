# Funcionalidades e Telas — EventHub

## Aula 03 — Persistência de Dados e Primeiro Cadastro Real

| Funcionalidade | Tela / arquivo | Rota |
|---|---|---|
| Cadastro de usuário | `src/views/auth/RegisterView.vue` | `/register` |
| Login | `src/views/auth/LoginView.vue` | `/login` |
| Perfil público | `src/views/profile/PublicProfileView.vue` | `/profile/:username` |
| Landing / status da API | `src/views/LandingView.vue` | `/` |
| Busca de eventos e usuários | `src/services/searchService.js` | `/search` |

## Dados da entidade principal

- Projeto: **EventHub**
- Entidade principal: **evento**
- Nome plural em camelCase usado na busca: **events**
- Campo de contagem de itens publicados pelo usuário: **eventsCount**
- Banco de dados: **eventhub_db**

> Nesta aula, `eventsCount` representa a quantidade de eventos publicados por cada usuário.
