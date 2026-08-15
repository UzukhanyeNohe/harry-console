# AGENTS.md — harry-console

The AMAZWI build console: a static, installable PWA that documents the HARRY
architecture roadmap. It is a document *about* Harry, not Harry itself.

## Design authority

**All UI derives from `config/brand.json` — no hard-coded hex, fonts or state colours anywhere.**

`docs/design/AMAZWI.md` is the contract; `config/brand.json` is the
machine-readable source of truth. If a new token is needed, add it to
`brand.json` and regenerate — never invent one locally.

Generated artifacts, which must not be edited directly:

| File | Generated from |
|---|---|
| `src/harry/ui/static/amazwi.css` | `config/brand.json` |
| `src/harry/ui/static/amazwi-wave.js` | `config/brand.json` (`profile[]`) |

## Repository status

These identity files are staged here for versioning until the Harry Core
repository exists; their canonical home is Harry Core, per section 7 of the
architecture roadmap:

```text
config/brand.json
src/harry/ui/static/amazwi.css
src/harry/ui/static/amazwi-wave.js
docs/design/AMAZWI.md
```

### Known gaps in token coverage

The generated files are consistent with `brand.json` — every colour, type,
radius, space and motion token matches, as do the waveform profile, the
smoothing constants and all nine state labels and priorities. Three values in
the generated files have no `brand.json` source and should be added there
rather than edited locally:

- waveform **heights** — `--amz-wave-height` and the per-surface heights
  (projector `46vh`, pwa `64px`, console `220px`); `brand.json` defines
  `barWidth` and `gap` per surface but not height;
- the glow colour `rgba(185,255,60,.35)`, hard-coded in the CSS `drop-shadow`
  and again in the component's shadow styles, while `brand.json` carries
  `waveform.glow` as a complete drop-shadow string;
- the `var(--amz-*, #hex)` fallbacks inside `amazwi-wave.js`.

## Deployment

`index.html`, `manifest.webmanifest`, `sw.js` and `icons/` sit at the root and
are served as-is. Deployed to Vercel from `main` (headers in `vercel.json`) and
to GitHub Pages from `main` / root. Bump the `sw.js` cache name on each release
so clients pick up the new build.

The stylesheet carries a responsive layer — safe-area insets for the installed
PWA, `min-width:0` on grid children so the pre-formatted command blocks cannot
blow the page out sideways, and breakpoints at 900/700/480/360. Rebuilt
`index.html` uploads have repeatedly dropped it; re-apply and verify no
horizontal overflow at 320–1920px before shipping.
