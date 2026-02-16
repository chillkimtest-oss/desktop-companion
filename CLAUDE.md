# Desktop Companion — Chill the Ice Slime

A transparent desktop pet that lives on your screen. Built with Tauri v2.

## What to Build

A minimal desktop pet POC with:

1. **Transparent, always-on-top window** — no background, click-through except on the pet itself
2. **Sprite rendering** — load PNG sprites from `assets/sprites/`, render at 128x128
3. **Behavior state machine** — the pet cycles through states autonomously:
   - idle (default, blinks occasionally via idle-blink)
   - walking (moves across screen edge, left/right)
   - sleeping (after 5 min idle, ZZZ)
   - typing (when user is actively typing — detect keyboard activity)
   - thinking (random, short duration)
   - eating (random, short duration)
   - happy/excited (random reaction)
   - stargazing (nighttime only — check system clock)
4. **Screen edge walking** — pet walks along bottom edge of screen, pauses, does activities
5. **Click interaction** — clicking pet cycles through reactions (love, cool, surprised, waving)
6. **System tray** — right-click for menu: quit, toggle states, about

## Tech Stack

- **Tauri v2** (Rust backend + web frontend)
- **Frontend:** vanilla HTML/CSS/JS (no framework needed — it's one sprite on screen)
- **Sprites:** PNGs in `assets/sprites/` (128x128 each, transparent background)
- Sprite files: `sprite-idle-128.png`, `sprite-idle-blink-128.png`, `sprite-happy-128.png`, etc.

## Key Requirements

- Window must be transparent and always-on-top
- Window must be click-through (except where the sprite pixels are)
- Pet should feel alive — random state changes, smooth transitions
- Minimal resource usage — this runs 24/7 in background
- Cross-platform (Linux + Windows + macOS via Tauri)

## What NOT to Build

- No LLM integration (that's phase 2)
- No settings UI
- No auto-update
- No sound
- Keep it simple — this is a validation POC

## Sprite Files Available

```
sprite-idle-128.png
sprite-idle-blink-128.png
sprite-happy-128.png
sprite-sad-128.png
sprite-angry-128.png
sprite-love-128.png
sprite-cool-128.png
sprite-surprised-128.png
sprite-excited-128.png
sprite-thinking-128.png
sprite-sleeping-128.png
sprite-typing-128.png
sprite-eating-128.png
sprite-waving-128.png
sprite-walking-128.png
sprite-stargazing-128.png
```
