# AMAZWI — Harry's visual identity

**Amazwi** is isiXhosa for *voices*. It is the identity for every surface Harry
presents: the projector HUD, the phone PWA, the build console, and any future
client.

This document is the contract. `config/brand.json` is the machine-readable
source of truth. **No file in this repository may hard-code a hex value, a font
name, or a state colour.** If you need a new token, add it to `brand.json` and
regenerate — do not invent one locally.

---

## 1. Files

| File | Destination in repo | Purpose |
|---|---|---|
| `brand.json` | `config/brand.json` | Machine-readable tokens. Source of truth. |
| `amazwi.css` | `src/harry/ui/static/amazwi.css` | CSS custom properties + waveform styles. Load once per surface. |
| `amazwi-wave.js` | `src/harry/ui/static/amazwi-wave.js` | The `<amazwi-wave>` custom element. |
| `AMAZWI.md` | `docs/design/AMAZWI.md` | This document. |

---

## 2. The one rule that matters

> **The H must remain legible at every amplitude.**

The waveform is seven bars arranged as the letter **H** — two tall uprights on
each side, a short crossbar in the middle. When audio drives the bars, the inner
bars grow but are **capped below the outer bars** (`profile[].max` in
`brand.json`). The mark reacts; it never dissolves into a generic equaliser.

If you change the bar count, use the resampling function already in
`amazwi-wave.js`. Seven is canonical. Even numbers are silently corrected —
the H needs a centre bar.

---

## 3. Colour carries meaning

This is not decoration. It is how the user reads system state from across a
dark room without reading a word.

| Colour | Token | Means |
|---|---|---|
| **Neon lime** | `--amz-lime` | Local. Alive. Nothing has left this machine. |
| **Pale** | `--amz-pale` | Attention, **or data in flight to a cloud bridge**. |
| **Faint** | `--amz-faint` | Dormant or failed. |

Two consequences worth stating plainly:

1. **Pale is a privacy signal.** When Harry escalates to Codex CLI or Claude
   Code, the waveform goes pale. You always know, at a glance, when something
   left the laptop. This is the visual counterpart to the audit log.
2. **The absence of lime is the alarm.** Error state collapses the bars to a
   dim flat line rather than turning red. In a system where lime means alive,
   losing it reads as failure instantly — and the palette stays disciplined.

**Never introduce a third hue for state.** No red, no amber, no blue.

---

## 4. State machine

Labels match the projector strings in roadmap Phase 12 exactly.

| State | Label | Colour | Motion | Priority | Fires when |
|---|---|---|---|---|---|
| `idle` | STANDING BY | lime-dim | slow breathe | 0 | Wake-word listener up, nothing running |
| `working` | RUNNING {task} | lime-dim | scan L→R | 2 | A deterministic skill executes (tests, git, files) |
| `thinking` | THINKING LOCALLY | lime | symmetric pulse | 3 | Local Ollama model reasoning |
| `bridging` | USING {agent} | **pale** | fast ripple | 3 | Codex CLI or Claude Code working |
| `listening` | LISTENING | lime | **mic amplitude** | 4 | Mic open, VAD active |
| `speaking` | SPEAKING | lime | **TTS amplitude** | 4 | Kokoro talking |
| `done` | TASK COMPLETE | lime | flash + settle | 5 | Task finished — auto-reverts to `idle` after 1.6s |
| `error` | FAILED | faint | flat line | 8 | Anything failed |
| `approval` | APPROVAL REQUIRED | **pale** | frozen + blink | **9** | Harry is blocked on you |

### Precedence

When two states race, **higher priority wins**. `approval` beats everything —
if Harry is blocked on a human decision, nothing may visually override that.
Implement the resolution in Harry Core, not in the UI: the UI renders one
state, the core decides which.

### Transitions

- All state changes crossfade over `--amz-crossfade` (320ms). Never cut.
- `done` is the only self-clearing state.
- `error` persists until explicitly cleared — it must not time out silently.

---

## 5. Using the component

```html
<link rel="stylesheet" href="./amazwi.css">
<script type="module" src="./amazwi-wave.js"></script>

<div class="amz-root amz-surface-projector">
  <amazwi-wave id="wave" state="idle" caption></amazwi-wave>
</div>
```

```js
const wave = document.getElementById('wave');

wave.setState('thinking');

// cloud escalation — pale, and the label names the agent
wave.setAttribute('agent', 'Claude Code');
wave.setState('bridging');

// deterministic skill
wave.setAttribute('task', 'pytest');
wave.setState('working');

// amplitude, fed manually…
wave.setState('listening');
wave.level = 0.62;                       // 0..1

// …or straight from the mic
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
wave.attachStream(stream);               // drives level automatically
// wave.detachStream() when the turn ends

wave.addEventListener('amazwi-state', e => console.log(e.detail)); // { from, to }
```

### In React (the PWA)

The element is framework-free on purpose — one implementation, both surfaces.

```jsx
import { useEffect, useRef } from 'react';
import './amazwi-wave.js';

export function HarryStatus({ state, agent, level }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.level = level ?? 0; }, [level]);
  return (
    <div className="amz-root amz-surface-pwa">
      <amazwi-wave ref={ref} state={state} agent={agent} caption />
    </div>
  );
}
```

Set `level` through the ref (it is a property, not an attribute). `state` and
`agent` are plain attributes and work as JSX props.

### Surface presets

Put one class on the wrapper — it sets bar width, gap, height and glow:

`amz-surface-projector` · `amz-surface-pwa` · `amz-surface-console`

---

## 6. Surface rules

**Projector HUD** — read from 3 metres.
One idea on screen at a time. Never a dashboard. No hover, no scroll, no small
text, nothing interactive. State must be readable from colour and motion alone;
the label only confirms what you already know.

**Phone PWA** — read from 30cm, driven by a thumb.
The waveform shrinks to a status strip; it does not dominate. Primary actions
live in the lower third. **Approval cards are the most important surface in the
app** — one tap from anywhere. Assume the tailnet drops; design the offline
state deliberately.

**Build console** — the only surface where scroll, parallax and long prose
belong. It is a document about Harry, not Harry itself.

---

## 7. Accessibility floor

Non-negotiable, on every surface:

- `prefers-reduced-motion` respected — bars hold a static profile, state is
  carried by colour and label. Already handled in `amazwi.css` and the
  component's shadow styles.
- The waveform carries `role="status"` and an `aria-label` that updates with
  state, so a screen reader announces "Harry: approval required".
- Visible keyboard focus (`--amz-lime`, 2px, 3px offset).
- Never rely on colour alone — the caption always states the condition in
  words.

---

## 8. Don't

- Don't add a third state hue.
- Don't let inner bars exceed outer bars — the H dies.
- Don't animate the waveform on the projector while `approval` is active. The
  freeze *is* the signal.
- Don't reuse the console's scroll-driven layout for a live surface.
- Don't clone a copyrighted fictional assistant's voice or visual identity.
  Amazwi is original, and stays that way.
- Don't hard-code tokens. Ever. `brand.json` or nothing.
