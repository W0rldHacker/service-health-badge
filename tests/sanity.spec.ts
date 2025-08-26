import '../src/index.js';
import { describe, it, expect } from 'vitest';

describe('<service-health-badge> bootstrap', () => {
  it('registers custom element', () => {
    expect(customElements.get('service-health-badge')).toBeTypeOf('function');
  });

  it('can be instantiated', () => {
    const el = document.createElement('service-health-badge');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });
});
