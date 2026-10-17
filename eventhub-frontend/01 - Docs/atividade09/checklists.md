# Checklists gerais — EventHub (Aulas 01 a 09)

Projeto: **EventHub**
Backend: `eventhub-api` — Node.js, Express, Sequelize e MariaDB
Frontend: Vue 3 + Vite
API local: `http://localhost:3000/api`
Frontend local: `http://localhost:5173`

> Marque cada item somente depois de confirmar no código ou testar na aplicação.
> Itens do Grupo A (vídeo/áudio + capa) não se aplicam ao EventHub, que é **Grupo B** (imagem única).

## Aula 01 — Estrutura inicial e comunicação com a API

### Backend

- [x] Projeto Node.js inicializado e scripts de execução configurados.
- [x] Servidor Express iniciado na porta `3000`.
- [x] Estrutura organizada em pastas, incluindo `bin/`, `config/`, `middlewares/`, `modules/` e `routes/`.
- [x] Helpers `success()` e `error()` implementados em `middlewares/apiResponse.js`.
- [x] Endpoint `GET /api` responde em JSON e informa `data.status: "online"`.
- [x] CORS configurado por variável de ambiente `CORS_ORIGIN=http://localhost:5173`.
- [x] Arquivo `.env` configurado sem expor segredos no repositório.

### Frontend

- [x] Projeto Vue 3 + Vite criado e executando.
- [x] Variável `VITE_API_URL=http://localhost:3000/api` configurada.
- [x] Pastas de organização criadas: `views/`, `components/`, `router/`, `services/` e `stores/`.
- [x] Rotas iniciais configuradas: `/`, `/login`, `/register`, `/feed`, `/event/:id`, `/search` e `/notifications`.
- [x] Rotas protegidas identificadas com `requiresAuth` quando aplicável.
- [x] Landing page consulta a API e exibe o estado da conexão.
- [x] Roteamento usa `createRouter` corretamente.
- [x] Testado o acesso à landing page e a mudança de rota sem recarregar o site.

### Evidências

- [x] `curl-api.jpg` salvo.
- [x] `landing-status.jpg` salvo.
- [x] `errocors.jpg` salvo.
- [x] `Funcionalidades-e-Telas.md` atualizado.
- [x] Checklist da Aula 01 preenchido.

## Aula 02 — Camada de serviços e tratamento centralizado de erros

- [x] Instância única do Axios criada em `src/services/api.js`.
- [x] `baseURL` utiliza `import.meta.env.VITE_API_URL`.
- [x] Interceptor de resposta centraliza o tratamento de sucesso e erro.
- [x] Erros de resposta HTTP, ausência de resposta e erro de configuração são tratados separadamente.
- [x] Chamadas HTTP são feitas por arquivos de `services/`, não diretamente nos componentes Vue.
- [x] Serviços do frontend refletem os módulos da API.
- [x] Componentes exibem mensagens de erro compreensíveis.
- [x] Cadastro, login e demais chamadas já existentes continuam funcionando.
- [x] Checklist/evidências exigidos na Aula 02 foram salvos em `01 - Docs/`.

## Aula 03 — Módulo de usuário e autenticação

### Backend

- [x] Model de usuário configurado no Sequelize.
- [x] Cadastro de usuário validado e persistido no banco.
- [x] Login verifica credenciais corretamente.
- [x] Token JWT é gerado após autenticação válida.
- [x] Middleware de autenticação valida o token nas rotas protegidas.
- [x] Senhas nunca são retornadas nas respostas da API.
- [x] Campos/contadores de usuário definidos para as funcionalidades do projeto, incluindo `eventsCount`.
- [x] Respostas da API seguem o padrão centralizado `success()` / `error()`.

### Frontend

- [x] Tela de cadastro conectada à API.
- [x] Tela de login conectada à API.
- [x] Token e estado de autenticação tratados de forma consistente.
- [x] Redirecionamentos após cadastro/login funcionam.
- [x] Rotas privadas não ficam acessíveis a usuários deslogados.
- [x] Checklist/evidências da Aula 03 salvos.

## Aula 04 — Telas e formulários

- [x] Telas de registro e login implementadas e conectadas à API.
- [x] Formulários validam os campos obrigatórios.
- [x] Mensagens de sucesso e erro aparecem para o usuário.
- [x] Estados de carregamento impedem envios repetidos quando necessário.
- [x] Navegação após cadastro e login está correta.
- [x] Nenhuma tela apresenta erros novos no Console do navegador.
- [x] Checklist/evidências da Aula 04 salvos.

