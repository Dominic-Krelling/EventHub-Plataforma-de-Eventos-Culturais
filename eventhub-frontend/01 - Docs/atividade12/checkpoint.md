# Checkpoint 02 — Leitura guiada da API (EventHub)

Projeto: **EventHub**. Backend `eventhub-api` (Node, Express, Sequelize, MariaDB). Os trechos "antes" citam o código como estava no início da Atividade 12, com arquivo e linha.

## Adaptação de nomes

| Nome | EventHub |
|---|---|
| Entidade principal | `Event` |
| Service que cria e mexe no contador | `eventService.createEvent` |
| Contador do usuário afetado | `eventsCount` |
| Controller do feed geral | `eventController.feed` (rota `GET /api/feed`) |
| Controller do feed filtrado | `followController.listFollowingEvents` (rota `GET /api/following-events`) |
| Telas que leem dados ao montar | Detalhe, Perfil Público, Curtidas (`/liked-events` e `/favorites`), Meus Eventos, Listas de seguidores/seguindo, Comentários, Feed, Feed filtrado |

## 1. Escritas duplas e transações

**Pergunta:** algum Service grava em duas tabelas (ou em duas linhas) sem transação?

**Resposta: não, nenhum.** Todos os Services com escrita dupla já usam `sequelize.transaction` com `{ transaction: t }` em cada escrita:

| Service | Escritas | Em transação? |
|---|---|---|
| `eventService.createEvent` (`eventService.js:21-45`) | `Event.create` + `eventsCount` do autor | Sim (com `lock` na linha do usuário) |
| `eventService.removeEvent` (`eventService.js:270-282`) | `Like.destroy`, `Comment.destroy`, `event.destroy`, `eventsCount` | Sim |
| `likeService.toggleLike` | `Like` + `likesCount` | Sim (com `lock` no evento) |
| `commentService.createComment` | `Comment` + `commentsCount` | Sim (com `lock` no evento) |
| `followService.toggleFollow` | `Follow` + `followersCount` + `followingCount` | Sim |

Escritas únicas (`registerUser`, `updateUserProfile`, o `increment` de `viewsCount` em `getEventDetails`) não precisam de transação.

Como o equivalente ao "upload de vídeo" (`createEvent`) já estava em transação, a Etapa 3 virou **confirmação**: criei 3 eventos pela API, recebi `201` nas três e o `eventsCount` do autor foi de 0 para 3.

## 2. Validação de entrada (ids e paginação)

- **Ids de rota:** os três controllers que recebem id (`like`, `comment`, `follow`) tinham cada um sua cópia de `parseId` e `invalidId`. Resolvido hoje: `parseId` virou `utils/parseId.js` e os três a importam. O `invalidId` continua em cada controller porque a mensagem muda (evento/usuário).
- **Paginação: problema encontrado e corrigido** (Etapa 2): `?limit=-3`, `?limit=100000` e `?page=-2` eram tratados com `Number(...)` e comparações soltas, e **os dois feeds divergiam**:
  - `feedRoutes.js:12-13` (rota real do feed geral): padrão `limit ?? 10`, com validação própria.
  - `eventController.js:171-172` (função `feed`, que nunca era usada): padrão `limit ?? 6`.
  - `eventService.js:106`: padrão `limit = 6`; `eventService.js:146` (feed filtrado): padrão `limit = 12`.

  Eram quatro padrões diferentes para o mesmo conceito. Agora existe `PAGINATION` em `config/constants.js`, `utils/pagination.js` (`parsePagination`) é usada nos dois controllers e os dois Services usam as constantes.
- **Busca por números soltos:** `grep` por `limit = N`, `page = N`, `?? N` e `|| N` em `modules/` não encontra mais nenhum tamanho de página fora de `config/constants.js`.

## 3. Autenticação e rotas

- **Rotas duplicadas em `app.js`: problema encontrado e corrigido.** O `app.js` registrava `app.use('/api/events', eventRoutes)` e `app.use('/api/feed', feedRoutes)` **duas vezes** (linhas 47-48 e 51-52), e `GET /api/my-events` também duas vezes (linhas 38 e 58). Mantive uma de cada. (O checklist da Atividade 10 dizia "app.js sem rotas duplicadas", o que não era verdade.)
- **Rota do feed:** `feedRoutes.js` tinha o handler inteiro escrito dentro da rota, duplicando `eventController.feed`. Agora a rota só chama o controller.
- **Rotas protegidas:** feed, curtir, comentar, seguir, `following-events`, `liked-events` e `events/mine` usam `isAuthenticated`. O perfil público e o detalhe usam `optionalAuth` (leem `isFollowing`, `isLiked` e `isOwner` quando há usuário).
- **Bug de resposta encontrado e corrigido:** `eventService.getEventDetails` (`eventService.js:90-96`) calculava `isLiked` mas **não o devolvia** na resposta (só `isOwner`). Depois de curtir e apertar F5, o coração voltava vazio, contradizendo o passo "F5 mantém" da Atividade 10. Agora o objeto retornado inclui `isLiked`.

## 4. Tratamento de erros

- **Status errados em `userService.js`:** três erros de autenticação usavam `error.status = 500`:
  - `userService.js:48`: cadastro com e-mail ou usuário repetido.
  - `userService.js:96`: login com e-mail inexistente.
  - `userService.js:113`: login com senha errada.

  O `errorHandler.js` troca a mensagem de qualquer `500` por "Erro interno do servidor.", então o usuário que errava a senha via essa mensagem em vez de "E-mail ou senha inválidos.". Corrigido para `409` (cadastro repetido) e `401` (credenciais inválidas). O interceptor do front não redireciona o `401` da tela de login (senha errada fica no formulário).
