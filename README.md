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
- `game/core/dom.js`: renderiza a lógica de 1280×720 em um buffer 320×180; o navegador amplia o canvas sem suavizar os pixels.
- `styles.css`: paleta de interface inspirada em musgo, madeira clara, menta e luz de vaga-lumes.

**Princípio:** redesenhar a apresentação sem reescrever captura, pesca, progressão, inventário, missões ou salvamento. A direção visual deve continuar legível durante a exploração e em telas menores.
