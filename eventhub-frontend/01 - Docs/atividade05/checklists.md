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

- [X] Print do `curl` de login com sucesso.
- [X] Print do `curl` de login com senha incorreta.
- [X] Print do `curl` de `/profile/me` sem token.
- [X] Print do `curl` de `/profile/me` com token válido.
- [X] Print do `curl` de `/profile/me` com token inválido.

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

- [X] `curl-login-sucesso.jpg`
- [X] `curl-login-erro.jpg`
- [X] `curl-profile-sem-token.jpg`
- [X] `curl-profile-com-token.jpg`
- [X] `curl-token-invalido.jpg`
- [X] `login-estilizado.jpg`
- [X] `redirect-login.jpg` mostrando `?redirect=...`.
- [X] `perfil-autenticado-console.jpg` mostrando `Perfil autenticado OK:`.
- [X] `logout-automatico-token-invalido.jpg`.

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

- [X] Backend compactado sem `node_modules`.
- [X] Nome do backend: `DominicKrelling-EventHub-backend.zip`.
- [X] Frontend compactado sem `node_modules`.
- [X] Frontend inclui a pasta `src/stores/`.
- [X] Nome do frontend: `DominicKrelling-EventHub-frontend.zip`.

# Aula 05 — Upload de Arquivos e Edição de Perfil

## Parte A — Backend

### Implementação

- [x] Pasta `public/uploads/profiles/` criada.
- [x] `default-profile.png` mantido dentro da pasta.
- [x] Pacote `multer` instalado.
- [x] `BIO_MAX` adicionado em `config/constants.js`.
- [x] `middlewares/profileMulter.js` criado.
- [x] Upload limitado a imagens JPG, PNG e WEBP.
- [x] Upload limitado a 5 MB.
- [x] `path` importado em `app.js`.
- [x] `/uploads` servido com `express.static`.
- [x] Arquivos estáticos configurados antes das rotas da API.
- [x] `profileUpdateValidator` criado.
- [x] `updateUserProfile` criado no service.
- [x] `updateProfile` criado no controller.
- [x] `PUT /profile/me` criado.
- [x] `PUT /profile/me` protegido por autenticação.
- [x] Foto antiga removida quando uma nova é salva.
- [x] `default-profile.png` nunca é removido.

## Testes Backend

- [X] Atualização sem foto funciona.
- [X] Atualização sem foto mantém a foto atual.
- [X] Atualização com foto funciona.
- [X] Nova foto é salva em disco.
- [X] Foto antiga é removida quando não é a padrão.
- [X] `/uploads/profiles/<arquivo>` responde `200`.
- [X] Bio acima de 255 caracteres responde `400`.

## Parte B — Frontend

### Implementação

- [x] Link `Meu Perfil` aparece na Navbar quando logado.
- [x] `.env` contém `VITE_MEDIA_URL`.
- [x] `src/utils/media.js` criado.
- [x] `src/services/profileService.js` criado.
- [x] `getMyProfile()` criado.
- [x] `updateProfile(formData)` criado.
- [x] Somente `updateProfile` sobrescreve o `Content-Type`.
- [x] `api.js` continua com configuração padrão JSON.
- [x] `MyProfileView.vue` carrega os dados reais.
- [x] Nome pode ser editado.
- [x] Bio pode ser editada.
- [x] Bio possui limite de 255 caracteres.
- [x] Foto pode ser selecionada.
- [x] Preview local da foto funciona.
- [x] Preview usa `URL.createObjectURL`.
- [x] Preview não dispara requisição HTTP.
- [x] Formulário usa `FormData`.
- [x] Foto é adicionada ao `FormData` apenas quando selecionada.
- [x] Store é atualizada após salvar o perfil.

## Testes Frontend

- [X] Perfil carrega os dados reais.
- [X] Navegação até o perfil funciona através da Navbar.
- [X] Preview aparece antes do envio.
- [X] Network não mostra request novo ao selecionar a imagem.
- [X] Salvar sem trocar a foto funciona.
- [X] Salvar trocando a foto funciona.
- [X] Requisição utiliza `multipart/form-data`.
- [X] Request Header apresenta `boundary`.

## Prints

- [X] `perfil-carregado.jpg`
- [X] `preview-local.jpg`
- [X] `upload-multipart.jpg`
- [X] `navbar-link-perfil.jpg`
- [X] Print do curl de atualização sem foto.
- [X] Print do curl de atualização com foto.
- [X] Print do curl do arquivo público.
- [X] Print do curl de bio inválida.

## Entrega

- [X] Backend compactado sem `node_modules`.
- [X] Backend contém `middlewares/profileMulter.js`.
- [X] Backend contém `public/uploads/`.
- [X] Backend contém `default-profile.png`.
- [X] Fotos de teste removidas antes de compactar, se desejado.
- [X] Frontend compactado sem `node_modules`.
- [X] Frontend contém `src/utils/media.js`.
- [X] Frontend contém `src/views/profile/MyProfileView.vue`.