/**
 * @typedef {('unknown'|'ok'|'degraded'|'down'|'offline')} HealthStatus
 * @typedef {{ ok?: string; degraded?: string; down?: string; unknown?: string; offline?: string }} Labels
 * @typedef {('dot'|'chip'|'badge')} Variant
 */

const DEFAULTS = {
  interval: 10000,
  timeout: 3000,
  labels: { ok: 'OK', degraded: 'Degraded', down: 'Down', unknown: '—', offline: 'Offline' },
  variant: 'badge',
  showLatency: true,
};

const DEBOUNCE_MS = 500;

export class ServiceHealthBadge extends HTMLElement {
  static get observedAttributes() {
    return [
      'endpoint',
      'interval',
      'timeout',
      'labels',
      'variant',
      'show-latency',
      'focusable',
      'dev-state',
    ];
  }

  constructor() {
    super();
    /** @private */ this._root = this.attachShadow({ mode: 'open' });
    /** @private */ this._cfg = { ...DEFAULTS, endpoint: null, focusable: false };
    /** @private */ this._syncing = false;

    /** @private */ this._stateActual = /** @type {HealthStatus} */ ('unknown');
    /** @private */ this._stateVisual = /** @type {HealthStatus} */ ('unknown');
    /** @private */ this._latencyMs = /** @type {number|null} */ (null);
    /** @private */ this._debounceT = /** @type {number|undefined} */ (undefined);

    this._root.innerHTML = `
      <style>
        :host { display:inline-block; font: 500 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: var(--health-color-fg, #111827); outline: none; }
        :host(:focus-visible) { outline: 2px solid var(--health-focus-ring, #2563eb); outline-offset: 2px; border-radius: var(--health-radius, .5rem); }

        .wrap { display:inline-flex; align-items:center; gap:.4em; padding:.25em .5em; border-radius: var(--health-radius, .5rem); background: var(--health-chip-bg, transparent); }
        .dot { width:.6em; height:.6em; border-radius:50%; flex:0 0 auto; background: var(--health-bg-unknown, #6b7280); }
        .label { white-space:nowrap; }
        .lat { opacity:.7; font-variant-numeric: tabular-nums; }

        .wrap[data-s="ok"]       .dot { background: var(--health-bg-ok, #16a34a); }
        .wrap[data-s="degraded"] .dot { background: var(--health-bg-degraded, #f59e0b); }
        .wrap[data-s="down"]     .dot { background: var(--health-bg-down, #ef4444); }
        .wrap[data-s="offline"]  .dot { background: var(--health-bg-offline, #94a3b8); }

        :host([variant="dot"]) .label, :host([variant="dot"]) .lat { display:none; }
        :host([variant="chip"]) .lat { display:none; }

        @media (forced-colors: active) {
          .wrap { forced-color-adjust: none; background: Canvas; color: CanvasText; border: 1px solid CanvasText; }
          .wrap .dot { background: CanvasText; }
          .wrap[data-s="ok"] .dot { background: Highlight; }
          .wrap[data-s="down"] .dot { background: GrayText; }
          .wrap[data-s="offline"] .dot { background: GrayText; }
          .wrap[data-s="degraded"] .dot { background: CanvasText; }
          :host(:focus-visible) { outline-color: Highlight; }
        }

        @media (prefers-contrast: more) { .lat { opacity: 1; } }
      </style>
      <div class="wrap" data-s="unknown" role="status" aria-live="polite" aria-atomic="true" title="">
        <span class="dot" aria-hidden="true"></span>
        <span class="label">${DEFAULTS.labels.unknown}</span>
        <span class="lat"></span>
      </div>
    `;
  }

  connectedCallback() {
    if (!this.hasAttribute('variant')) this.setAttribute('variant', DEFAULTS.variant);
    this.#readAttributes();
    this.#applyFocusability();
    this.#renderVisual('unknown');
  }

  attributeChangedCallback(name, _old, _val) {
    if (this._syncing) return;
    if (!this.isConnected) return;
    if (name === 'dev-state') {
      const s = this.getAttribute('dev-state');
      const allowed = ['unknown', 'ok', 'degraded', 'down', 'offline'];
      if (s && allowed.includes(s)) this.setState(/** @type {HealthStatus} */ (s));
      return;
    }
    this.#readAttributes();
    if (name === 'focusable') this.#applyFocusability();
    this.#renderVisual(this._stateVisual);
  }

  get focusable() {
    return !!this._cfg.focusable;
  }
  set focusable(b) {
    this._cfg.focusable = !!b;
    if (this._cfg.focusable) this.#reflect('focusable', '');
    else this.#reflectRemove('focusable');
    this.#applyFocusability();
  }

  get endpoint() {
    return this._cfg.endpoint;
  }
  set endpoint(v) {
    this._cfg.endpoint = v ?? null;
    this.#reflect('endpoint', this._cfg.endpoint);
  }

  get interval() {
    return this._cfg.interval;
  }
  set interval(n) {
    const v = Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULTS.interval;
    this._cfg.interval = v;
    this.#reflect('interval', String(v));
    this.#updateTitle();
  }

