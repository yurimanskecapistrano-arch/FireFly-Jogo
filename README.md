# FireFly

# FireFly

Um jogo 2D de exploração, captura de criaturas e pesca feito para rodar diretamente no navegador.

O FireFly utiliza `canvas` para renderizar o mundo e seus elementos de jogo, incluindo:

- personagem
- criaturas
- NPCs
- cenário
- água
- partículas
- iluminação
- efeitos
- animações
- câmera

A experiência é construída como um jogo 2D real, e não como uma página HTML composta por elementos de interface.

## Executar

O jogo foi desenvolvido para rodar diretamente no navegador.

Não é necessário um processo de build complexo.

Para executar localmente, abra o projeto através de um servidor local ou utilize a configuração de desenvolvimento existente.

Exemplo:

```bash
npm install
npm run dev
```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000` em um navegador moderno.

## Controles

- `A` / `D` ou setas: caminhar.
- `Shift`: correr.
- `E`: interagir com NPCs, utilizar a van e pescar à margem do lago.
- `Espaço`: utilizar a rede e tentar capturar a criatura mais próxima na floresta.
- `I`: abrir a mochila.
- `B`: abrir o bestiário.
- `M`: abrir as missões.
- `N`: avançar o ciclo de dia/noite manualmente.

## Sistemas do MVP

- **Vila Lumina:** vila jogável com oficina, NPC Tito, quadro de missões, loja e van de exploração.
- **Van de exploração:** viagem entre a Vila Lumina e a Floresta Cintilante.
- **Floresta Cintilante:** floresta em camadas, árvores variadas, vegetação, lago de margem irregular e entrada de caverna.
- **Vida no mundo:** movimento com aceleração, câmera suave, criaturas com comportamentos próprios, partículas, água e ambiente animados.
- **Criaturas:** borboletas, sapos, lagartixas, aranhas, vagalumes, vagalume raro, morcegos e peixes.
- **Captura:** sistema de captura com rede e feedback visual.
- **Pesca:** sistema de pesca no lago.
- **Inventário:** mochila com criaturas, peixes, materiais, ferramentas e moedas.
- **Bestiário:** registro das criaturas descobertas.
- **Missões:** objetivos simples oferecidos por NPCs.
- **Dia/noite:** iluminação e atmosfera mudam entre dia e noite.
- **Vagalumes:** aparecem durante a noite, incluindo uma variante rara.
- **Áudio:** sistema preparado para música, ambiente e efeitos sonoros.
- **Estado da sessão:** inventário, moedas e criaturas descobertas permanecem ao viajar entre áreas.
