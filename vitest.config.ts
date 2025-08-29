import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.{test,spec}.?(c|m)[tj]s?(x)'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.js'],
      exclude: ['playwright.config.ts', 'demo/**', 'mock/**', 'scripts/**', 'types/**', 'dist/**'],
      thresholds: { lines: 0.9, branches: 0.8, functions: 0.8, statements: 0.9 },
    },
    setupFiles: ['tests/setup.ts', 'tests/_setupRAF.ts'],
  },
});
