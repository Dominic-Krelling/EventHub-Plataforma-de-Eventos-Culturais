# Checklist geral --- EventHub (Aulas 01 a 08)

Projeto: **EventHub**\
Backend: `eventhub-api` --- Node.js, Express, Sequelize e MariaDB\
Frontend: Vue 3 + Vite\
API local: `http://localhost:3000/api`\
Frontend local: `http://localhost:5173`

> Marque cada item somente depois de confirmar no código ou testar na
> aplicação. Este arquivo reúne os checkpoints acumulados até a Aula 08.

## Aula 01 --- Estrutura inicial e comunicação com a API

### Backend

-   [ ] Projeto Node.js inicializado e scripts de execução configurados.
-   [ ] Servidor Express iniciado na porta `3000`.
-   [ ] Estrutura organizada em pastas, incluindo `bin/`, `config/`,
    `middlewares/`, `modules/` e `routes/`.
-   [ ] Helpers `success()` e `error()` implementados em
    `middlewares/apiResponse.js`.
-   [ ] Endpoint `GET /api` responde em JSON e informa
    `data.status: "online"`.
-   [ ] CORS configurado por variável de ambiente
    `CORS_ORIGIN=http://localhost:5173`.
-   [ ] Arquivo `.env` configurado sem expor segredos no repositório.

### Frontend

-   [ ] Projeto Vue 3 + Vite criado e executando.
-   [ ] Variável `VITE_API_URL=http://localhost:3000/api` configurada.
-   [ ] Pastas de organização criadas: `views/`, `components/`,
    `router/`, `services/` e `stores/`.
-   [ ] Rotas iniciais configuradas: `/`, `/login`, `/register`,
    `/feed`, `/event/:id`, `/search` e `/notifications`.
-   [ ] Rotas protegidas identificadas com `requiresAuth` quando
    aplicável.
-   [ ] Landing page consulta a API e exibe o estado da conexão.
-   [ ] Roteamento usa `createRouter` corretamente.
-   [ ] Testado o acesso à landing page e a mudança de rota sem
    recarregar o site.

### Evidências

-   [ ] `curl-api.jpg` salvo.
-   [ ] `landing-status.jpg` salvo.
-   [ ] `errocors.jpg` salvo.
-   [ ] `Funcionalidades-e-Telas.md` atualizado.
-   [ ] Checklist da Aula 01 preenchido.

## Aula 02 --- Camada de serviços e tratamento centralizado de erros

-   [ ] Instância única do Axios criada em `src/services/api.js`.
-   [ ] `baseURL` utiliza `import.meta.env.VITE_API_URL`.
-   [ ] Interceptor de resposta centraliza o tratamento de sucesso e
    erro.
-   [ ] Erros de resposta HTTP, ausência de resposta e erro de
    configuração são tratados separadamente.
-   [ ] Chamadas HTTP são feitas por arquivos de `services/`, não
    diretamente nos componentes Vue.
-   [ ] Serviços do frontend refletem os módulos da API.
-   [ ] Componentes exibem mensagens de erro compreensíveis.
-   [ ] Cadastro, login e demais chamadas já existentes continuam
    funcionando.
-   [ ] Checklist/evidências exigidos na Aula 02 foram salvos em
    `01 - Docs/`.

## Aula 03 --- Módulo de usuário e autenticação

### Backend

-   [ ] Model de usuário configurado no Sequelize.
-   [ ] Cadastro de usuário validado e persistido no banco.
-   [ ] Login verifica credenciais corretamente.
-   [ ] Token JWT é gerado após autenticação válida.
-   [ ] Middleware de autenticação valida o token nas rotas protegidas.
-   [ ] Senhas nunca são retornadas nas respostas da API.
-   [ ] Campos/contadores de usuário definidos para as funcionalidades
    do projeto, incluindo `eventsCount` se esse for o nome adotado.
-   [ ] Respostas da API seguem o padrão centralizado `success()` /
    `error()`.

### Frontend

