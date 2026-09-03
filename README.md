# FireFly

Um MVP web jogável de exploração e captura de criaturas, feito em HTML, CSS e JavaScript sem dependências de build.

## Como executar

Abra `index.html` em um navegador moderno ou sirva o diretório com:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Controles

- `A` / `D` ou setas: mover o explorador.
- `E`: abrir a rota da van no lobby.
- `Espaço`: capturar a criatura mais próxima na floresta.
- `I`, `B`, `M`: abrir mochila, bestiário e missões.

## MVP incluído

- Vila Lumina jogável, com NPC, quadro de missões, loja cenográfica e van.
- Viagem física pela van para a Floresta Cintilante.
- Floresta com árvores, lago, caverna e seis criaturas colecionáveis.
- Inventário, bestiário oculto/progressivo, missão de sapos e moedas.
- Alternância visual de dia/noite pelo botão de música no topo.
- Estado da mochila preservado ao retornar à vila durante a sessão.
