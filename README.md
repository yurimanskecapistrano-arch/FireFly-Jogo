# FireFly

Um jogo 2D de exploração, captura de criaturas e pesca feito para rodar diretamente no navegador.

O FireFly utiliza `canvas` para renderizar personagem, criaturas, NPCs, cenário, água, partículas, iluminação, efeitos, animações e câmera.

## Executar

O jogo roda diretamente no navegador. Para testar localmente, use um servidor HTTP simples:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000` em um navegador moderno.

## Controles

- `A` / `D` ou setas: caminhar.
- `Shift`: correr.
- `E`: interagir com NPCs, utilizar a van e iniciar pesca.
- `Espaço`: utilizar a rede ou interagir com a pesca.
- `I`: abrir a mochila.
- `B`: abrir o bestiário.
- `M`: abrir as missões.
- `N`: avançar o ciclo de dia/noite manualmente.
- `Esc`: fechar interfaces.

## Arquitetura

O jogo usa módulos ES nativos, separados por responsabilidade:

- `game/core`: estado, entrada, DOM, constantes e atualização.
- `game/data`: criaturas, raridades, missões, loja e configuração de espécies.
- `game/entities`: jogador, criaturas e van.
- `game/systems`: save, áudio, missões, loja, captura e pesca.
- `game/world`: mapas, cenário e pontos de interesse.
- `game/render`: composição do mundo e interfaces.

## Sistemas

- Vila Lumina, Tito, loja e van.
- Floresta Cintilante com lago e caverna.
- IA específica por espécie e habitats.
- Captura com dificuldade por criatura e feedback visual.
- Pesca com mordida, fisgada e tensão da linha.
- Inventário, moedas, compras e save persistente.
- Bestiário e progressão de descobertas.
- Ciclo contínuo de dia/noite.
- Partículas, transições, câmera suave e efeitos sonoros.
- Smoke test automatizado em `test/smoke.mjs`.

O áudio possui uma camada preparada para assets musicais e ambientes reais; os efeitos atuais também possuem fallback sintetizado para manter o jogo funcional sem arquivos externos.

## Direção de arte — FireFly 9: Pixel Garden

A nova direção visual usa pixel art 2D de baixa resolução, ampliada por *nearest-neighbour* para manter pixels nítidos. O mundo preserva a câmera e os sistemas de jogo existentes, mas separa a composição visual da lógica de exploração.

- `game/render/pixel-art.js`: paleta, céu, parallax, vegetação em blocos, caminhos, lago, construções, caverna e sprite do explorador.
- `game/render/world.js`: coordena a ordem de desenho e continua responsável por HUD contextual, missões, recursos, criaturas e clima.
- `game/entities/player.js`: mantém movimento e colisões; delega somente a representação visual ao sprite pixel art.
- `game/core/dom.js`: renderiza a lógica de 1280×720 em um buffer 640×360; o navegador amplia o canvas sem suavizar os pixels.
- `styles.css`: paleta de interface inspirada em musgo, madeira clara, menta e luz de vaga-lumes.

**Princípio:** redesenhar a apresentação sem reescrever captura, pesca, progressão, inventário, missões ou salvamento. A direção visual deve continuar legível durante a exploração e em telas menores.

### FireFly 9.1 — legibilidade e interface

- Renderização em buffer 640×360, ampliada com nearest-neighbour; blocos de cenário mantêm alinhamento pixelado sem esmagar todos os detalhes.
- Fauna redesenhada como sprites de pixel art com silhuetas distintas (borboleta, sapo, lagarto, aranha, rato, morcego e vagalumes).
- Recursos coletáveis usam sprites de blocos, com contorno e contraste para madeira, fibra, cogumelos e minerais.
- Placas de localização persistentes identificam vila, acampamento, regiões da floresta e setores da caverna.
- HUD e painéis adotam linguagem de caderno de campo: papel quente, verde-floresta, hierarquia tipográfica mais clara, botões com estados de interação e contraste maior.
- A interface do jogo permanece HTML/CSS sobre o canvas, separada da renderização do mundo.

### FireFly 10 — identidade visual leve

- Interface em tons claros de papel, folhas, menta, pêssego e amarelo suave, com tipografia de sistema maior e contraste mais alto.
- A identificação de local saiu do canvas pixelado e passou para um componente HTML acessível, com nome e descrição legíveis em resolução normal.
- Fauna redesenhada com silhuetas mais simpáticas e detalhes próprios; espécies especiais e animais regionais compartilham a mesma linguagem de sprites.
- Música procedural original com melodia pentatônica, acordes sustentados e camadas de ambiente discretas; floresta, vila, noite e caverna têm variações de clima sonoro.
- A música e os efeitos são sintetizados localmente com Web Audio, sem depender de arquivos externos.
