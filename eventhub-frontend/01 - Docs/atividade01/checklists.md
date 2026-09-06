## Parte A — Backend

### Etapa 1 — Criando o módulo search
- [X] Pasta `modules/search/` criada.
- [X] `searchService.js` criado usando `events` e `users`.

### Etapa 2 — Controller
- [X] `searchController.js` criado.
- [X] Usa `exports.search`.
- [X] Lê `req.query.q`.
- [X] Retorna `query`, `events` e `users`.

### Etapa 3 — Rota
- [X] `searchRoutes.js` criado.
- [X] `GET /search` configurado.
- [X] Rota pública.

### Etapa 4 — Registro em app.js
- [X] `searchRoutes` importado.
- [X] `app.use('/api', searchRoutes)` adicionado.
- [X] API reiniciou sem erros.

### Etapa 5 — Testes
- [X] `GET /api/search?q=teste` testado.
- [X] `GET /api/search` testado.
- [X] `GET /api` continua funcionando.

## Parte B — Frontend

### Etapa 1 — Axios
- [X] `src/services/api.js` criado.
- [X] Axios configurado com `VITE_API_URL`.

### Etapa 2 — Interceptor
- [X] Interceptor de resposta configurado.
- [X] Sucesso retorna `response.data`.
- [X] Erros `4xx/5xx` são normalizados.
- [X] Erro de rede é normalizado.
- [X] Erro de configuração é normalizado.
- [X] Comentário explicativo colocado no topo de `api.js`.

### Etapa 3 — Services
- [X] `authService.js` criado.
- [X] `register()` criado.
- [X] `login()` criado.
- [X] `logout()` criado.
- [X] `searchService.js` criado.
- [X] `search()` usa `params: { q: query }`.
- [X] `systemService.js` criado.
- [X] `getApiStatus()` criado.

### Etapa 4 — Landing Page
- [X] `LandingView.vue` deixou de usar `fetch`.
- [X] Landing usa `getApiStatus()`.
- [X] Página continua mostrando `Status da API: online`.

### Etapa 5 — Validação da busca
- [X] Teste temporário `search('a')` realizado.
- [X] Console mostrou `Busca OK:`.
- [X] Objeto retornado contém `query`, `events` e `users`.
- [X] Erro de rede foi provocado com a API desligada.
- [X] Console mostrou a mensagem amigável do interceptor.
- [X] API foi religada.
- [X] Bloco temporário `search('a')` foi removido da Landing.

## Entrega
- [X] Ficha da Aula 01 atualizada com `events`.
- [X] Pasta `01 - Docs/atividade02/` criada.
- [X] Print do `curl /api/search?q=teste` salvo.
- [X] Print do Console com `Busca OK:` salvo.
- [X] Print do erro de rede salvo.
- [X] Comentário do interceptor presente em `api.js`.
- [X] Backend compactado sem `node_modules`.
- [X] Frontend compactado sem `node_modules`.
