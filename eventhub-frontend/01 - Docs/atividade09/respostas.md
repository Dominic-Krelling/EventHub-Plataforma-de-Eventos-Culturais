# Respostas — Atividade 09 (EventHub)

## 1. Diferença entre 401, 403 e 404 e por que "existe?" vem antes de "é seu?"

O **401** significa que a API não sabe quem está fazendo a requisição: não veio token ou ele é inválido/expirado. O **403** significa que a API sabe quem é a pessoa, mas ela não tem permissão para aquela ação, como a conta B tentar editar ou excluir um evento da conta A. O **404** significa que o recurso não existe. A verificação de existência vem antes da de propriedade porque não é possível comparar o dono de algo que não existe: se o evento não for encontrado, não há `userId` para comparar. No `eventService.js`, `updateEvent` e `removeEvent` primeiro fazem `Event.findByPk` e devolvem 404 se vier vazio, e só depois comparam `event.userId` com o usuário logado para devolver 403. Assim a API responde 404 para ids inexistentes e 403 apenas para eventos que existem e pertencem a outra pessoa.

## 2. Por que o banco é atualizado antes do disco e o que pode dar errado na ordem inversa

Ao trocar a imagem ou excluir um evento, o banco é atualizado primeiro (`event.save()` ou `event.destroy()`) e só depois o arquivo antigo é apagado com `deleteEventImage`. Se a gravação no banco falhar, nada foi apagado do disco e o evento continua consistente, com a imagem antiga ainda existindo. Na ordem inversa, se o arquivo fosse apagado primeiro e o banco falhasse em seguida, o evento continuaria cadastrado apontando para uma imagem que não existe mais, e o usuário veria uma imagem quebrada sem como recuperar. Na ordem correta, o pior caso é sobrar um arquivo solto no disco, que não aparece para ninguém e pode ser limpo depois.

## 3. O que é um arquivo órfão, dois exemplos no EventHub e onde a limpeza acontece

Arquivo órfão é um arquivo que está no disco (em `public/uploads/events/`) mas que nenhum registro do banco referencia. Dois exemplos reais do EventHub: (1) a pessoa envia uma imagem num `PUT /events/:id`, mas a requisição falha depois do Multer (título vazio, evento inexistente ou usuário sem permissão), e o arquivo já foi gravado; (2) na troca de imagem, o evento passa a apontar para o arquivo novo e o arquivo antigo continua no disco porque não foi removido. A limpeza acontece em dois lugares: no `eventService.js`, que apaga a imagem antiga após atualizar o banco e apaga a imagem na exclusão, e nos controllers e no `errorHandler.js`, que removem o arquivo enviado (`req.file`) quando a requisição falha.

## 4. Por que o botão Excluir não fica dentro de um `<a>` e por que o modal não fica dentro do card

Um botão dentro de um `<a>` (ou `RouterLink`) é HTML inválido e faz o clique disparar a navegação para o detalhe junto com a ação de excluir, então a pessoa seria levada para outra tela ao tentar abrir o modal. Por isso o botão fica fora do link, na área de ações do card. O modal fica fora do card porque o card tem seu próprio contexto de estilo (`overflow`, `position`, `transform`, `z-index`), que pode cortar ou deslocar o modal em vez de centralizá-lo na tela. Além disso, cliques dentro do modal propagariam para o card e poderiam acionar links ou eventos dele. Renderizado fora do card, o modal cobre a tela inteira e é independente do layout da grade.

## 5. Por que esconder o botão Editar de quem não é dono não é segurança

Esconder o botão é apenas uma questão de experiência de uso: o front-end roda no navegador da pessoa, que pode alterar o HTML, digitar a URL de edição diretamente ou chamar a API com curl ou Postman, sem passar pela interface. A segurança real precisa estar no back-end, que confere o token e compara o dono do evento com o usuário logado a cada requisição. No EventHub isso é feito no `updateEvent` e no `removeEvent` do `eventService.js`, que devolvem 403 quando `event.userId` é diferente do `userId` do token, e na rota de carregar os dados de edição, protegida da mesma forma. Sem isso, qualquer pessoa autenticada poderia editar ou excluir eventos alheios.