## Aula 05 — Perfil e upload da foto do usuário

### Backend

- [x] Endpoint de leitura/edição do perfil implementado.
- [x] `PUT /api/profile/me` funciona com autenticação.
- [x] Upload da foto de perfil configurado com Multer.
- [x] Validação de campos e arquivo implementada.
- [x] Constantes de validação centralizadas em `config/constants.js`.
- [x] Arquivo enviado é salvo e o caminho é persistido corretamente.
- [x] Resposta não expõe senha nem dados sensíveis.

### Frontend

- [x] Tela de perfil carrega dados reais do usuário.
- [x] Edição de perfil salva e atualiza os dados exibidos.
- [x] Upload/alteração da foto de perfil funciona.
- [x] Navegação até o perfil está disponível para usuário autenticado.
- [x] Mensagens de validação e erro são exibidas corretamente.
- [x] Checklist/evidências da Aula 05 salvos.

## Aula 06 — Componentização, `useAuth()` e consistência

### Backend

- [x] Arquivo `checkpoint-01.md` criado em `01 - Docs/`.
- [x] Rotas declaram caminho, verbo, middlewares e controller, sem lógica de negócio.
- [x] Controllers chamam Services, em vez de consultar Models diretamente.
- [x] Services não acessam `req` nem `res`.
- [x] Controllers utilizam `success()` / `error()` de `apiResponse.js`.
- [x] Rotas com funções assíncronas usam `asyncHandler`, quando exigido pela estrutura.
- [x] Validações usam `express-validator`.
- [x] Constantes de validação estão centralizadas e são utilizadas nos pontos corretos.
- [x] Endpoints existentes continuam funcionando.

### Frontend

- [x] Bootstrap Icons incluído por CDN.
- [x] `BaseInput.vue`, `BaseButton.vue` e `FormCard.vue` criados em `src/components/base/`.
- [x] Formulários de cadastro, login e perfil usam os componentes-base.
- [x] Tela de registro tem estilo consistente com as demais telas.
- [x] `src/composables/useAuth.js` criado.
- [x] Guarda de rota, Navbar e Sidebar utilizam `useAuth()`.
- [x] Navbar/Sidebar não oferecem links para funcionalidades ainda inexistentes.
- [x] Cadastro, login, edição de perfil e upload da foto continuam funcionando.
- [x] Acesso direto a uma rota protegida, sem login, redireciona para login.
- [x] Console do navegador sem erros novos.

## Aula 07 — Upload da entidade principal (eventos)

> Configuração do EventHub: **Grupo B**, uma única imagem por evento. Campo do arquivo: `image`. Rota: `POST /api/events`. Pasta de destino: `public/uploads/events/`. Contador do usuário: `eventsCount`.

### Backend

- [x] Model `Event` criado e associado ao model `User`.
- [x] Associação `User.hasMany(Event)` e `Event.belongsTo(User)` declarada em `config/associations.js`.
- [x] `config/associations.js` é carregado antes do `sequelize.sync()`.
- [x] Pasta `public/uploads/events/` existe e pode receber arquivos.
- [x] Constante `TITLE_MAX` adicionada a `VALIDATION` em `config/constants.js`, sem recriar constantes já existentes como `DESCRIPTION_MAX`.
- [x] Middleware Multer configurado para aceitar um arquivo com `upload.single('image')`.
- [x] Campo `image` corresponde exatamente ao nome usado no formulário e no Multer.
- [x] Validator de evento criado e valida título, descrição e imagem.
- [x] Service, controller e routes do módulo de eventos criados.
- [x] Middleware da rota segue a ordem exigida: autenticação → Multer → validação → controller.
- [x] Rota `POST /api/events` registrada em `app.js`.
- [x] Tabela de eventos criada no banco com chave estrangeira para o usuário.
- [x] Ao criar evento, o arquivo é salvo, o registro é persistido e `eventsCount` é incrementado.
- [x] Resposta não inclui senha ou outros campos privados do usuário.
- [x] Os casos de erro exigidos pela atividade retornam os status HTTP esperados.

### Frontend

