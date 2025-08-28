import process from 'node:process';
import { build } from 'esbuild';

const prod = process.env.NODE_ENV !== 'development';
await build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/service-health-badge.js',
  bundle: true,
  format: 'esm',
  target: ['es2019'],
  minify: true,
  sourcemap: true,
  legalComments: 'none',
  define: {
    __DEV__: String(!prod),
    'process.env.NODE_ENV': JSON.stringify(prod ? 'production' : 'development'),
  },
  banner: { js: '/* service-health-badge (c) 2025 */' },
});
