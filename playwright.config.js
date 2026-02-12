import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    viewport: { width: 800, height: 600 },
    screenshot: 'only-on-failure',
  },
});
