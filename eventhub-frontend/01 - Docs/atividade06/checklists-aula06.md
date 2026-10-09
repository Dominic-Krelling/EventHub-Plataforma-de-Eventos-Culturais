# Checklist — Aula 06 EventHub

## Parte A — Backend
- [X] `checkpoint-01.md` revisado e respondido com base nos arquivos atuais
- [X] Módulos usuário e busca seguem Route → Controller → Service → Model
- [X] Controllers não acessam Models diretamente
- [X] Services não usam `req`/`res`
- [X] Respostas padronizadas por `apiResponse.js`
- [X] Rotas assíncronas envolvidas por `asyncHandler`
- [X] Validações centralizadas com `express-validator` e `config/constants.js`
- [X] `BIO_MAX` conferida
- [X] Todos os endpoints existentes testados

## Parte B — Frontend
- [X] Bootstrap Icons incluído por CDN
- [X] `src/components/base/BaseInput.vue` criado
- [X] `src/components/base/BaseButton.vue` criado
- [X] `src/components/base/FormCard.vue` criado
- [X] Registro refatorado e estilizado
- [X] Login refatorado
- [X] Perfil refatorado, mantendo upload
- [X] `src/composables/useAuth.js` criado
- [X] Guarda de rotas usa `useAuth()`
- [X] Navbar usa `useAuth()`
- [X] Sidebar usa `useAuth()`
- [X] Links para funcionalidades não implementadas ocultados

## Testes
- [X] Cadastro redireciona para Login
- [X] Login redireciona para tela principal
- [X] Navbar alterna entre logado e deslogado
- [X] Perfil carrega dados reais
- [X] Perfil permite editar nome e bio
- [X] Perfil permite preview e upload de foto
- [X] Rota protegida redireciona deslogado para Login
- [X] Console sem erros novos

## Prints
- [X] `registro-antes.jpg`
- [X] `registro-depois.jpg`
- [X] `tres-telas-consistentes.jpg`
- [X] Print da Navbar logada/deslogada em `.jpg`

## Entrega
- [X] `checkpoint-01.md` em `01 - Docs/atividade06/`
- [X] Prints em `01 - Docs/atividade06/`
- [X] `checklists.md` atualizado
- [X] ZIP backend sem `node_modules`
- [X] ZIP frontend sem `node_modules`, contendo `components/base/` e `composables/`