  get timeout() {
    return this._cfg.timeout;
  }
  set timeout(n) {
    const v = Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULTS.timeout;
    this._cfg.timeout = v;
    this.#reflect('timeout', String(v));
    this.#updateTitle();
  }

  get labels() {
    return this._cfg.labels;
  }
  set labels(obj) {
    const merged = { ...DEFAULTS.labels, ...(obj || {}) };
    this._cfg.labels = merged;
    this.#reflect('labels', JSON.stringify(merged));
    this.#renderVisual(this._stateVisual);
  }

  get variant() {
    return this._cfg.variant;
  }
  set variant(v) {
    const next = v === 'dot' || v === 'chip' ? v : 'badge';
    this._cfg.variant = next;
    this.#reflect('variant', next);
  }

  get showLatency() {
    return this._cfg.showLatency;
  }
  set showLatency(b) {
    const val = !!b;
    this._cfg.showLatency = val;
    if (val) this.#reflectRemove('show-latency');
    else this.#reflect('show-latency', 'false');
    this.#renderVisual(this._stateVisual);
  }

  setState(/** @type {HealthStatus} */ status, /** @type {number|null} */ latencyMs = null) {
    if (!status) return;
    const allowed = new Set(['unknown', 'ok', 'degraded', 'down', 'offline']);
    const next = /** @type {HealthStatus} */ (allowed.has(status) ? status : 'unknown');
    this._stateActual = next;
    this._latencyMs = Number.isFinite(latencyMs)
      ? Math.round(/** @type {number} */ (latencyMs))
      : null;

    this.dispatchEvent(
      new CustomEvent('health-change', {
        detail: {
          status: this._stateActual,
          latencyMs: this._latencyMs,
          at: new Date().toISOString(),
        },
      })
    );

    if (this._debounceT) {
      clearTimeout(this._debounceT);
      this._debounceT = undefined;
    }
    if (this._stateVisual !== this._stateActual) {
      this._debounceT = /** @type {any} */ (
        setTimeout(() => {
          this._debounceT = undefined;
          this._stateVisual = this._stateActual;
          this.#renderVisual(this._stateVisual);
        }, DEBOUNCE_MS)
      );
    } else {
      this.#renderVisual(this._stateVisual);
    }
  }

  #reflect(name, value) {
    this._syncing = true;
    try {
      if (value == null) this.removeAttribute(name);
      else if (this.getAttribute(name) !== String(value)) this.setAttribute(name, String(value));
    } finally {
      this._syncing = false;
    }
  }
  #reflectRemove(name) {
    this._syncing = true;
    try {
      this.removeAttribute(name);
    } finally {
      this._syncing = false;
    }
  }

  #readAttributes() {
    this._cfg.endpoint = this.getAttribute('endpoint');
    const num = (v, d) => {
      const n = parseInt(v ?? '', 10);
      return Number.isFinite(n) && n > 0 ? n : d;
    };
    this._cfg.interval = num(this.getAttribute('interval'), DEFAULTS.interval);
    this._cfg.timeout = num(this.getAttribute('timeout'), DEFAULTS.timeout);
    const raw = this.getAttribute('labels');
    this._cfg.labels = (() => {
      if (!raw) return DEFAULTS.labels;
      try {
        return { ...DEFAULTS.labels, ...JSON.parse(raw) };
      } catch {
        return DEFAULTS.labels;
      }
    })();
    const v = (this.getAttribute('variant') || DEFAULTS.variant).toLowerCase();
    this._cfg.variant = v === 'dot' || v === 'chip' ? v : 'badge';
    const sl = this.getAttribute('show-latency');
    this._cfg.showLatency = sl === null ? true : sl !== 'false';
    this._cfg.focusable = this.hasAttribute('focusable');
  }

  #applyFocusability() {
    if (this._cfg.focusable) this.setAttribute('tabindex', '0');
    else this.removeAttribute('tabindex');
  }

  #updateTitle() {
    const wrap = this._root.querySelector('.wrap');
    if (!wrap) return;
    const parts = [
      `Status: ${this._cfg.labels[this._stateVisual] || this._cfg.labels.unknown}`,
      `Interval: ${this._cfg.interval} ms`,
      `Timeout: ${this._cfg.timeout} ms`,
    ];
    if (Number.isFinite(this._latencyMs)) parts.push(`Latency: ${this._latencyMs} ms`);
    wrap.setAttribute('title', parts.join(' • '));
  }

  #renderVisual(/** @type {HealthStatus} */ status) {
    const wrap = this._root.querySelector('.wrap');
    const labelEl = this._root.querySelector('.label');
    const latEl = this._root.querySelector('.lat');
    if (!wrap || !labelEl || !latEl) return;

    requestAnimationFrame(() => {
      wrap.setAttribute('data-s', status);
      labelEl.textContent = this._cfg.labels[status] || this._cfg.labels.unknown;
      latEl.textContent =
        this._cfg.showLatency && Number.isFinite(this._latencyMs) ? `${this._latencyMs} ms` : '';
      this.#updateTitle();
    });
  }
}

if (!customElements.get('service-health-badge'))
  customElements.define('service-health-badge', ServiceHealthBadge);
