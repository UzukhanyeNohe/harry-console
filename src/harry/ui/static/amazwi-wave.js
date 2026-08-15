/* ==========================================================================
   <amazwi-wave> — Harry's signature element.
   Framework-free custom element: works in the plain-HTML projector page and
   inside the React PWA without a second implementation.

   Usage
   -----
     <script type="module" src="./amazwi-wave.js"></script>
     <amazwi-wave state="listening"></amazwi-wave>
     <amazwi-wave state="bridging" agent="Claude Code" caption></amazwi-wave>

   Attributes
   ----------
     state    one of: idle listening thinking bridging working speaking
                      approval done error          (default: idle)
     agent    label filler for `bridging`          (default: CLOUD)
     task     label filler for `working`           (default: TASK)
     bars     odd number >= 5                      (default: 7)
     caption  present = render the label under the bars

   Properties / methods
   --------------------
     el.level = 0..1        feed mic or TTS amplitude (listening/speaking)
     el.setState('thinking')
     el.attachStream(mediaStream)   convenience: drives level from a mic stream
     el.detachStream()

   Events
   ------
     'amazwi-state'  { detail: { from, to } }

   Tokens come from amazwi.css via CSS custom properties, which pierce the
   shadow boundary — so theming stays in one file.
   ========================================================================== */

const PROFILE = [
  { base: 0.94, react: 0.10, max: 1.00 },
  { base: 0.66, react: 0.35, max: 0.80 },
  { base: 0.28, react: 0.85, max: 0.58 },
  { base: 0.24, react: 1.00, max: 0.56 },
  { base: 0.30, react: 0.85, max: 0.58 },
  { base: 0.66, react: 0.35, max: 0.80 },
  { base: 0.94, react: 0.10, max: 1.00 }
];

const STATES = {
  idle:      { label: 'STANDING BY',       priority: 0 },
  listening: { label: 'LISTENING',         priority: 4, amplitude: true },
  thinking:  { label: 'THINKING LOCALLY',  priority: 3 },
  bridging:  { label: 'USING {agent}',     priority: 3 },
  working:   { label: 'RUNNING {task}',    priority: 2 },
  speaking:  { label: 'SPEAKING',          priority: 4, amplitude: true },
  approval:  { label: 'APPROVAL REQUIRED', priority: 9 },
  done:      { label: 'TASK COMPLETE',     priority: 5, autoRevert: 1600, revertTo: 'idle' },
  error:     { label: 'FAILED',            priority: 8 }
};

const ATTACK = 0.5;   // rise fast, so speech feels responsive
const RELEASE = 0.12; // fall slow, so it never strobes

/* Resample the canonical 7-bar H shape to any odd bar count, preserving the
   letterform: tall uprights, short crossbar, inner bars always capped lower. */
function buildProfile(n) {
  if (n === PROFILE.length) return PROFILE.slice();
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * (PROFILE.length - 1);
    const a = PROFILE[Math.floor(t)];
    const b = PROFILE[Math.min(PROFILE.length - 1, Math.ceil(t))];
    const f = t - Math.floor(t);
    out.push({
      base: a.base + (b.base - a.base) * f,
      react: a.react + (b.react - a.react) * f,
      max: a.max + (b.max - a.max) * f
    });
  }
  return out;
}

