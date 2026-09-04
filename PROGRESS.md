# FireFly — Living World

## PR8 — Mundo + Progressão

A primeira camada completa da versão 3.0 transforma a exploração em um loop de progressão real: sair da vila, atravessar a floresta/caverna, coletar materiais, ganhar XP, fabricar equipamentos, instalar upgrades e voltar para explorar mais longe.

### Novo loop

`Vila → expedição → coleta → criaturas/pesca → XP → retorno → crafting/upgrades → nova expedição`

### Mundo

- Recursos físicos espalhados pelo mundo e diferentes por região.
- Madeira Viva, Fibra Lunar, Cristal Ecoante, Cogumelo Luminoso e Minério Bruto.
- Recursos reaparecem depois de um tempo, evitando mapa morto.
- Cada material tem habitats naturais; a distribuição acompanha as regiões da floresta e os setores da caverna.
- Recursos possuem feedback visual, partículas, áudio e interação `E`.
- Bancada e estação de upgrades adicionadas à Vila Lumina.

### Progressão

- XP persistente e níveis de 1 a 10.
- Descoberta de nível com feedback visual/sonoro.
- Mochila agora mostra materiais, equipamentos e criaturas.
- Novo painel `P` com nível, XP, materiais, receitas e melhorias.
- Crafting permanente: Rede Reforçada, Lanterna de Cristal, Kit de Exploração, Amuleto do Vagalume e Rede Prismática.
- Upgrades permanentes: Bolsa Expandida, Botas de Trilha, Bagageiro da Van, Caderno de Campo e Licença de Naturalista.
- Save migrado para versão 3 sem apagar dados anteriores.
- Autosave periódico durante a exploração.

### Experiência

A progressão foi construída para recompensar movimento e curiosidade, não apenas menus. O jogador vê um material no mundo, decide se vale a pena desviar do caminho, coleta, ganha XP e volta à vila com uma razão concreta para melhorar o equipamento.

### Validação

`test/smoke.mjs` agora cobre inicialização, mundo, geração de recursos, coleta, crafting, upgrades, pesca, caverna, captura e persistência do save v3.

### Próxima evolução

- NPCs com rotina e acontecimentos.
- Destinos desbloqueáveis da van.
- Eventos dinâmicos e condições raras.
- Segredos e áreas bloqueadas por ferramentas.
- Captura 2.0 com equipamento, variantes e criaturas condicionais.
