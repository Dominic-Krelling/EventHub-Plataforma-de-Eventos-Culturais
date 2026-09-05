# Checklists — EventHub — Aula 03

## Parte A — Backend

### Etapa 1 — Dependências
- [X] sequelize instalado
- [X] mysql2 instalado
- [X] bcryptjs instalado
- [X] express-validator instalado

### Etapa 2 — Banco de dados
- [X] Banco `eventhub_db` criado
- [X] `.env` atualizado com as credenciais MySQL
- [X] `config/database.js` criado

### Etapa 3 — Constants
- [X] `config/constants.js` criado
- [X] `USERNAME_MIN = 3`
- [X] `USERNAME_MAX = 20`
- [X] `PASSWORD_MIN = 6`

### Etapa 4 — Módulo user
- [X] `modules/user/` criado
- [X] `userModel.js` criado
- [X] `userValidator.js` criado
- [X] `userService.js` criado
- [X] `asyncHandler.js` criado
- [X] `errorHandler.js` criado
- [X] `userController.js` criado
- [X] `userRoutes.js` criado
- [X] Senha nunca retornada pela API

### Etapa 5 — Integração
- [X] `userRoutes` registrado no `app.js`
- [X] `errorHandler` registrado como último middleware
- [X] `sequelize.sync({ alter: true })` funcionando
- [X] Mensagem `Banco de dados sincronizado!` exibida
- [X] Tabela `users` criada no MySQL

### Etapa 6 — Testes da API
- [X] Cadastro válido retorna 201
- [X] Senha curta retorna 400
- [X] Cadastro duplicado retorna 500 conforme o roteiro
- [X] `GET /api/profile/:username` retorna o usuário persistido

## Parte B — Frontend

### Etapa 1 — Contrato
- [X] Regras de validação conferidas

### Etapa 2 — Navbar
- [X] Link `Criar Conta` para `/register` disponível

### Etapa 3 — Formulário
- [X] `RegisterView.vue` usa `v-model`
- [X] Campos `fullName`, `username`, `email`, `password` e `confirmPassword`
- [X] Estados de erro configurados
- [X] Estado de envio configurado

### Etapa 4 — Validação client-side
- [X] Nome completo obrigatório
- [X] Usuário entre 3 e 20 caracteres
- [X] E-mail válido
- [X] Senha com pelo menos 6 caracteres
- [X] Confirmação igual à senha
- [X] Erros exibidos nos campos

### Etapa 5 — API
- [X] `authService.register()` utilizado
- [X] Cadastro válido redireciona para `/login`
- [X] Erro da API aparece em `apiErrorMessage`
- [X] Cadastro duplicado mostra a mensagem da API

### Etapa 6 — Teste prático
- [X] Formulário vazio não envia requisição
- [X] Senha curta mostra erro
- [X] Cadastro válido funciona
- [X] Cadastro duplicado mostra erro
- [X] `curl /api/profile/:username` confirma persistência

## Entrega
- [X] `tabela-users.jpg`
- [X] `curl-cadastro-sucesso.jpg`
- [X] `curl-erro-validacao.jpg`
- [X] `curl-erro-duplicidade.jpg`
- [X] `curl-profile.jpg`
- [X] `registro-erros.jpg`
- [X] `registro-duplicidade-network.jpg`
- [X] ZIP backend sem `node_modules`
- [X] ZIP frontend sem `node_modules`
