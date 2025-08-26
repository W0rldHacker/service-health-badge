/**
 * @typedef {('unknown'|'ok'|'degraded'|'down'|'offline')} HealthStatus
 * @typedef {{ ok?: string; degraded?: string; down?: string; unknown?: string; offline?: string }} Labels
 * @typedef {('dot'|'chip'|'badge')} Variant
 */

const DEFAULTS = {
  labels: { ok: 'OK', degraded: 'Degraded', down: 'Down', unknown: '—', offline: 'Offline' },
  variant: 'badge',
};

/**
 * Миниатюрный Web Component для отображения статуса сервиса по GET /health.
 * @extends {HTMLElement}
 */
export class ServiceHealthBadge extends HTMLElement {
  /** @returns {string[]} */
  static get observedAttributes() {
    return ['labels', 'variant', 'show-latency'];
  }

  constructor() {
    super();
    /** @private */ this._root = this.attachShadow({ mode: 'open' });
    this._root.innerHTML = `
      <style>
        :host { display: inline-block; font: 500 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: var(--health-color-fg, #111827); }
        .wrap { display: inline-flex; align-items: center; gap: .4em; padding: .25em .5em; border-radius: var(--health-radius, .5rem); background: var(--health-chip-bg, transparent); }
        .dot { width: .6em; height: .6em; border-radius: 50%; flex: 0 0 auto; background: var(--health-bg-unknown, #6b7280); }
        .label { white-space: nowrap; }
        .lat { opacity: .7; font-variant-numeric: tabular-nums; }
        /* Цвета по состояниям */
        .wrap[data-s="ok"]       .dot { background: var(--health-bg-ok, #16a34a); }
        .wrap[data-s="degraded"] .dot { background: var(--health-bg-degraded, #f59e0b); }
        .wrap[data-s="down"]     .dot { background: var(--health-bg-down, #ef4444); }
        .wrap[data-s="offline"]  .dot { background: var(--health-bg-offline, #94a3b8); }
        /* Варианты отображения */
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
    this.#renderUnknown();
  }

  /** @param {string} name @param {string|null} _old @param {string|null} _val */
  attributeChangedCallback(name, _old, _val) {
    if (!this.isConnected) return;
    switch (name) {
      case 'labels':
      case 'variant':
      case 'show-latency':
        this.#applyVariantAndLabels();
        break;
    }
  }

  /** @returns {Labels} */
  get labels() {
    try {
      return { ...DEFAULTS.labels, ...JSON.parse(this.getAttribute('labels') || '{}') };
    } catch {
      return { ...DEFAULTS.labels };
    }
  }

  /** @returns {Variant} */
  get variant() {
    const v = (this.getAttribute('variant') || DEFAULTS.variant).toLowerCase();
    return /** @type {Variant} */ (v === 'dot' || v === 'chip' ? v : 'badge');
  }

  /** @returns {boolean} */
  get showLatency() {
    return this.getAttribute('show-latency') !== 'false';
  }

  #renderUnknown() {
    const wrap = this._root.querySelector('.wrap');
    const labelEl = this._root.querySelector('.label');
    const latEl = this._root.querySelector('.lat');
    if (wrap && labelEl && latEl) {
      wrap.setAttribute('data-s', 'unknown');
      labelEl.textContent = this.labels.unknown || DEFAULTS.labels.unknown;
      latEl.textContent = this.showLatency ? '' : '';
      this.#applyVariantAndLabels();
    }
  }

  #applyVariantAndLabels() {
    const labelEl = this._root.querySelector('.label');
    const latEl = this._root.querySelector('.lat');
    if (labelEl) labelEl.textContent = this.labels.unknown || DEFAULTS.labels.unknown;
    if (latEl) latEl.textContent = '';
  }
}

if (!customElements.get('service-health-badge')) {
  customElements.define('service-health-badge', ServiceHealthBadge);
}
