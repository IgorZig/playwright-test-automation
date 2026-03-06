// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  retries: 0,

  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },

  reporter: [
    ['html'],
    ['allure-playwright']
  ],

  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'on',
    trace: 'on',
  },
});

