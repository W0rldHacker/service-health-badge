/**
 * @typedef {('unknown'|'ok'|'degraded'|'down'|'offline')} HealthStatus
 * @typedef {{ ok?: string; degraded?: string; down?: string; unknown?: string; offline?: string }} Labels
 * @typedef {('dot'|'chip'|'badge')} Variant
 * @typedef {{ endpoint: string|null, interval: number, timeout: number, labels: Labels, variant: Variant, showLatency: boolean }} Cfg
 */

/** @type {Omit<Cfg, 'endpoint'>} */
const DEFAULTS = {
  interval: 10000,
  timeout: 3000,
  labels: { ok: 'OK', degraded: 'Degraded', down: 'Down', unknown: '—', offline: 'Offline' },
  variant: 'badge',
  showLatency: true,
};

/**
 * Миниатюрный Web Component для отображения статуса сервиса по GET /health.
 * Этап E3.2: реактивность атрибутов ↔ свойств, значения по умолчанию, безопасное отражение.
 * @extends {HTMLElement}
 */
export class ServiceHealthBadge extends HTMLElement {
  /** @returns {string[]} */
  static get observedAttributes() {
    return ['endpoint', 'interval', 'timeout', 'labels', 'variant', 'show-latency'];
  }

  constructor() {
    super();
    /** @private */ this._root = this.attachShadow({ mode: 'open' });
    /** @private @type {Cfg} */ this._cfg = {
      ...DEFAULTS,
      endpoint: /** @type {string|null} */ (null),
    };
    /** @private */ this._syncing = false;

    this._root.innerHTML = `
      <style>
        :host { display: inline-block; font: 500 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: var(--health-color-fg, #111827); }
        .wrap { display: inline-flex; align-items: center; gap: .4em; padding: .25em .5em; border-radius: var(--health-radius, .5rem); background: var(--health-chip-bg, transparent); }
        .dot { width: .6em; height: .6em; border-radius: 50%; flex: 0 0 auto; background: var(--health-bg-unknown, #6b7280); }
        .label { white-space: nowrap; }
        .lat { opacity: .7; font-variant-numeric: tabular-nums; }
        .wrap[data-s="ok"]       .dot { background: var(--health-bg-ok, #16a34a); }
        .wrap[data-s="degraded"] .dot { background: var(--health-bg-degraded, #f59e0b); }
        .wrap[data-s="down"]     .dot { background: var(--health-bg-down, #ef4444); }
        .wrap[data-s="offline"]  .dot { background: var(--health-bg-offline, #94a3b8); }
        :host([variant="dot"]) .label, :host([variant="dot"]) .lat { display: none; }
        :host([variant="chip"]) .lat { display: none; }
      </style>
      <div class="wrap" data-s="unknown" role="status" aria-live="polite" title="">
        <span class="dot" aria-hidden="true"></span>
        <span class="label">${DEFAULTS.labels.unknown}</span>
        <span class="lat"></span>
      </div>
    `;
  }

  connectedCallback() {
    if (!this.hasAttribute('variant')) this.setAttribute('variant', DEFAULTS.variant);
    this.#readAttributes();
    this.#renderUnknown();
  }

  /** @param {string} _name @param {string|null} _old @param {string|null} _val */
  attributeChangedCallback(_name, _old, _val) {
    if (this._syncing) return; // отражение из сеттера — пропускаем
    if (!this.isConnected) return;
    this.#readAttributes();
    this.#applyConfigToView();
  }

  /** @returns {string|null} */
  get endpoint() {
    return this._cfg.endpoint;
  }
  /** @param {string|null|undefined} v */
  set endpoint(v) {
    this._cfg.endpoint = v ?? null;
    this.#reflect('endpoint', this._cfg.endpoint);
  }

  /** @returns {number} */
  get interval() {
    return this._cfg.interval;
  }
  /** @param {number} n */
  set interval(n) {
    const val = Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULTS.interval;
    this._cfg.interval = val;
    this.#reflect('interval', String(val));
  }

  /** @returns {number} */
  get timeout() {
    return this._cfg.timeout;
  }
  /** @param {number} n */
  set timeout(n) {
    const val = Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULTS.timeout;
    this._cfg.timeout = val;
    this.#reflect('timeout', String(val));
  }

  /** @returns {Labels} */
  get labels() {
    return this._cfg.labels;
  }
  /** @param {Labels} obj */
  set labels(obj) {
    const merged = { ...DEFAULTS.labels, ...(obj || {}) };
    this._cfg.labels = merged;
    this.#reflect('labels', JSON.stringify(merged));
    this.#applyConfigToView();
  }

  /** @returns {Variant} */
  get variant() {
    return this._cfg.variant;
  }
  /** @param {Variant} v */
  set variant(v) {
    /** @type {Variant} */
    const next = v === 'dot' || v === 'chip' ? v : 'badge';
    this._cfg.variant = next;
    this.#reflect('variant', next);
  }

  /** @returns {boolean} */
  get showLatency() {
    return this._cfg.showLatency;
  }
  /** @param {boolean} b */
  set showLatency(b) {
    const val = !!b;
    this._cfg.showLatency = val;
    if (val) this.#reflectRemove('show-latency');
    else this.#reflect('show-latency', 'false');
    this.#applyConfigToView();
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

    let labels = DEFAULTS.labels;
    const raw = this.getAttribute('labels');
    if (raw) {
      try {
        labels = { ...DEFAULTS.labels, ...JSON.parse(raw) };
      } catch {
        labels = DEFAULTS.labels;
      }
    }
    this._cfg.labels = labels;

    const v = (this.getAttribute('variant') || DEFAULTS.variant).toLowerCase();
    /** @type {Variant} */
    const vv = v === 'dot' || v === 'chip' ? /** @type {Variant} */ (v) : 'badge';
    this._cfg.variant = vv;

    const sl = this.getAttribute('show-latency');
    this._cfg.showLatency = sl === null ? true : sl !== 'false' ? true : false;
  }

  #renderUnknown() {
    const wrap = /** @type {HTMLElement|null} */ (this._root.querySelector('.wrap'));
    const labelEl = this._root.querySelector('.label');
    const latEl = this._root.querySelector('.lat');
    if (!wrap || !labelEl || !latEl) return;

    wrap.setAttribute('data-s', 'unknown');
    labelEl.textContent = this._cfg.labels.unknown || DEFAULTS.labels.unknown;
    latEl.textContent = this._cfg.showLatency ? '' : '';

    wrap.title = [
      `Status: ${labelEl.textContent}`,
      `Interval: ${this._cfg.interval} ms`,
      `Timeout: ${this._cfg.timeout} ms`,
    ].join(' • ');
  }

  #applyConfigToView() {
    this.#renderUnknown();
  }
}

if (!customElements.get('service-health-badge')) {
  customElements.define('service-health-badge', ServiceHealthBadge);
}
