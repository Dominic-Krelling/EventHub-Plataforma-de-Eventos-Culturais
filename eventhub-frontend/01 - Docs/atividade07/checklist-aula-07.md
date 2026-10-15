# Checklist --- Aula 07: Upload de eventos (EventHub)

Projeto: **EventHub**\
Módulo: `eventhub-api`\
Grupo escolhido: **Grupo B --- uma única imagem por evento**\
Model: `Event`\
Campo do arquivo: `image`\
Rota: `POST /api/events`\
Pasta de upload: `public/uploads/events/`\
Contador do usuário: `eventsCount`

## 1. Backend --- model, associação e upload

-   [ ] Criar o model `Event` com os campos necessários, incluindo
    título, descrição e caminho/nome da imagem.
-   [ ] Associar `Event` ao usuário que publicou o evento.
-   [ ] Declarar `User.hasMany(Event)` e `Event.belongsTo(User)` em
    `config/associations.js`.
-   [ ] Garantir que `config/associations.js` seja carregado antes do
    `sequelize.sync()`.
-   [ ] Confirmar que a tabela de eventos é criada com a chave
    estrangeira do usuário.
-   [ ] Criar a pasta `public/uploads/events/`.
-   [ ] Configurar Multer para salvar arquivos nessa pasta.
-   [ ] Limitar o upload a um único arquivo com
    `upload.single('image')`.
-   [ ] Confirmar que o campo usado no Multer é exatamente `image`.
-   [ ] Adicionar `TITLE_MAX` a `VALIDATION` em `config/constants.js`.
-   [ ] Reutilizar a constante de descrição existente
    (`DESCRIPTION_MAX`), sem duplicá-la.
-   [ ] Criar validator para título, descrição e presença do arquivo.
-   [ ] Criar service de eventos.
-   [ ] Criar controller de eventos.
-   [ ] Criar routes de eventos.
-   [ ] Montar a rota em `app.js` como `POST /api/events`.
-   [ ] Conferir a ordem dos middlewares: autenticação → Multer →
    validator → controller.
-   [ ] Após o upload, salvar o evento associado ao usuário autenticado.
-   [ ] Incrementar `eventsCount` somente quando a criação do evento for
    concluída com sucesso.
-   [ ] Não retornar senha nem dados privados do usuário nas respostas.

## 2. Frontend --- formulário e progresso

-   [ ] Criar/atualizar a função de criação de evento em
    `src/services/eventServices.js`.
-   [ ] Enviar os dados usando `FormData`.
-   [ ] Adicionar os campos `title`, `description` e `image` ao
    `FormData`.
-   [ ] Passar `onUploadProgress` para a requisição Axios.
-   [ ] Calcular a porcentagem de progresso a partir dos bytes
    carregados e do total, quando disponível.
-   [ ] Criar formulário com título, descrição e seleção de imagem.
-   [ ] Exibir uma prévia da imagem selecionada antes do envio.
-   [ ] Exibir barra de progresso durante o upload.
-   [ ] Exibir mensagens de sucesso e erro.
-   [ ] Desabilitar o botão de envio durante a requisição para evitar
    envios duplicados.
-   [ ] Adicionar link/botão "Publicar Evento" à navegação.
-   [ ] Mostrar o link de publicação apenas para usuários autenticados.
-   [ ] Confirmar que a rota da tela abre sem recarregar toda a
    aplicação.
-   [ ] Não definir manualmente `Content-Type: multipart/form-data` sem
    boundary; deixar Axios/navegador configurar o cabeçalho para o
    `FormData`.

## 3. Testes da API

-   [ ] Com token válido e dados válidos, `POST /api/events` cria o
    evento com sucesso.
-   [ ] Sem token, a rota retorna `401`.
-   [ ] Sem imagem, a API rejeita o envio com a mensagem de validação
    esperada.
-   [ ] Com título ausente/inválido, a API retorna o status de validação
    esperado.
-   [ ] Com descrição inválida, a API retorna o status de validação
    esperado.
-   [ ] Com arquivo de tipo não permitido, se houver restrição de tipo,
    o upload é rejeitado.
-   [ ] Confirmar que o arquivo foi salvo em `public/uploads/events/`.
-   [ ] Confirmar que o registro foi criado na tabela de eventos.
-   [ ] Confirmar que o evento pertence ao usuário autenticado.
-   [ ] Confirmar que `eventsCount` aumentou após uma criação
    bem-sucedida.
-   [ ] Confirmar que `eventsCount` não aumenta quando a requisição
    falha.
-   [ ] Conferir a requisição no DevTools → Network.
-   [ ] Confirmar o cabeçalho
    `Content-Type: multipart/form-data; boundary=...`.

## 4. Teste de ponta a ponta no navegador

-   [ ] Fazer login.
-   [ ] Clicar em "Publicar Evento".
-   [ ] Confirmar que a URL muda sem recarregar a página.
-   [ ] Tentar enviar o formulário vazio e confirmar as mensagens de
    campo obrigatório.
-   [ ] Selecionar uma imagem e confirmar que a prévia aparece sem
    chamada de rede.
-   [ ] Preencher título e descrição válidos.
-   [ ] Enviar e observar a barra de progresso.
-   [ ] Confirmar a mensagem de sucesso.
-   [ ] Confirmar que o evento criado pode ser recuperado pela
    API/banco.
-   [ ] Confirmar que o contador `eventsCount` foi atualizado.
-   [ ] Verificar Console e Network sem erros inesperados.

## 5. Entrega --- pasta `01 - Docs/atividade07/`

-   [ ] Ficha de preparação atualizada com as informações da entidade e
    do Grupo B.
-   [ ] `formulario-preenchido.jpg` --- formulário preenchido antes do
    envio.
-   [ ] `progresso-upload.jpg` --- barra de progresso durante o envio.
-   [ ] Se o upload for rápido demais para capturar,
    `progresso-upload.mp4` como alternativa.
-   [ ] `upload-multipart.jpg` --- aba Network mostrando
    `multipart/form-data; boundary=...`.
-   [ ] Resposta escrita sobre a alcançabilidade da tela incluída na
    entrega.
-   [ ] Todos os arquivos estão dentro de `01 - Docs/atividade07/`.

## 6. Explicações para conseguir apresentar

-   [ ] Explicar por que `hasMany` / `belongsTo` precisam ser declarados
    explicitamente no Sequelize.
-   [ ] Explicar por que centralizar associações em
    `config/associations.js` ajuda a evitar referências circulares entre
    models.
-   [ ] Explicar a diferença entre `multer.single('image')` e
    `multer.fields([...])`.
-   [ ] Explicar por que o EventHub usa `single('image')` (um único
    arquivo por evento).
-   [ ] Explicar o que `onUploadProgress` recebe e como calcular a
    porcentagem.
-   [ ] Explicar por que o navegador/Axios deve gerar o `boundary` do
    `multipart/form-data`.

## Pendências para conferir no projeto

-   [ ] Se aparecer `400` com "A imagem do evento é obrigatória.",
    confirmar que o `FormData` envia `image` e a rota usa
    `upload.single('image')`.
-   [ ] Confirmar que o campo do formulário, o `FormData`, o middleware
    Multer e o validator usam o mesmo nome: `image`.
-   [ ] Repetir o teste depois de qualquer correção e guardar as
    evidências finais.