-   [ ] Tela de cadastro conectada à API.
-   [ ] Tela de login conectada à API.
-   [ ] Token e estado de autenticação tratados de forma consistente.
-   [ ] Redirecionamentos após cadastro/login funcionam.
-   [ ] Rotas privadas não ficam acessíveis a usuários deslogados.
-   [ ] Checklist/evidências da Aula 03 salvos.

## Aula 04 --- Telas e formulários

-   [ ] Telas de registro e login implementadas e conectadas à API.
-   [ ] Formulários validam os campos obrigatórios.
-   [ ] Mensagens de sucesso e erro aparecem para o usuário.
-   [ ] Estados de carregamento impedem envios repetidos quando
    necessário.
-   [ ] Navegação após cadastro e login está correta.
-   [ ] Nenhuma tela apresenta erros novos no Console do navegador.
-   [ ] Checklist/evidências da Aula 04 salvos.

## Aula 05 --- Perfil e upload da foto do usuário

### Backend

-   [ ] Endpoint de leitura/edição do perfil implementado.
-   [ ] `PUT /api/profile/me` funciona com autenticação.
-   [ ] Upload da foto de perfil configurado com Multer.
-   [ ] Validação de campos e arquivo implementada.
-   [ ] Constantes de validação centralizadas em `config/constants.js`.
-   [ ] Arquivo enviado é salvo e o caminho é persistido corretamente.
-   [ ] Resposta não expõe senha nem dados sensíveis.

### Frontend

-   [ ] Tela de perfil carrega dados reais do usuário.
-   [ ] Edição de perfil salva e atualiza os dados exibidos.
-   [ ] Upload/alteração da foto de perfil funciona.
-   [ ] Navegação até o perfil está disponível para usuário autenticado.
-   [ ] Mensagens de validação e erro são exibidas corretamente.
-   [ ] Checklist/evidências da Aula 05 salvos.

## Aula 06 --- Componentização, `useAuth()` e consistência

### Backend

-   [ ] Arquivo `checkpoint-01.md` criado em `01 - Docs/`.
-   [ ] Rotas declaram caminho, verbo, middlewares e controller, sem
    lógica de negócio.
-   [ ] Controllers chamam Services, em vez de consultar Models
    diretamente.
-   [ ] Services não acessam `req` nem `res`.
-   [ ] Controllers utilizam `success()` / `error()` de
    `apiResponse.js`.
-   [ ] Rotas com funções assíncronas usam `asyncHandler`, quando
    exigido pela estrutura.
-   [ ] Validações usam `express-validator`.
-   [ ] Constantes de validação estão centralizadas e são utilizadas nos
    pontos corretos.
-   [ ] Endpoints existentes continuam funcionando.

### Frontend

-   [ ] Bootstrap Icons incluído por CDN.
-   [ ] `BaseInput.vue`, `BaseButton.vue` e `FormCard.vue` criados em
    `src/components/base/`.
-   [ ] Formulários de cadastro, login e perfil usam os
    componentes-base.
-   [ ] Tela de registro tem estilo consistente com as demais telas.
-   [ ] `src/composables/useAuth.js` criado.
-   [ ] Guarda de rota, Navbar e Sidebar utilizam `useAuth()`.
-   [ ] Navbar/Sidebar não oferecem links para funcionalidades ainda
    inexistentes.
-   [ ] Cadastro, login, edição de perfil e upload da foto continuam
    funcionando.
-   [ ] Acesso direto a uma rota protegida, sem login, redireciona para
    login.
-   [ ] Console do navegador sem erros novos.

## Aula 07 --- Upload da entidade principal (eventos)

> Configuração do EventHub: **Grupo B**, uma única imagem por evento.
> Campo do arquivo: `image`. Rota: `POST /api/events`. Pasta de destino:
> `public/uploads/events/`. Contador do usuário: `eventsCount`.

### Backend

-   [ ] Model `Event` criado e associado ao model `User`.
-   [ ] Associação `User.hasMany(Event)` e `Event.belongsTo(User)`
    declarada em `config/associations.js`.
-   [ ] `config/associations.js` é carregado antes do
    `sequelize.sync()`.
-   [ ] Pasta `public/uploads/events/` existe e pode receber arquivos.
-   [ ] Constante `TITLE_MAX` adicionada a `VALIDATION` em
    `config/constants.js`, sem recriar constantes já existentes como
    `DESCRIPTION_MAX`.
