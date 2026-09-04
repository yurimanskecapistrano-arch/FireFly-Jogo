# FireFly — Progresso da expansão Living World

Esta entrega traz a primeira grande refatoração do FireFly para uma arquitetura modular e uma IA de criaturas mais coerente com o habitat de cada espécie.

## Arquitetura

O antigo `game.js` monolítico foi dividido em módulos ES nativos:

```text
game/
  main.js
  core/        constants, utils, dom, input, state, update
  data/        dados de criaturas, raridades, missões, loja e espécies
  systems/     save, audio, quests, shop, capture, fishing
  entities/    creatures, player, van
  world/       maps, scenery, spots
  render/      world, panel, dialog, notify, draw-helpers
```

O `index.html` agora inicia `game/main.js` como módulo.

## Sistemas preservados e melhorados

- Vila Lumina, Tito, loja e van.
- Floresta Cintilante, lago e caverna.
- Save persistente com inventário, moedas, descobertas e missão.
- Missão do Tito com estados de aceitar, progresso, conclusão e recompensa.
- Loja com compra real e verificação de saldo.
- Captura com dificuldade por espécie e estado da criatura.
- Pesca com espera, mordida, fisgada e tensão da linha.
- Bestiário e contagem de descobertas.
- Ciclo de dia/noite.
- Partículas, câmera suave, transições e feedback sonoro.

## IA por espécie

As criaturas não usam mais um comportamento único. Borboletas procuram flores e pousam; sapos ficam na região do lago e ganham atividade à noite; lagartixas ficam camufladas e fazem disparos; aranhas permanecem nas teias; ratos fazem pequenos deslocamentos; vagalumes usam movimento orbital e desaparecem durante o dia; morcegos dormem, acordam com a aproximação do jogador e depois retornam ao teto.

## Validação

`node test/smoke.mjs` foi executado nesta entrega e passou pelos fluxos de inicialização, vila, floresta, dia/noite, pesca, caverna, captura e persistência sem exceções.

O smoke test é uma validação de runtime; ainda é necessário testar a experiência visual diretamente no navegador após o merge.

## Próximas evoluções

- Expandir a floresta em regiões realmente distintas.
- Integrar melhor a entrada da caverna ao relevo.
- Criar van com seleção de destinos e embarque mais elaborado.
- Tornar a vila viva com NPCs e rotina.
- Evoluir bestiário com habitat, horários, descrições e progresso.
- Adicionar assets licenciados de música e ambiente.
- Expandir pesca e captura com mais espécies, ferramentas e progressão.
