import { defineConfig } from '@playwright/test';
export default defineConfig({
  webServer: { command: 'npm run preview', port: 8000, reuseExistingServer: true },
  use: { headless: true },
});
