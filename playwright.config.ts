import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/vrt",
  snapshotPathTemplate:
    "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",

  retries: process.env.CI ? 0 : 1,
  fullyParallel: !process.env.CI,
  workers: process.env.CI ? 1 : 2,

  reporter: [
    [process.env.CI ? "github" : "list"],
    ["html", { open: "on-failure" }],
  ],

  use: {
    baseURL: "http://localhost:6006",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  webServer: {
    command: "npx http-server storybook-static --port 6006 --silent",
    port: 6006,
    reuseExistingServer: !process.env.CI,
  },
});
