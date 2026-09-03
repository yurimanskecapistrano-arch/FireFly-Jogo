# Audio asset slots

`AudioManager` safely supports local audio files when they are added. Expected optional files:

- `music/village.ogg`, `music/forest-day.ogg`, `music/forest-night.ogg`, `music/cave.ogg`
- `ambient/village.ogg`, `ambient/forest.ogg`, `ambient/cave.ogg`
- `sfx/capture.ogg`, `sfx/coin.ogg`, `sfx/van-door.ogg`, `sfx/van-engine.ogg`, `sfx/quest-complete.ogg`, `sfx/purchase.ogg`

Until licensed assets are supplied, short Web Audio tones provide interaction feedback only; missing files never throw or block the game.