- [x] Service de eventos envia os dados usando `FormData`.
- [x] `FormData` inclui `title`, `description` e `image`.
- [x] A requisição de upload aceita callback `onUploadProgress`.
- [x] A tela de criação de evento possui campos de título, descrição e imagem.
- [x] Prévia da imagem selecionada aparece antes do envio.
- [x] Barra de progresso é atualizada durante o upload.
- [x] Mensagens de sucesso e erro são exibidas.
- [x] Link/botão para publicar evento aparece somente para usuário autenticado.
- [x] O envio usa `multipart/form-data` com `boundary` gerado pelo navegador/Axios; não se fixa manualmente um cabeçalho incompleto.
- [x] O evento criado aparece no banco e pode ser recuperado pela API.

### Testes e entrega da Aula 07

- [x] Envio válido retorna sucesso.
- [x] Envio sem autenticação retorna `401`.
- [x] Envio sem imagem é recusado com erro de validação.
- [x] Envio com dados inválidos é recusado com o status esperado.
- [x] DevTools → Network mostra `Content-Type: multipart/form-data; boundary=...`.
- [x] `eventsCount` aumenta após a criação do evento.
- [x] `01 - Docs/atividade07/` contém a ficha de preparação atualizada.
- [x] `formulario-preenchido.jpg` salvo.
- [x] `progresso-upload.jpg` salvo (ou `progresso-upload.mp4`).
- [x] `upload-multipart.jpg` salvo.
- [x] Resposta de alcançabilidade da tela escrita e incluída na entrega.

## Aula 08 — Detalhe de evento, feed paginado e imagem real

> Como o EventHub é Grupo B (imagem única), **não se aplica streaming de áudio/vídeo, rota `/stream`, `Range` ou resposta `206 Partial Content`**.

### Backend

- [x] `middlewares/optionalAuth.js` criado: tenta identificar o usuário, mas não bloqueia visitantes sem token.
- [x] Service de eventos contém a função de busca de evento por ID com autor associado.
- [x] Controller e rota pública de detalhe criados: `GET /api/events/:id`.
- [x] Detalhe usa `optionalAuth`, inclui os dados públicos do autor e nunca retorna a senha.
- [x] Detalhe informa `isOwner` corretamente.
- [x] Contagem de visualizações é incrementada a cada consulta de detalhe.
- [x] Evento inexistente retorna `404`.
- [x] Feed implementado em `GET /api/feed`, protegido por autenticação.
- [x] Feed aceita `page` e `limit` como parâmetros de consulta.
- [x] Paginação usa `offset = (page - 1) * limit`.
- [x] Feed retorna os eventos mais recentes, com estrutura de resposta consistente.
- [x] `getFeed` está ligado ao controller/rota corretos.
- [x] Rotas estão montadas no arquivo de aplicação.
- [x] `GET /api/feed?page=1&limit=1` foi testado com token válido.
- [x] `GET /api/feed` sem token retorna `401`.
- [x] Detalhe sem token retorna `200` e `isOwner: false`.
- [x] Detalhe com token do dono retorna `200` e `isOwner: true`.
- [x] Detalhe de evento inexistente retorna `404`.

### Frontend

- [x] Utilitário de URL em `src/utils/media.js` monta corretamente a URL pública da imagem.
- [x] `src/services/eventServices.js` possui função para buscar evento por ID.
- [x] Service possui função para buscar o feed com `page` e `limit`.
- [x] Componente de card de evento reutilizável criado.
- [x] Tela `/feed` exibe eventos reais, não apenas placeholder.
- [x] Feed apresenta os eventos em grade.
- [x] Botão "Carregar mais" busca a página seguinte e adiciona os resultados à grade.
- [x] Estado vazio e erros de carregamento são tratados.
- [x] Tela `/event/:id` busca e exibe o evento real.
- [x] Detalhe exibe título, descrição, autor e imagem em resolução real.
- [x] A imagem usa a URL estática do arquivo enviado, sem player de vídeo/áudio.
- [x] Navegação do card para o detalhe funciona sem recarregar toda a aplicação.
- [x] Console do navegador sem erros durante o fluxo de feed e detalhe.

### Testes finais da Aula 08