const SHEET = `
  :host { display: block; }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: var(--amz-s4, 20px); }
  .wave {
    display: flex; align-items: center; justify-content: center;
    gap: var(--amz-wave-gap, 14px);
    height: var(--amz-wave-height, 220px);
    filter: drop-shadow(0 0 var(--amz-wave-glow, 26px) rgba(185,255,60,.35));
    transition: filter 320ms cubic-bezier(.22,1,.36,1);
  }
  .wave i {
    display: block;
    width: var(--amz-wave-bar, 18px);
    height: calc(var(--h, .5) * 100%);
    border-radius: 100px;
    background: var(--amz-wave-color, #B9FF3C);
    transform-origin: center;
    transition: height 90ms linear, background 320ms cubic-bezier(.22,1,.36,1), opacity 320ms ease;
  }
  .cap {
    font-family: var(--amz-mono, 'JetBrains Mono', monospace);
    font-size: var(--amz-caption-size, 11px);
    letter-spacing: .34em; text-transform: uppercase;
    color: var(--amz-muted, #93A681); text-align: center;
  }
  .cap b { color: var(--amz-wave-color, #B9FF3C); font-weight: 400; }

  :host([state="idle"])      { --amz-wave-color: var(--amz-lime-dim, #7CB82F); --amz-wave-glow: 10px; }
  :host([state="thinking"])  { --amz-wave-color: var(--amz-lime, #B9FF3C); }
  :host([state="bridging"])  { --amz-wave-color: var(--amz-pale, #E9FFB0); }
  :host([state="working"])   { --amz-wave-color: var(--amz-lime-dim, #7CB82F); }
  :host([state="approval"])  { --amz-wave-color: var(--amz-pale, #E9FFB0); --amz-wave-glow: 44px; }
  :host([state="done"])      { --amz-wave-color: var(--amz-lime, #B9FF3C); --amz-wave-glow: 50px; }
  :host([state="error"])     { --amz-wave-color: var(--amz-faint, #4C5C3F); --amz-wave-glow: 0px; }

  :host([state="idle"]) i      { animation: breathe 4.2s cubic-bezier(.22,1,.36,1) infinite var(--d,0s); }
  :host([state="thinking"]) i  { animation: pulse 1.9s ease-in-out infinite var(--d,0s); }
  :host([state="bridging"]) i  { animation: ripple 1.05s ease-in-out infinite var(--dr,0s); }
  :host([state="working"]) i   { animation: scan 1.5s ease-in-out infinite var(--dr,0s); }
  :host([state="approval"]) i  { animation: hold 1.5s steps(1,end) infinite; }
  :host([state="done"]) i      { animation: settle 1.6s cubic-bezier(.16,1,.3,1) 1 both var(--d,0s); }
  :host([state="error"]) i     { height: 6px !important; opacity: .8; transition: height 420ms cubic-bezier(.22,1,.36,1); }

  @keyframes breathe { 0%,100% { transform: scaleY(.82); opacity:.55 } 50% { transform: scaleY(1); opacity:.8 } }
  @keyframes pulse   { 0%,100% { transform: scaleY(.7) }  50% { transform: scaleY(1.18) } }
  @keyframes ripple  { 0%,100% { transform: scaleY(.6); opacity:.7 } 45% { transform: scaleY(1.3); opacity:1 } }
  @keyframes scan    { 0%,70%,100% { transform: scaleY(.75); opacity:.5 } 20% { transform: scaleY(1.2); opacity:1 } }
  @keyframes hold    { 0%,55% { opacity:1 } 56%,100% { opacity:.28 } }
  @keyframes settle  { 0% { transform: scaleY(1.35) } 60% { transform: scaleY(.9) } 100% { transform: scaleY(1) } }

  @media (prefers-reduced-motion: reduce) {
    .wave i { animation: none !important; transition: height 220ms linear, background 220ms linear; }
  }
`;

class AmazwiWave extends HTMLElement {
  static get observedAttributes() { return ['state', 'agent', 'task', 'bars', 'caption']; }

