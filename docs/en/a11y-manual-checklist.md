# A11y: manual checklist (SR smoke)

[Русская версия](../a11y-manual-checklist.md)

## NVDA (Windows)

1. Open the demo. With default settings the component is not focusable; with `focusable` it appears in tab order.
2. When focused, NVDA should announce role `status` and current localized label.
3. Switch states (buttons or `dev-state`). Announcements should come after ~500 ms (debounced), one per change.

## VoiceOver (macOS)

1. Navigate via `VO + arrows` / `Tab` (with `focusable`) — role `status` and label should be read.
2. On state change there is a single announcement without stutter.

## General

- Text contrast ≥ AA (`--health-color-fg`).
- In `dot`, rely on both color and the textual announcement — color is not the only channel.
- Keyboard: add `focusable` to opt‑in keyboard focus and visible ring (`--health-focus-ring`).