- [x] Criar/publicar um evento com imagem.
- [x] Abrir o feed com usuário autenticado e confirmar que o evento aparece.
- [x] Testar `page=1&limit=1` e confirmar que retorna no máximo um evento.
- [x] Testar a próxima página e confirmar que não repete indevidamente o mesmo evento.
- [x] Abrir o detalhe sem token e verificar `isOwner: false`.
- [x] Abrir o detalhe autenticado como dono e verificar `isOwner: true`.
- [x] Abrir um ID inexistente e confirmar `404`.
- [x] Confirmar que a contagem de visualizações aumenta ao abrir o detalhe.
- [x] Confirmar que o feed sem token retorna `401`.
- [x] Confirmar que a imagem do evento carrega pela URL pública.

## Aula 09 — CRUD do item, perfil público e limpeza de arquivos órfãos

> Configuração do EventHub: **Grupo B**. O evento tem um único arquivo (a imagem). O campo opcional da edição usa `multer.single('image')`. Itens específicos do Grupo A (vídeo/áudio + capa) não se aplicam.

### Parte A — Backend (checklist das tarefas)

- [x] `reload()` adicionado ao detalhe (`getEventDetails`).
- [x] Duas chamadas seguidas ao detalhe devolvem contagens consecutivas.
- [x] Verificação 404 antes de 403, nas duas funções que verificam dono (`updateEvent` e `removeEvent`).
- [x] Ordem banco → disco respeitada.
- [x] Contador do usuário (`eventsCount`) decrementado na exclusão.
- [x] Quatro handlers no controller: listar meus eventos, carregar dados de edição, atualizar e excluir.
- [x] Quatro rotas, com Multer antes do validador no PUT.
- [x] `include` + `order` no nível de cima em `getPublicProfile`.
- [x] `isOwner` devolvido no perfil público.
- [x] `/profile/:username` com `optionalAuth`, depois de `/profile/me`.
- [x] `errorHandler.js` atualizado para limpeza de arquivos órfãos e ainda sendo o último `app.use` do `app.js`.

### Parte A — Backend (checklist dos testes)

- [x] `GET /my-events` sem token → `401`; com A → lista, mais novo primeiro; com B (sem itens) → `[]`.
- [x] `GET /events/:id/edit`: sem token → `401`; com B → `403`; id inexistente → `404`; com A → `200` (e a contagem de visualizações não muda).
- [x] `PUT` só com texto, com A → `200`, arquivo inalterado, nenhuma mudança na contagem de arquivos.
- [x] `PUT` com arquivo novo, com A → `200`, nome do arquivo mudou, contagem de arquivos da pasta continua igual.
- [x] Órfãos: `PUT` com arquivo novo feito por B → `403`; `PUT` com arquivo novo e título vazio feito por A → `400`. Nos dois casos, a contagem de arquivos não sobe.
- [x] `DELETE` com B → `403`; com A → `200`; `GET` do item → `404`; arquivo sumiu da pasta; contador do usuário caiu em 1; repetir o `DELETE` → `404`.
- [x] `GET /profile/:username` anônimo (`isOwner: false`, lista de itens ordenada), com o token do dono (`isOwner: true`), com o token de B (`false`) e usuário inexistente (`404`).

### Parte B — Frontend (checklist das tarefas)

- [x] `useClickOutside.js` criado.
- [x] `BaseModal.vue` criado.
- [x] Funções `getMyEvents()`, `getEventForEdit(id)`, `updateEvent(id, formData)` e `deleteEvent(id)` criadas.
- [x] `getPublicProfile` criada.
- [x] Card sem `<a>` gigante, com autor clicável/opcional e slot `actions`.
- [x] O Feed da Atividade 08 continua funcionando sem alteração.
- [x] Menu abre pelo clique, alinha à direita, fecha ao clicar fora, em um item ou com Esc.
- [x] Perfil Público com os três botões corretos (dono / logado / visitante).
- [x] Meus Itens com modal fora do card, estado ocupado e remoção local da lista.
- [x] Editar Item com e sem arquivo novo.
- [x] Autor clicável e botão "Editar" condicional no Detalhe.
- [x] Link para Meus Itens na mensagem de sucesso do Upload.

### Parte B — Frontend (checklist dos testes)

