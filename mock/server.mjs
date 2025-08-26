import { createServer, cors } from '@worldhacker/starpath'

const HOST = process.env.MOCK_HOST ?? '127.0.0.1';
const PORT = Number(process.env.MOCK_PORT ?? 0);
const DEFAULT_STATUS = (process.env.HEALTH_STATUS ?? 'ok').toLowerCase();
const DEFAULT_LAT_MS = Number(process.env.HEALTH_LATENCY_MS ?? 0);

const app = createServer({
  defaultHeaders: { 'Cache-Control': 'no-store' }
});

app.use(cors({ origin: '*' }));

const sleep = (ms) => (ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve());

app.route('GET', '/health', async (ctx) => {
  const q = ctx.query;
  const status = (q.get('status') ?? DEFAULT_STATUS).toLowerCase();
  const latencyMs = Number(q.get('latency') ?? DEFAULT_LAT_MS);

  await sleep(latencyMs);

  const now = new Date().toISOString();
  const uptimeSec = Math.round(process.uptime());

  /** @type {{ status: 'ok'|'degraded'|'down', now: string, uptimeSec: number, latencyMs: number }} */
  const payload = {
    status: status === 'down' ? 'down' : status === 'degraded' ? 'degraded' : 'ok',
    now,
    uptimeSec,
    latencyMs
  };

  const http = status === 'down' ? 503 : 200;

  await ctx.respond({
    status: http,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload)
  });
});

app.route('GET', '/', (ctx) =>
  ctx.respond({
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    body:
      'Mock /health is running.\n' +
      `Try: /health?status=ok|degraded|down&latency=250\n` +
      `Current defaults: status=${DEFAULT_STATUS}, latency=${DEFAULT_LAT_MS}ms\n`
  })
);

app.listen({
  host: HOST,
  port: PORT,
  onListen: ({ host, port }) => console.log(`[mock] listening on http://${host}:${port} (defaults: status=${DEFAULT_STATUS}, latency=${DEFAULT_LAT_MS}ms)`),
  onError: (e) => {
    console.error('[mock] failed to start:', e);
    process.exit(1);
  }
});
