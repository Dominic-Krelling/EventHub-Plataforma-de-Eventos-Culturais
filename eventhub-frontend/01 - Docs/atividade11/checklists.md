# Checklists — Atividade 11 (EventHub): Seguir pessoas e feed de quem eu sigo

> Marcados `[x]`: conferidos no código e em teste automatizado do back-end (SQLite em memória).
> Deixados `[ ]`: dependem de você rodar a aplicação (MariaDB, navegador, DevTools) e tirar os prints.

## Contexto / adaptação de nomes (EventHub)

| Nome | EventHub |
|---|---|
| Contador de seguidores | `followersCount` |
| Contador de seguindo | `followingCount` |
| Rota do feed filtrado | `/api/following-events` |

## Checagem de alcançabilidade (ADR-012)

| Peça | Caminho de clique |
|---|---|
| Seguir / deixar de seguir | Botão no perfil público de outra pessoa; visitante → `/login?redirect=...` → volta ao perfil |
| Listas de seguidores/seguindo | Números "Seguidores"/"Seguindo" do perfil são `router-link`; abas entre as duas listas; link "Voltar ao perfil" |
| Feed filtrado | Sidebar → "Seguindo" → `/following-events` (1 clique) |

- [x] O `router-link` da Sidebar para "Seguindo" não existia; foi criado apontando para `/following-events`, e a rota correspondente existe em `router/index.js` (`requiresAuth`).

## Parte A — Backend

### Etapa 1 — Model e associações
- [x] `modules/follow/followModel.js` criado, com índice único `['follower_id','following_id']` e índice simples `['following_id']`.
- [x] Associações `Follower` / `Following` declaradas em `config/associations.js`.
- [X] Tabela `follows` e índices conferidos no MariaDB (`SHOW INDEX FROM follows`).

### Etapa 2 — Service, controller e rotas
- [x] Três arquivos do módulo `follow`, com `followRoutes` registrado no `app.js` antes do 404 e do `errorHandler`.
- [x] `parseUserId` converte o id na borda (400 se inválido).
- [x] Três escritas (linha + dois contadores) numa só transação, todas com `{ transaction: t }`.

### Etapa 3 — Feed filtrado e `isFollowing`
- [x] `getFollowingEvents` com `Op.in`, paginado, devolvendo `[]` para quem não segue ninguém.
- [x] `isFollowing` (e `isOwner`) no perfil público, consultando o banco só com usuário logado e não dono.

### Etapa 4 — Testes (cenários validados em SQLite; repetir via `curl` no MariaDB para os prints)
- [x] `toggle-follow`: id `abc` → 400; a si mesmo → 400; usuário 99999 → 404 (sem token → 401 pelo middleware).
- [x] A segue B → 201 / 1; de novo → 200 / 0; de novo → 201 / 1; C segue B → 2; B segue A.
- [x] Contadores: B 2/1; A 1/1; C 0/1.
- [x] `isFollowing`: visitante `false`; A→B `true`; C→A `false`; B no próprio perfil `false` (`isOwner: true`).
- [x] `followers` de B (C e A, mais recente primeiro); `following` de A; sem `password`.
- [x] Feed filtrado: A vê só itens de B; `page=2&limit=1` → `[]`; quem não segue ninguém → `[]`.
- [x] Linha repetida em `follows` é recusada (índice único).
- [X] Oito testes repetidos com `curl` contra a API real, com prints.
- [X] Regressão: curtir, comentar, upload, edição, exclusão e `GET /feed`.

## Parte B — Frontend

- [x] `services/followService.js` criado.
- [x] `FollowButton` com `defineModel`, otimista, com rollback e `isBusy`; sem leitura "logo após atribuir" (usa `nowFollowing`).
- [x] Perfil público com `FollowButton` ligado por `v-model:following` e `v-model:followers-count`.
- [x] Números "Seguidores"/"Seguindo" viram links.
- [x] `FollowListView`: uma tela, duas rotas (`props: { kind }`), abas, estados vazios com o nome da pessoa.
- [x] Tela do feed filtrado com "Carregar mais" e estado vazio com link para o Feed.
- [x] Rotas registradas em `router/index.js`.

### Teste prático (a executar no navegador)
- [X] 1. Visitante: botão aparece; clique leva ao login e volta ao perfil.
- [X] 2. Logado: "Seguir" muda botão e contador na hora; F5 mantém; "Seguindo" desfaz.
- [X] 3. Slow 4G: mudança instantânea. Offline: muda e volta atrás com mensagem de erro.
- [X] 4. Contador nunca vai para -1.
- [X] 5. No seu perfil não há botão de seguir; números são links.
- [X] 6. Troca de aba Seguidores ↔ Seguindo sem recarregar; clicar numa pessoa leva ao perfil; usuário inexistente mostra erro; listas vazias mostram mensagem.
- [X] 7. Trocar de uma pessoa seguida para uma não seguida: o botão reflete a pessoa nova.
- [X] 8. Feed filtrado pela Sidebar: só itens de quem sigo; deixar de seguir tira os itens.
- [X] 9. Regressão: Perfil, Feed, Detalhe, Meus Eventos, Curtidas, Login/Logout.

## Evidências (`01 - Docs/atividade11/`)
- [X] `seguindo.jpg`, `otimista.jpg`, `rollback.jpg`, `seguidores.jpg`, `feed-seguindo.jpg`, `follows.jpg`
- [X] Prints dos `curl` da Parte A, Etapa 4
- [x] `respostas.md` com as seis respostas
- [x] `checklists.md` (este arquivo)
- [X] ZIPs de back-end e front-end sem `node_modules`

## Correções feitas fora do escopo (para você conhecer)
- `eventhub-api/modules/like/likeService.js` tinha, no topo, um `import api from './api'` (código de front-end) num arquivo CommonJS; removido, pois quebraria o `require`.
- `PublicProfileView.vue` usava `response` antes de declará-la em `loadProfile` e lia `response.data.data`/`error.response`, incompatível com o interceptor do `api.js`; corrigido junto com a integração do botão.