- **Ids inválidos:** ver a pergunta extra 3 abaixo.

## 5. Valores soltos e repetição

- **Número solto (`5 * 1024 * 1024`):** aparecia em `eventMulter.js:56` e em `profileMulter.js:60`, com o texto "5 MB" no `errorHandler`. Resolvido: `VALIDATION.IMAGE_MAX_BYTES` em `config/constants.js`, usado nos dois multers.
- **Limites duplicados entre model e constantes:** `userModel.js:38` (`STRING(255)`) repete `BIO_MAX`; `eventModel.js:12` (`STRING(150)`) repete `TITLE_MAX`. Ficou como está (é o schema do banco, e o validador já usa as constantes).

## 6. Regressão da API

Rodei a bateria de curl completa, adaptada aos nomes do projeto, e todas as chamadas responderam como esperado:

| Chamada | Resultado |
|---|---|
| Login com senha errada | `401` "E-mail ou senha inválidos." |
| Cadastro repetido | `409` |
| Perfil com `isFollowing` (visitante, A→B, C→A, B no próprio) | `false` / `true` / `false` / `false` (`isOwner: true`) |
| Feed geral: sem token / com token / paginado | `401` / `200` / `200` |
| Seguir, seguidores, feed filtrado | `201`, lista correta, só itens de quem sigo |
| Curtir / curtidas / detalhe com `isLiked` | `201` / `200` / `isLiked: true` |
| Comentar / listar comentários | `201` / `200` |
| Meus eventos (`/events/mine`) | `200` |
| Excluir evento | `200`; contador do autor volta ao valor anterior |

## 7. Perguntas extras

**1) Quantas vezes aparece o padrão `new Error(...)` / `error.status = N` / `throw error`?**

`const error = new Error(...)` aparece **9 vezes** em `modules/` e `error.status = N` aparece **18 vezes** em `modules/` e `middlewares/`, distribuídas nestes arquivos:

| Arquivo | `error.status = N` |
|---|---|
| `modules/user/userService.js` | 7 |
| `modules/event/eventService.js` | 5 |
| `modules/like/likeService.js` | 1 |
| `modules/comment/commentService.js` | 1 |
| `modules/follow/followService.js` | 1 (dentro do helper `httpError`) |
| `middlewares/eventMulter.js` | 1 |
| `middlewares/profileMulter.js` | 1 |
| `modules/user/userValidator.js` | 1 (em `validate`) |

O padrão está espalhado e repetido; é candidato a um helper `httpError(message, status)` (ver pendências).

**2) Que outro valor numérico solto, além do tamanho de página, aparece em mais de um arquivo?**

O limite de imagem `5 * 1024 * 1024` (5 MB): em `eventMulter.js` e `profileMulter.js`, e também no front (`CreateEventView.vue` e `MyProfileView.vue`). Hoje ele vive só em `VALIDATION.IMAGE_MAX_BYTES` (API) e `LIMITS.IMAGE_MAX_BYTES` (front). Os limites de texto (150, 255, 500, 2000 etc.) também estavam repetidos nos formulários do front e agora vêm de `LIMITS`.

**3) Os três `curl` de id inválido respondem com o mesmo status?**

Sim. Os três módulos respondem `400` com mensagem própria:

| Rota | Status | Mensagem |
|---|---|---|
| `POST /api/events/abc/toggle-like` | `400` | "ID do evento inválido." |
| `GET /api/events/abc/comments` | `400` | "ID do evento inválido." |
| `POST /api/users/abc/toggle-follow` | `400` | "ID do usuário inválido." |

## 8. Pendências próprias (ADR-013)

Itens que encontrei fora da lista dos roteiros e **não resolvi hoje**:

| O que é | Por que não foi resolvido hoje | Em qual aula será resolvido |
|---|---|---|
| Os cartões de evento estão copiados à mão em `LikedEventsView`, `MyFavoritesView`, `MyEventsView` e `PublicProfileView`, com marcação e CSS quase iguais, e o componente `EventCard` já existe. | Trocar os quatro exige mexer no visual de quatro telas e repetir o teste visual em cada uma; um checkpoint não deve introduzir mudança de interface. | Aula 13 (a confirmar com o professor) |
| `LikedEventsView` (`/liked-events`) e `MyFavoritesView` (`/favorites`) mostram os mesmos dados (eventos curtidos). A Sidebar só leva a `/favorites`. | Remover uma das telas muda rotas e links já entregues e testados nas Atividades 10 e 11. | Aula 13 (a confirmar com o professor) |
| O padrão `const error = new Error(...)` + `error.status = N` + `throw error` repete 18 vezes em 8 arquivos (pergunta extra 1). | Só trocaria sintaxe, sem mudar comportamento, e tocaria quase todos os Services, o que aumentaria o risco da regressão do checkpoint. | Aula 13 (a confirmar com o professor) |

Resolvido hoje por ser pequeno e seguro: `parseId` triplicado, rotas duplicadas do `app.js`, `isLiked` ausente do detalhe, status `500` do login, limite de 5 MB solto, `import` do `UserMenu` com caixa diferente do nome do arquivo (`userMenu.vue`), redirecionamento de `EditEventView` para uma rota que não existe (`/events/mine`; a correta é `/my-events`).