-   [ ] Middleware Multer configurado para aceitar um arquivo com
    `upload.single('image')`.
-   [ ] Campo `image` corresponde exatamente ao nome usado no formulário
    e no Multer.
-   [ ] Validator de evento criado e valida título, descrição e imagem.
-   [ ] Service, controller e routes do módulo de eventos criados.
-   [ ] Middleware da rota segue a ordem exigida: autenticação → Multer
    → validação → controller.
-   [ ] Rota `POST /api/events` registrada em `app.js`.
-   [ ] Tabela de eventos criada no banco com chave estrangeira para o
    usuário.
-   [ ] Ao criar evento, o arquivo é salvo, o registro é persistido e
    `eventsCount` é incrementado.
-   [ ] Resposta não inclui senha ou outros campos privados do usuário.
-   [ ] Os casos de erro exigidos pela atividade retornam os status HTTP
    esperados.

### Frontend

-   [ ] Service de eventos envia os dados usando `FormData`.
-   [ ] `FormData` inclui `title`, `description` e `image`.
-   [ ] A requisição de upload aceita callback `onUploadProgress`.
-   [ ] A tela de criação de evento possui campos de título, descrição e
    imagem.
-   [ ] Prévia da imagem selecionada aparece antes do envio.
-   [ ] Barra de progresso é atualizada durante o upload.
-   [ ] Mensagens de sucesso e erro são exibidas.
-   [ ] Link/botão para publicar evento aparece somente para usuário
    autenticado.
-   [ ] O envio usa `multipart/form-data` com `boundary` gerado pelo
    navegador/Axios; não se fixa manualmente um cabeçalho incompleto.
-   [ ] O evento criado aparece no banco e pode ser recuperado pela API.

### Testes e entrega da Aula 07

-   [ ] Envio válido retorna sucesso.
-   [ ] Envio sem autenticação retorna `401`.
-   [ ] Envio sem imagem é recusado com erro de validação.
-   [ ] Envio com dados inválidos é recusado com o status esperado.
-   [ ] DevTools → Network mostra
    `Content-Type: multipart/form-data; boundary=...`.
-   [ ] `eventsCount` aumenta após a criação do evento.
-   [ ] `01 - Docs/atividade07/` contém a ficha de preparação
    atualizada.
-   [ ] `formulario-preenchido.jpg` salvo.
-   [ ] `progresso-upload.jpg` salvo (ou `progresso-upload.mp4` se o
    progresso for rápido demais).
-   [ ] `upload-multipart.jpg` salvo.
-   [ ] Resposta de alcançabilidade da tela escrita e incluída na
    entrega.

## Aula 08 --- Detalhe de evento, feed paginado e imagem real

> Como o EventHub é Grupo B (imagem única), **não se aplica streaming de
> áudio/vídeo, rota `/stream`, `Range` ou resposta
> `206 Partial Content`**. A tela de detalhe deve exibir a imagem do
> evento em resolução real.

### Backend

-   [ ] `middlewares/optionalAuth.js` criado: tenta identificar o
    usuário, mas não bloqueia visitantes sem token.
-   [ ] Service de eventos contém a função de busca de evento por ID com
    autor associado.
-   [ ] Controller e rota pública de detalhe criados:
    `GET /api/events/:id`.
-   [ ] Detalhe usa `optionalAuth`, inclui os dados públicos do autor e
    nunca retorna a senha.
-   [ ] Detalhe informa `isOwner` corretamente.
-   [ ] Contagem de visualizações é incrementada a cada consulta de
    detalhe, usando a coluna criada/reaproveitada no model.
-   [ ] Evento inexistente retorna `404`.
-   [ ] Feed implementado em `GET /api/feed`, protegido por
    autenticação.
-   [ ] Feed aceita `page` e `limit` como parâmetros de consulta.
-   [ ] Paginação usa `offset = (page - 1) * limit`.
-   [ ] Feed retorna os eventos mais recentes, com estrutura de resposta
    consistente.
-   [ ] `getFeed` está ligado ao controller/rota corretos (conforme a
    arquitetura do projeto).
