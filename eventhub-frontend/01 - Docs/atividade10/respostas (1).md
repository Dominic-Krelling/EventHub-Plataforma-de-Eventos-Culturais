# Respostas — Atividade 10 (EventHub)

## 1. Por que "uma pessoa só curte uma vez" deve estar no banco (índice único composto) e não só no código

No `toggleLike`, o código procura uma curtida existente com `findOne` e só cria a nova se não achar. Essa checagem sozinha não basta: se duas requisições da mesma pessoa chegarem ao mesmo tempo (duplo clique, duas abas), as duas podem fazer o `findOne`, não encontrar nada e as duas criarem a curtida, deixando o evento com duas curtidas do mesmo usuário. O índice único composto em (`user_id`, `event_id`) na tabela `likes` é a última linha de defesa: o banco recusa a segunda inserção com `Duplicate entry`, não importa o que o código, outro cliente ou um bug tente fazer. O código decide o fluxo normal, mas a garantia de integridade precisa estar onde os dados vivem.

## 2. Diferença entre contador guardado e contador calculado, o risco do primeiro e como a transação o elimina

Contador calculado é obtido na hora com `COUNT(*)` sobre a tabela `likes`: está sempre correto, mas cada card do feed exigiria uma contagem, o que fica caro com muitos dados. Contador guardado é uma coluna (`likesCount` em `events`) que é lida direto, o que é rápido. O risco é a divergência: a curtida é uma linha em `likes` e o contador é outra escrita em `events`. Se uma das duas funcionar e a outra falhar, o número exibido deixa de bater com a realidade. A transação (`sequelize.transaction`) agrupa as duas escritas: ou as duas são confirmadas, ou as duas são desfeitas. Assim o contador guardado nunca fica inconsistente com as linhas da tabela, e continuamos com a leitura rápida.

## 3. O que acontece se um comando dentro de `sequelize.transaction` esquecer `{ transaction: t }`

Esse comando deixa de participar da transação e roda em outra conexão do banco, com confirmação imediata. Na prática, se a transação falhar e for desfeita, esse comando não é desfeito, e o resultado é dado inconsistente (por exemplo, a linha da curtida é criada, mas o contador não muda, ou o contrário). Também pode travar: quando a transação segura um lock na linha do evento (`lock: t.LOCK.UPDATE`), um comando fora dela que tente alterar a mesma linha fica esperando e pode terminar com erro de timeout. Por isso todo `create`, `destroy`, `increment`, `decrement`, `findByPk` e `reload` dentro da transação leva `{ transaction: t }`.

## 4. O que é atualização otimista, seus três passos e quando não usá-la

Atualização otimista é mudar a interface imediatamente, assumindo que a API vai dar certo, em vez de esperar a resposta. No `LikeButton` são três passos: (1) guardar o estado anterior (`previousLiked` e `previousCount`); (2) atualizar a tela na hora (inverter o coração e ajustar o contador) e enviar a requisição; (3) se a API falhar, fazer o rollback para o estado guardado e mostrar a mensagem de erro (se der certo, confirmar com os valores devolvidos pelo servidor). Não se deve usar quando a ação é difícil de desfazer ou o resultado depende do servidor: exclusão definitiva, pagamentos, criação de itens cujo id ou conteúdo vem do servidor, ou operações com validação complexa. Para curtir, funciona bem porque é uma ação simples, barata e reversível.

## 5. Por que o texto do comentário sai com `{{ }}` e nunca com `v-html`

O `{{ }}` do Vue escapa o conteúdo: qualquer `<`, `>` ou aspas viram texto, então `<b>teste</b>` aparece literalmente na tela. O `v-html` interpreta o conteúdo como HTML. Como o comentário é escrito por um usuário e exibido para outros, usar `v-html` abriria uma falha de XSS: alguém poderia comentar algo como `<img src=x onerror="...">` e o script rodaria no navegador de todo mundo que abrisse o evento, podendo roubar o token de login ou agir em nome da vítima. Com `{{ }}`, o mesmo comentário é só texto inofensivo. As quebras de linha são preservadas com `white-space: pre-wrap` no CSS, sem precisar de HTML.

## 6. Por que `.trim()` precisa vir antes de `.notEmpty()`

Os validadores do `express-validator` rodam na ordem em que são declarados. Um texto só com espaços, como `"   "`, não é uma string vazia, então se o `notEmpty()` vier primeiro ele passa, e só depois o `trim()` transforma o valor em `""`, que acaba salvo no banco sem nenhum erro. Com `.trim()` primeiro, o valor já chega ao `notEmpty()` como `""`, e a validação falha corretamente com `400`. O mesmo vale para título, descrição e comentário: sempre `.trim().notEmpty()`, nunca o inverso.
