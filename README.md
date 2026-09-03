# FireFly

Um protótipo 2D de exploração feito para rodar diretamente no navegador, sem etapa de build. O mundo é renderizado em `canvas`: personagens, criaturas, cenário, partículas, iluminação e câmera são desenhados e animados pelo jogo em vez de montados como uma página de elementos HTML.

## Executar

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000` em um navegador moderno.

## Controles

- `A` / `D` ou setas: caminhar (`Shift` corre).
- `E`: interagir com Tito, usar a van e pescar à margem do lago.
- `Espaço`: usar a rede na floresta.
- `I`, `B`, `M`: mochila, bestiário e missões.
- `N`: avança o ciclo de dia/noite (controle útil para testar os vagalumes).

## Sistemas do MVP

- **Vila Lumina:** oficina desenhada, Tito animado e van de exploração.
- **Floresta Cintilante:** floresta em camadas, árvores orgânicas variadas, lago de margem irregular e uma entrada de caverna mineral.
- **Vida no mundo:** movimento com aceleração, câmera suave, criaturas com silhuetas próprias, partículas, água e ambiente animados.
- **Captura e pesca:** rede com feedback visual/partículas, peixes no lago, inventário, bestiário e missão inicial.
- **Dia/noite:** iluminação completa do mapa e vagalumes luminosos, incluindo uma variante lilás rara.
- **Áudio:** `AUDIO` é uma interface preparada para arquivos reais de ambiente, música e efeitos; nenhum som é simulado sem asset.

## Gameplay 2.0

- Interações contextuais por proximidade (`E`) para Tito, lojinha, van, pesca, caverna e retornos.
- Missão persistente de Tito com os estados `available`, `active`, `complete` e `claimed`; a recompensa só pode ser recebida uma vez.
- Lojinha funcional com saldo real, quatro itens compráveis e inventário persistente.
- Save automático em `localStorage` depois de capturas, compras, viagens e eventos de missão.
- Floresta expandida e caverna como mapa independente, com iluminação local que melhora quando há uma lanterna.
- `assets/audio/README.md` define os slots para futuros assets licenciados; efeitos curtos são sintetizados por Web Audio após a primeira interação e podem ser desligados pelo botão `SOM`.
