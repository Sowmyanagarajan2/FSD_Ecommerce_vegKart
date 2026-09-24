import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: false,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node ../backend/server.js',
      cwd: __dirname,
      url: 'http://127.0.0.1:5000',
      timeout: 120000,
      reuseExistingServer: true,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1',
      cwd: __dirname,
      url: 'http://127.0.0.1:5173',
      timeout: 120000,
      reuseExistingServer: true,
    },
  ],
});