-   [ ] Rotas estão montadas no arquivo de aplicação.
-   [ ] `GET /api/feed?page=1&limit=1` foi testado com token válido.
-   [ ] `GET /api/feed` sem token retorna `401`.
-   [ ] Detalhe sem token retorna `200` e `isOwner: false`.
-   [ ] Detalhe com token do dono retorna `200` e `isOwner: true`.
-   [ ] Detalhe de evento inexistente retorna `404`.

### Frontend

-   [ ] Utilitário de URL em `src/utils/media.js` monta corretamente a
    URL pública da imagem.
-   [ ] `src/services/eventServices.js` possui função para buscar evento
    por ID.
-   [ ] Service possui função para buscar o feed com `page` e `limit`.
-   [ ] Componente de card de evento reutilizável criado.
-   [ ] Tela `/feed` exibe eventos reais, não apenas placeholder.
-   [ ] Feed apresenta os eventos em grade.
-   [ ] Botão "Carregar mais" busca a página seguinte e adiciona os
    resultados à grade.
-   [ ] Estado vazio e erros de carregamento são tratados.
-   [ ] Tela `/event/:id` busca e exibe o evento real.
-   [ ] Detalhe exibe título, descrição, autor e imagem em resolução
    real.
-   [ ] A imagem usa a URL estática do arquivo enviado, sem player de
    vídeo/áudio.
-   [ ] Navegação do card para o detalhe funciona sem recarregar toda a
    aplicação.
-   [ ] Console do navegador sem erros durante o fluxo de feed e
    detalhe.

### Testes finais da Aula 08

-   [ ] Criar/publicar um evento com imagem.
-   [ ] Abrir o feed com usuário autenticado e confirmar que o evento
    aparece.
-   [ ] Testar `page=1&limit=1` e confirmar que retorna no máximo um
    evento.
-   [ ] Testar a próxima página e confirmar que não repete indevidamente
    o mesmo evento.
-   [ ] Abrir o detalhe sem token e verificar `isOwner: false`.
-   [ ] Abrir o detalhe autenticado como dono e verificar
    `isOwner: true`.
-   [ ] Abrir um ID inexistente e confirmar `404`.
-   [ ] Confirmar que a contagem de visualizações aumenta ao abrir o
    detalhe.
-   [ ] Confirmar que o feed sem token retorna `401`.
-   [ ] Confirmar que a imagem do evento carrega pela URL pública.

## Pendências conhecidas para conferir

-   [ ] **Feed:** houve um teste com
    `GET http://localhost:3000/api/feed?page=1&limit=1` que retornou
    `404 Not Found`. Confirmar se a rota está registrada no caminho
    correto e se o servidor foi reiniciado depois das alterações.
-   [ ] **Upload de evento:** em um teste anterior, o backend respondeu
    `400` com a mensagem "A imagem do evento é obrigatória." Verificar
    se o frontend envia `FormData` com o campo exatamente chamado
    `image` e se o middleware usa `upload.single('image')`.
-   [ ] Conferir no DevTools → Network a URL final, método, status e
    corpo da resposta das requisições de upload, feed e detalhe.
-   [ ] Depois de cada correção, repetir o teste no terminal e no
    navegador.

## Organização sugerida dos documentos

-   [ ] `01 - Docs/Funcionalidades-e-Telas.md`
-   [ ] `01 - Docs/checkpoint-01.md`
-   [ ] `01 - Docs/atividade07/`
-   [ ] `01 - Docs/checklist.md` (este arquivo)
-   [ ] Prints e evidências nomeados conforme cada enunciado.

## Critério de conclusão

-   [ ] Backend e frontend iniciam sem erros.
-   [ ] Banco de dados conecta e contém as tabelas/associações
    esperadas.
-   [ ] Cadastro, login e perfil continuam funcionando.
-   [ ] Upload de evento com imagem funciona ponta a ponta.
-   [ ] Feed autenticado lista eventos reais e pagina corretamente.
-   [ ] Detalhe público carrega evento, autor público, imagem e
    `isOwner`.
-   [ ] Evidências e documentos exigidos foram salvos.
