import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: 'tests/api',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ["html", { open: 'never' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4000/api',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
  projects: [
    {
      name: 'api-tests',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run start:test',
    url: 'http://127.0.0.1:4000/api/health', // Check the health endpoint
    reuseExistingServer: !process.env.CI,
    timeout: 30 * 1000, // Increased timeout to 3 minutes
    stderr: 'pipe', // Show server errors
    stdout: 'pipe', // Show server output
  },
});