# Respostas — Atividade 11 (EventHub)

## 1. Por que uma tabela que liga a mesma tabela duas vezes precisa de apelidos (`as`), e como ler `getFollowers` e `getFollowing` sem trocá-las

A tabela `follows` tem duas chaves estrangeiras para `users` (`followerId` e `followingId`). Sem apelidos, o Sequelize não sabe a qual das duas relações o `include` se refere, e os métodos gerados colidiriam. Por isso declaramos `Follow.belongsTo(User, { as: 'Follower', ... })` e `Follow.belongsTo(User, { as: 'Following', ... })`: o apelido diz qual lado da linha queremos carregar. Para não trocar as funções, leio em voz alta: **"seguidores de X"** são as linhas em que X é o *seguido* (`where: { followingId: X }`), e a pessoa que quero mostrar é o `Follower` de cada linha. **"Quem X segue"** são as linhas em que X é o *seguidor* (`where: { followerId: X }`), e a pessoa a mostrar é o `Following`. O `where` filtra pelo lado de X; o `include` traz o lado oposto.

## 2. Por que a ordem das colunas num índice composto importa, e por que a tabela tem um segundo índice

Um índice composto `(follower_id, following_id)` é ordenado primeiro por `follower_id` e, dentro dele, por `following_id`. Ele só ajuda consultas que usem a coluna mais à esquerda (ou as duas juntas): buscar "quem A segue" e checar "A segue B" usam o índice. Já buscar só por `following_id` (listar os seguidores de alguém) não consegue aproveitá-lo e viraria uma varredura da tabela. Por isso existe o segundo índice, simples, em `following_id`. O índice composto ainda cumpre outro papel: por ser único, o banco recusa uma segunda linha igual, garantindo que ninguém siga a mesma pessoa duas vezes mesmo em requisições simultâneas.

## 3. Por que `followerId === followingId` nunca dava `true` quando o id vinha direto de `req.params`, e onde a conversão deve acontecer

`req.params.userId` é sempre uma **string** (`'5'`), enquanto o id do usuário logado, vindo do token, é um **número** (`5`). O operador `===` não converte tipos, então `5 === '5'` é `false` e a checagem "seguir a si mesmo" nunca disparava, deixando a pessoa se seguir sem erro algum. A conversão deve acontecer na borda, no controller (`parseUserId`), que transforma o parâmetro em número, responde `400` se não for um inteiro positivo e só então chama o service. Assim o service já recebe tipos corretos e a comparação funciona.

## 4. Em que situação usar `v-model` / `defineModel` em vez do padrão "valor inicial → estado próprio" da Atividade 10

No `LikeButton`, o botão recebia o valor inicial e mantinha um estado próprio, porque ninguém mais precisava saber a contagem. Já no `FollowButton`, o número de seguidores aparece também no cartão do perfil, que é do componente pai. Quando filho e pai precisam enxergar **o mesmo valor ao mesmo tempo**, o estado deve ser compartilhado: `defineModel` no filho e `v-model:following` / `v-model:followers-count` no pai. Assim, a atualização otimista no botão muda o contador do perfil na hora, sem eventos manuais nem duas cópias do dado que poderiam divergir.

## 5. Por que, com `defineModel`, ler o valor logo depois de atribuí-lo devolve o antigo, e como evitar

O valor de um `defineModel` vem da prop do pai. Ao atribuir `following.value = x`, o filho apenas emite `update:following`; a prop só muda depois que o pai processa o evento e a renderização atualiza, o que acontece no ciclo seguinte. Então ler `following.value` na linha seguinte ainda devolve o valor antigo. Para evitar, calculo o novo estado numa **variável local** (`const nowFollowing = !previousFollowing`), uso essa variável para atribuir ao model e para os cálculos seguintes (o contador, por exemplo), e nunca releio `following.value` logo após atribuí-lo.

## 6. Por que o feed filtrado devolve `[]` cedo quando você não segue ninguém

Primeiro buscamos os ids de quem o usuário segue e montamos um array. Se ele está vazio, o resultado é conhecido de antemão: não há eventos a mostrar. Devolver `[]` logo evita rodar a consulta de eventos à toa e evita depender do comportamento de `Op.in` com lista vazia, que gera uma condição sem sentido (`IN ()`) e pode variar entre bancos. É mais rápido, mais seguro e deixa explícito o caso "não sigo ninguém", que o front trata com um estado vazio e um link para o Feed.