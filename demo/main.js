const hb = document.getElementById('hb');
const $$ = (id) => document.getElementById(id && id.startsWith('#') ? id.slice(1) : id);
const $ = (sel) => document.querySelector(sel);

function log(line) {
  const box = $$('#log');
  const t = new Date().toLocaleTimeString();
  box.innerText = `[${t}] ${line}\n` + box.innerText;
}

hb.addEventListener('health-change', (e) =>
  log(`health-change: ${e.detail.status} (${e.detail.latencyMs ?? '—'} ms)`)
);
hb.addEventListener('health-error', (e) => log(`health-error: ${e.detail.error}`));

function applyFromUI() {
  const endpointEl = $('#endpoint');
  const variantEl = $('#variant');
  const intervalEl = $('#interval');
  const timeoutEl = $('#timeout');
  const thresholdEl = $('#threshold');
  const labelsEl = $('#labels');
  const showLatencyEl = $('#showLatency');

  if (
    !endpointEl ||
    !variantEl ||
    !intervalEl ||
    !timeoutEl ||
    !thresholdEl ||
    !labelsEl ||
    !showLatencyEl
  ) {
    console.error('[demo] Controls not found');
    return;
  }

  hb.setAttribute('endpoint', endpointEl.value.trim());
  hb.setAttribute('variant', variantEl.value);
  hb.setAttribute('interval', String(Math.max(100, +intervalEl.value || 10000)));
  hb.setAttribute('timeout', String(Math.max(100, +timeoutEl.value || 3000)));
  hb.setAttribute('degraded-threshold-ms', String(Math.max(0, +thresholdEl.value || 0)));

  try {
    const labels = JSON.parse(labelsEl.value || '{}');
    hb.setAttribute('labels', JSON.stringify(labels));
  } catch {
    alert('Некорректный JSON в labels');
    return;
  }

  hb.setAttribute('show-latency', showLatencyEl.checked ? 'true' : 'false');
  log('✓ Настройки применены');
}

$$('apply').onclick = applyFromUI;
$$('refresh').onclick = () => hb.refresh && hb.refresh();
$$('clear').onclick = () => ($$('#log').innerText = '');

// Режимы источника
const modeSel = $$('#mode');
const stubControls = $$('#stubControls');
const serverHelp = $$('#serverHelp');
modeSel.onchange = () => {
  const stub = modeSel.value === 'stub';
  stubControls.style.display = stub ? '' : 'none';
  serverHelp.style.display = stub ? 'none' : '';
};
modeSel.onchange();

let stubOn = false;
let savedFetch = null;

function installStub() {
  if (stubOn) return;
  savedFetch = window.fetch;
  const endpoint = () => $$('#endpoint').value.trim();
  window.fetch = async (url, init) => {
    try {
      if (String(url).startsWith(endpoint())) {
        const st = $$('#stubStatus').value;
        const latency = Math.max(0, +$$('#stubLatency').value || 0);
        await new Promise((r) => setTimeout(r, latency));
        if (st === 'down') return new Response('oops', { status: 500 });
        return new Response(JSON.stringify({ status: st, timings: { total_ms: latency || 1 } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        });
      }
      return savedFetch(url, init);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  stubOn = true;
  log('⚙️ Fetch‑стаб: ВКЛ');
}

function uninstallStub() {
  if (!stubOn) return;
  window.fetch = savedFetch;
  savedFetch = null;
  stubOn = false;
  log('⚙️ Fetch‑стаб: ВЫКЛ');
}

$$('stubOn').onclick = installStub;
$$('stubOff').onclick = uninstallStub;

applyFromUI();
