import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'e2e',
  webServer: { command: 'npm run preview', port: 8000, reuseExistingServer: true },
  use: { headless: true },
});
