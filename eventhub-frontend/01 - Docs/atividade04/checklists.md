# Checklists — EventHub

## Aula 04 — Login com JWT, Pinia e Proteção de Rotas

> Antes da entrega, confirme no seu computador todos os itens abaixo. Os itens técnicos já implementados podem permanecer marcados; marque os prints somente depois que os arquivos `.jpg` tiverem sido salvos.

## Parte A — Backend

### Implementação

- [x] Pacote `jsonwebtoken` instalado.
- [x] `.env` atualizado com `JWT_SECRET`.
- [x] `.env` atualizado com `JWT_EXPIRES_IN`.
- [x] `config/jwt.js` criado e configurado.
- [x] Função de geração de JWT implementada.
- [x] Função de verificação de JWT implementada.
- [x] `middlewares/auth.js` criado.
- [x] Middleware `isAuthenticated` implementado.
- [x] `userService.js` atualizado com `loginUser`.
- [x] `userService.js` atualizado com `getUserProfile`.
- [x] `userValidator.js` atualizado com `loginValidator`.
- [x] `userController.js` atualizado com `login`.
- [x] `userController.js` atualizado com `logout`.
- [x] `userController.js` atualizado com `getMyProfile`.
- [x] `userRoutes.js` atualizado.
- [x] `/profile/me` declarado antes de `/profile/:username`.

### Testes do backend

- [x] Login com sucesso devolve `token` e `user`.
- [x] `user` retornado pelo login inclui `isAdmin`.
- [x] Senha errada devolve status `500` com mensagem genérica.
- [x] `GET /api/profile/me` sem token devolve `401`.
- [x] `GET /api/profile/me` com token válido devolve os dados do usuário.
- [x] `GET /api/profile/me` com token inválido devolve `401`.

### Prints da Parte A

- [ ] Print do `curl` de login com sucesso.
- [ ] Print do `curl` de login com senha incorreta.
- [ ] Print do `curl` de `/profile/me` sem token.
- [ ] Print do `curl` de `/profile/me` com token válido.
- [ ] Print do `curl` de `/profile/me` com token inválido.

## Parte B — Frontend

### Pinia e autenticação

- [x] `pinia` instalada.
- [x] `createPinia()` registrado em `src/main.js` antes de `.use(router)`.
- [x] `src/stores/auth.js` criado.
- [x] Store mantém token e usuário.
- [x] Token persistido em `localStorage`.
- [x] Usuário persistido em `localStorage`.
- [x] Chave do token: `eventhub_token`.
- [x] Chave do usuário: `eventhub_user`.

### Axios

- [x] Interceptor de requisição implementado.
- [x] Interceptor anexa `Authorization: Bearer <token>` quando existe token.
- [x] Token é lido diretamente do `localStorage`.
- [x] Interceptor de resposta trata qualquer `401`.
- [x] Em `401`, `eventhub_token` é removido.
- [x] Em `401`, `eventhub_user` é removido.
- [x] Em `401`, o usuário é redirecionado ao Login.
- [x] O redirecionamento preserva a rota original com `?redirect=...`.
- [x] Os nomes das chaves são iguais na store e no interceptor.

### Interface

- [x] Bootstrap 5 CSS incluído via CDN.
- [x] `src/assets/main.css` criado.
- [x] Cor de marca definida como `#6c4ab6`.
- [x] Tela de Login usa Bootstrap e identidade visual do EventHub.
- [x] `LoginView.vue` chama `authStore.login(...)`.
- [x] Destino padrão pós-login é a rota principal (`feed`).
- [x] Navbar mostra links diferentes conforme o estado de login.
- [x] Logout limpa a sessão e redireciona ao Login.

### Proteção de rotas

- [x] Rotas privadas utilizam `meta: { requiresAuth: true }`.
- [x] Guarda global do Vue Router implementada.
- [x] Usuário sem token não acessa rota protegida.
- [x] Usuário deslogado é redirecionado para `/login?redirect=...`.

### Testes do frontend

- [x] Login funcional redireciona à tela principal.
- [x] Pressionar `F5` logado mantém a sessão.
- [x] Token e usuário permanecem no `localStorage` após `F5`.
- [x] Logout seguido de acesso direto a rota protegida redireciona ao Login.
- [x] URL de redirecionamento contém `?redirect=...`.
- [x] Login a partir da tela redirecionada volta à rota original.
- [x] Adulterar manualmente o token e recarregar rota protegida gera `401`.
- [x] O interceptor limpa automaticamente a sessão após o `401`.
- [x] O usuário é redirecionado automaticamente ao Login após o `401`.

## Conceitos exigidos

- [x] JWT possui Header, Payload e Signature.
- [x] Header e Payload são codificados, não criptografados.
- [x] A assinatura permite detectar alteração no token.
- [x] O Payload não deve armazenar dados sensíveis.
- [x] Logout em JWT stateless não revoga o token no servidor.
- [x] Revogação real exigiria estado adicional no servidor.
- [x] Ler o token diretamente do `localStorage` no interceptor evita dependência circular entre a camada Axios e a store.

## Evidências / prints da entrega

- [ ] `curl-login-sucesso.jpg`
- [ ] `curl-login-erro.jpg`
- [ ] `curl-profile-sem-token.jpg`
- [ ] `curl-profile-com-token.jpg`
- [ ] `curl-token-invalido.jpg`
- [ ] `login-estilizado.jpg`
- [ ] `redirect-login.jpg` mostrando `?redirect=...`.
- [ ] `perfil-autenticado-console.jpg` mostrando `Perfil autenticado OK:`.
- [ ] `logout-automatico-token-invalido.jpg`.

## Estrutura esperada da documentação

```text
01 - Docs/
├── Ficha-de-Preparacao.md
├── Funcionalides-e-Telas.md
├── checklists.md
└── atividade04/
    ├── curl-login-sucesso.jpg
    ├── curl-login-erro.jpg
    ├── curl-profile-sem-token.jpg
    ├── curl-profile-com-token.jpg
    ├── curl-token-invalido.jpg
    ├── login-estilizado.jpg
    ├── redirect-login.jpg
    ├── perfil-autenticado-console.jpg
    └── logout-automatico-token-invalido.jpg
```

## Arquivos ZIP da entrega

- [ ] Backend compactado sem `node_modules`.
- [ ] Nome do backend: `DominicKrelling-EventHub-backend.zip`.
- [ ] Frontend compactado sem `node_modules`.
- [ ] Frontend inclui a pasta `src/stores/`.
- [ ] Nome do frontend: `DominicKrelling-EventHub-frontend.zip`.