  constructor() {
    super();
    this._level = 0;
    this._smooth = 0;
    this._raf = null;
    this._revert = null;
    this._audio = null;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>${SHEET}</style>
      <div class="wrap" part="wrap">
        <div class="wave" part="wave" role="status" aria-live="polite"></div>
        <div class="cap" part="caption" hidden></div>
      </div>`;
    this._waveEl = this.shadowRoot.querySelector('.wave');
    this._capEl = this.shadowRoot.querySelector('.cap');
  }

  connectedCallback() {
    if (!this.hasAttribute('state')) this.setAttribute('state', 'idle');
    this._build();
    this._render();
  }

  disconnectedCallback() {
    this._stopLoop();
    this.detachStream();
    if (this._revert) clearTimeout(this._revert);
  }

  attributeChangedCallback(name, oldV, newV) {
    if (oldV === newV) return;
    if (name === 'bars') this._build();
    if (name === 'state') {
      this._onStateChange(oldV, newV);
      this.dispatchEvent(new CustomEvent('amazwi-state', {
        bubbles: true, composed: true, detail: { from: oldV, to: newV }
      }));
    }
    this._render();
  }

  /* ---------------- public API ---------------- */

  get state() { return this.getAttribute('state') || 'idle'; }
  set state(v) { this.setState(v); }

  setState(next) {
    if (!STATES[next]) {
      console.warn(`[amazwi-wave] unknown state "${next}" — ignored`);
      return;
    }
    this.setAttribute('state', next);
  }

  get level() { return this._level; }
  set level(v) {
    const n = Number(v);
    this._level = Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
  }

  /** Drive the bars from a live microphone / audio stream. */
  attachStream(stream) {
    this.detachStream();
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      const ctx = new Ctx();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.6;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      this._audio = { ctx, analyser, buf, src };
      return true;
    } catch (e) {
      console.warn('[amazwi-wave] could not attach stream:', e);
      return false;
    }
  }

  detachStream() {
    if (!this._audio) return;
    try { this._audio.src.disconnect(); this._audio.ctx.close(); } catch (e) { /* already closed */ }
    this._audio = null;
  }

  /* ---------------- internals ---------------- */

  _build() {
    let n = parseInt(this.getAttribute('bars') || '7', 10);
    if (!Number.isFinite(n) || n < 5) n = 7;
    if (n % 2 === 0) n += 1; // the H needs a centre bar
    this._profile = buildProfile(n);
    this._waveEl.innerHTML = this._profile.map((p, i) => {
      const centre = (this._profile.length - 1) / 2;
      const d = (Math.abs(i - centre) * 0.14).toFixed(2);   // symmetric, from centre out
      const dr = (i * 0.07).toFixed(2);                     // sequential, left to right
      return `<i style="--h:${p.base};--d:${d}s;--dr:${dr}s"></i>`;
    }).join('');
    this._bars = Array.from(this._waveEl.querySelectorAll('i'));
  }

  _onStateChange(from, to) {
    if (this._revert) { clearTimeout(this._revert); this._revert = null; }

    const cfg = STATES[to] || STATES.idle;

    // amplitude states run a rAF loop; everything else is pure CSS
    if (cfg.amplitude) this._startLoop();
    else { this._stopLoop(); this._resetHeights(); }

    if (cfg.autoRevert) {
      this._revert = setTimeout(() => this.setState(cfg.revertTo || 'idle'), cfg.autoRevert);
    }
  }

  _resetHeights() {
    this._smooth = 0;
    if (!this._bars) return;
    this._bars.forEach((b, i) => b.style.setProperty('--h', this._profile[i].base));
  }

  _startLoop() {
    if (this._raf) return;
    const tick = () => {
      let target = this._level;

      if (this._audio) {
        const { analyser, buf } = this._audio;
        analyser.getByteFrequencyData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i];
        target = Math.min(1, (sum / buf.length / 255) * 2.4); // voice sits low in the range
      }

      const k = target > this._smooth ? ATTACK : RELEASE;
      this._smooth += (target - this._smooth) * k;

      this._bars.forEach((bar, i) => {
        const p = this._profile[i];
        const h = Math.min(p.max, p.base + p.react * this._smooth * 0.55);
        bar.style.setProperty('--h', h.toFixed(3));
      });

      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  _stopLoop() {
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
  }

  _label() {
    const cfg = STATES[this.state] || STATES.idle;
    return cfg.label
      .replace('{agent}', (this.getAttribute('agent') || 'CLOUD').toUpperCase())
      .replace('{task}', (this.getAttribute('task') || 'TASK').toUpperCase());
  }

  _render() {
    const text = this._label();
    this._waveEl.setAttribute('aria-label', `Harry: ${text.toLowerCase()}`);
    const showCaption = this.hasAttribute('caption');
    this._capEl.hidden = !showCaption;
    if (showCaption) this._capEl.innerHTML = `AMAZWI · <b>${text}</b>`;
  }
}

if (!customElements.get('amazwi-wave')) {
  customElements.define('amazwi-wave', AmazwiWave);
}

export { AmazwiWave, STATES, PROFILE };
export default AmazwiWave;
