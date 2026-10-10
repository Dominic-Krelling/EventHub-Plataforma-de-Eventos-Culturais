
# Atividade 08 — EventHub

## Parte A — Backend

- [X] Middleware optionalAuth.js criado.
- [X] Função de detalhes implementada no service.
- [X] Função de Feed paginado implementada no service.
- [X] GET /api/events/:id criado com optionalAuth.
- [X] Coluna views_count adicionada e testada.
- [X] Autor retornado sem expor senha.
- [X] isOwner retornado corretamente.
- [X] GET /api/feed protegido por JWT.
- [X] Feed paginado por page e limit.

## Testes do Backend

- [X] Detalhe sem token retorna 200 e isOwner false.
- [X] Detalhe com token do dono retorna 200 e isOwner true.
- [X] Contagem de visualizações aumenta.
- [X] Evento inexistente retorna 404.
- [X] Feed sem token retorna 401.
- [X] Feed com page=1 e limit=1 retorna um item.
- [X] Feed com page=2 e limit=1 retorna a próxima página.

## Parte B — Frontend

- [X] Função de URL de imagem criada.
- [X] Componente EventCard.vue criado.
- [X] FeedView.vue apresenta eventos reais.
- [X] Botão Carregar mais implementado.
- [X] EventDetailView.vue apresenta evento real.
- [X] Imagem do detalhe exibida em resolução completa.
- [X] isOwner armazenado no estado da tela.
- [X] Navegação do card para o detalhe funcionando.
- [X] Evento inexistente apresenta mensagem de erro.

## Evidências

- [X] feed-real.jpg.
- [X] detalhe-real.jpg.
- [X] curl-detalhe-sem-token.jpg.
- [X] curl-detalhe-com-token.jpg.
- [X] curl-evento-inexistente.jpg.
- [X] curl-feed-sem-token.jpg.
- [X] curl-feed-pagina1.jpg.
- [X] curl-feed-pagina2.jpg.

## Entrega

- [X] Checklist atualizado.
- [X] ZIP do backend sem node_modules.
- [X] ZIP do frontend sem node_modules.

## Grupo B

Streaming, requisições Range e HTTP 206 não se aplicam
ao EventHub, pois sua entidade utiliza uma única imagem.