- [x] Menu do avatar: abre, fecha fora, fecha com Esc, fecha ao escolher um item.
- [x] "Ver Perfil" → seu perfil, com Editar Perfil (não "Seguir") e seus itens. Clique no autor de um card de outra conta → perfil dela, com "Seguir". Dentro dele, clique no autor de outro card: a tela troca sem recarregar.
- [x] Janela anônima em `/profile/<username>` → sem "Seguir" e sem "Editar Perfil". Username inexistente → mensagem de erro, tela intacta.
- [x] Meus Itens: conta sem itens → estado vazio com link; com itens → grade com Editar/Excluir. Excluir abre o modal sem navegar para o detalhe, centralizado; Cancelar/X/clicar fora/Esc fecham; clicar dentro da caixa branca não fecha.
- [x] Confirmar uma exclusão → o item some sem recarregar; o arquivo sumiu da pasta de uploads; o contador do perfil caiu.
- [x] Edição: formulário pré-preenchido; salvar só o texto → arquivo mantido; trocar o arquivo → prévia imediata e o antigo some da pasta; apagar o título → mensagem do cliente, sem requisição nova na aba Network.
- [x] DevTools → Network: o `PUT` com arquivo tem `Content-Type: multipart/form-data; boundary=...`.
- [x] Logado como B, digitar na URL a edição de um item da A → mensagem de permissão, sem a tela quebrar. Id inexistente → mensagem de não encontrado.
- [x] Deslogado, abrir a URL de Meus Itens → vai ao login e volta para ela depois de entrar.
- [x] Detalhe de um item seu → "Editar" visível; de outra pessoa → ausente.
- [x] Regressão: Feed, Detalhe com imagem, Upload, Meu Perfil, Login/Logout.

### Evidências e entrega da Aula 09 (`01 - Docs/atividade09/`)

- [x] `menu-avatar.jpg`
- [x] `perfil-publico.jpg`
- [x] `modal-exclusao.jpg`
- [x] `editar.jpg`
- [x] Prints dos curls: `curl-my-events-sem-token.jpg`, `curl-my-events-conta-a.jpg`, `curl-my-events-conta-b-vazio.jpg`
- [x] Prints dos curls: `curl-editar-sem-token.jpg`, `curl-editar-outro-usuario.jpg`, `curl-editar-dono.jpg`, `curl-editar-id-inexistente.jpg`
- [x] Prints dos curls: `curl-editar-texto.jpg`, `curl-editar-imagem-nova.jpg`, `curl-editar-imagem-outro-usuario.jpg`, `curl-editar-titulo-invalido.jpg`
- [x] `curl-arquivos-antes-depois.jpg` (contagem de arquivos antes e depois)
- [x] Prints dos curls: `curl-excluir-outro-usuario.jpg`, `curl-excluir-dono.jpg`, `curl-excluir-verificar-404.jpg`, `curl-excluir-repetido-404.jpg`
- [x] Prints dos curls: `curl-perfil-publico-anonimo.jpg`, `curl-perfil-publico-dono.jpg`, `curl-perfil-publico-outro-usuario.jpg`, `curl-perfil-inexistente-404.jpg`
- [x] Prints dos curls: `curl-detalhe-visualizacao-1.jpg`, `curl-detalhe-visualizacao-2.jpg`, `curl-detalhe-inexistente-404.jpg`, `curl-feed-sem-token-401.jpg`, `curl-feed-paginado.jpg`
- [x] `respostas.md` com as cinco respostas conceituais.
- [x] `checklists.md` atualizado (este arquivo).
- [x] ZIP do backend sem `node_modules` (e sem `.env`), incluindo `errorHandler.js` atualizado.
- [x] ZIP do frontend sem `node_modules`, incluindo `composables/`, `components/base/BaseModal.vue`, card refatorado e as três telas novas.

## Pendências conhecidas para conferir

- [x] Conferir no DevTools → Network a URL final, método, status e corpo da resposta das requisições de upload, feed, detalhe e edição.
- [x] Depois de cada correção, repetir o teste no terminal e no navegador.
- [x] `NotFoundView.vue` precisa ter `<template>` (arquivo vazio quebra o Vite).
- [x] `profileService.js` deve ter apenas uma declaração de `getPublicProfile`.
- [x] `app.js` sem rotas duplicadas.

## Critério de conclusão

- [x] Backend e frontend iniciam sem erros.
- [x] Banco de dados conecta e contém as tabelas/associações esperadas.
- [x] Cadastro, login e perfil continuam funcionando.
- [x] Upload de evento com imagem funciona ponta a ponta.
- [x] Feed autenticado lista eventos reais e pagina corretamente.
- [x] Detalhe público carrega evento, autor público, imagem e `isOwner`.
- [x] Edição, exclusão e perfil público funcionam com as regras 401/403/404.
- [x] Evidências e documentos exigidos foram salvos.
