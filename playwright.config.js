// @ts-check
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:8000",
    headless: true,
  },
  webServer: {
    command: "npx http-server -p 8000 -c-1",
    port: 8000,
    reuseExistingServer: true,
    timeout: 15000,
  },
});
