# Respostas — Atividade 12 (EventHub)

## 1. Por que `useAsyncData` recebe `() => minhaChamada()` e não `minhaChamada()`

Se eu escrevesse `useAsyncData(minhaChamada())`, a chamada à API já teria acontecido antes de o composable existir: o que ele receberia seria uma *Promise* pronta, e não algo que ele pudesse executar. Com `() => minhaChamada()` ele recebe uma **função**, e assim é ele quem decide quando chamar: ao montar a tela, de novo quando o parâmetro da rota muda (`watch`), ou quando o usuário clica em "Tentar novamente". Também é só com a função que ele consegue numerar cada execução e descartar respostas atrasadas. Além disso, a função lê `route.params.id` no momento da chamada, então sempre usa o valor atual.

## 2. O que é a corrida entre respostas, como ela aparece para o usuário e como o `lastCallId` a evita

A corrida acontece quando duas requisições da mesma tela estão em andamento e a mais antiga termina por último. Exemplo: abro o perfil de B, troco rápido para o de C; a resposta de C chega primeiro e a de B chega depois e sobrescreve a tela. O usuário vê o perfil de B sob a URL de C, sem nenhum erro. No `useAsyncData`, cada execução incrementa um contador (`const callId = ++lastCallId`). Quando a resposta chega, comparo `callId !== lastCallId`: se outra chamada mais nova já começou, a resposta velha é ignorada e não grava `data`, `error` nem `isLoading`. Só a chamada mais recente pode atualizar a tela.

## 3. Quem avisa o usuário quando uma ação falha, quando uma leitura falha e quando um formulário falha, e por que "toast para todo erro" seria erro de design

- **Ação** (curtir, seguir, excluir): o interceptor do Axios, com um toast. O usuário clicou e saiu da frente da tela; o botão só desfaz a mudança visual.
- **Leitura** (abrir feed, perfil, detalhe): a própria tela, no lugar do conteúdo que não carregou, com "Tentar novamente". Um toast sumiria em segundos e deixaria uma tela vazia sem explicação.
- **Formulário** (login, cadastro, criar/editar evento, comentar): o próprio formulário, junto ao campo, marcado com `silent: true` para o interceptor não duplicar.

"Toast para todo erro" seria um erro de design porque o aviso ficaria longe do contexto (um erro de senha errada flutuando no canto), duplicaria mensagens que a tela já mostra e desapareceria sozinho justo quando o usuário precisa agir. Cada erro deve aparecer onde o usuário olha.

## 4. Por que a lista de toasts fica fora de `useToast()` (singleton) e a vantagem sobre uma store do Pinia neste caso

Se a lista (`ref([])`) ficasse dentro da função, cada chamada de `useToast()` criaria uma lista nova e o `ToastContainer` nunca veria os toasts criados em outro lugar. Fora da função, ela é criada uma só vez no módulo, e todo mundo que chama `useToast()` (componentes, composables e o interceptor do Axios em `api.js`) enxerga a mesma lista. A vantagem sobre o Pinia é a simplicidade: o `api.js` é um arquivo comum, que roda antes e fora da árvore de componentes; usar uma store ali exigiria que o Pinia já estivesse instalado e ativo. Um módulo com um `ref` não depende de `app.use(pinia)`, não cria outra camada (state, actions) e continua reativo, o que basta para uma lista efêmera que não precisa de devtools, persistência nem ser lida por várias telas.

## 5. Por que `?limit=-3` era um problema, por que `Number.parseInt('abc') >= 1` dá `false` (e o que isso tem de útil) e por que existe um teto para o `limit`

`Number(req.query.limit)` aceitava `-3`, e o valor ia direto para o `LIMIT` do SQL: no MariaDB um `LIMIT` negativo é erro de sintaxe, ou seja, `500` por culpa de uma query string, e o `offset` também ficava negativo com `page=-2`. `Number.parseInt('abc')` é `NaN`, e qualquer comparação com `NaN` dá `false` (`NaN >= 1` é `false`). Isso é útil porque um único teste, `limit >= 1`, cobre tudo que é inválido: ausente (`undefined` vira `NaN`), texto e negativos; todos caem no valor padrão, sem erro. O teto (`MAX_LIMIT`, 50) existe porque `?limit=100000` pediria a tabela inteira de uma vez: lento, caro e uma forma fácil de sobrecarregar o servidor. É preciso usar `>= 1` (e não `> 1`), senão `limit=1`, que é válido, cairia no padrão.

## 6. Por que o miolo da atualização otimista não foi extraído hoje e o que é a "regra dos três"

O `LikeButton` e o `FollowButton` repetem o mesmo esqueleto (guardar o estado, mudar a tela, chamar a API, desfazer em caso de erro), mas só são **dois** casos, e eles diferem em detalhes (um tem contador próprio, o outro usa `defineModel` e atualiza o contador do pai). A regra dos três diz para abstrair só quando a mesma coisa aparece pela terceira vez: com dois exemplos ainda não sei o que é realmente comum e o que é coincidência, e uma abstração feita cedo demais costuma ficar errada e mais difícil de mudar do que a duplicação. Hoje extraí só o que já era idêntico nos dois (a "cerca": login do visitante e `isBusy`, em `useAuthenticatedAction`). Quando surgir um terceiro botão otimista, aí o miolo comum se revela e vale extrair.

## 7. O que pode dar errado quando um Service grava o registro e o contador do autor sem transação

São duas escritas separadas, então uma pode funcionar e a outra falhar. Se o `Event.create` funcionar e o `increment` do contador de eventos do usuário falhar (queda de conexão, deadlock, erro do servidor), o evento existe, mas o contador do autor fica menor que a realidade. No sentido inverso, o contador sobe sem o registro existir. Sem transação não há como desfazer a primeira escrita, e a divergência fica gravada no banco, sem erro visível. Com `sequelize.transaction(async (t) => ...)` e `{ transaction: t }` nas duas escritas, ou as duas são confirmadas ou nenhuma: se qualquer uma falhar, o banco volta ao estado anterior. Isso vale também para o `lock` na linha do usuário, que enfileira criações simultâneas e evita que duas leituras do mesmo valor percam um incremento.