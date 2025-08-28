export async function measureTTIOnce() {
  const t0 = performance.now();
  await customElements.whenDefined('service-health-badge');
  const el = document.createElement('service-health-badge');
  el.setAttribute('variant', 'dot');
  document.querySelector('#perf-area').appendChild(el);
  return new Promise((resolve) => requestAnimationFrame(() => resolve(performance.now() - t0)));
}
