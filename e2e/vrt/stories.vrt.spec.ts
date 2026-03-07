import { expect, test } from "@playwright/test";

type StoryIndexEntry = {
  id: string;
  title: string;
  name: string;
  type: "story" | "docs";
};

type StoryIndex = {
  v: number;
  entries: Record<string, StoryIndexEntry>;
};

async function fetchStoryEntries(
  baseURL: string
): Promise<StoryIndexEntry[]> {
  const res = await fetch(`${baseURL}/index.json`);
  const index: StoryIndex = await res.json();

  return Object.values(index.entries).filter(
    (entry) => entry.type === "story" && entry.title.startsWith("VRT/")
  );
}

function storyLabel(entry: StoryIndexEntry): string {
  const component = entry.title.replace(/^.*\//, "");
  const name = entry.name.replace(/\s+/g, "");
  return `${component}-${name}`;
}

const COLOR_MODES = ["light", "dark"] as const;

test.describe("Visual Regression Tests", () => {
  let stories: StoryIndexEntry[] = [];

  test.beforeAll(async ({}, testInfo) => {
    const baseURL = testInfo.project.use.baseURL ?? "http://localhost:6006";
    stories = await fetchStoryEntries(baseURL);
  });

  for (const colorMode of COLOR_MODES) {
    test(`screenshot all stories (${colorMode})`, async ({ page }, testInfo) => {
      testInfo.setTimeout(120_000);
      test.skip(stories.length === 0, "No stories found in index.json");

      for (const story of stories) {
        const label = storyLabel(story);
        const url = `/iframe.html?id=${story.id}&viewMode=story&globals=theme:${colorMode}`;

        await page.goto(url);
        await page.waitForLoadState("networkidle");

        await page.evaluate((mode) => {
          document.body.setAttribute("data-color-mode", mode);
        }, colorMode);
        await page.waitForTimeout(500);

        await expect(page.locator("#storybook-root")).toHaveScreenshot(
          `${label}-${colorMode}.png`,
          {
            maxDiffPixelRatio: 0.01,
            animations: "disabled",
          }
        );
      }
    });
  }
});
