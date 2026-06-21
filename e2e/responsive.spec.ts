import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for loader to complete and main container to render
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
  });

  // Test 1: Document-Level No-Overflow (Mobile 375px)
  test('Document-Level No-Overflow (Mobile 375px)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile', 'This test is only for Mobile project');
    const overflowingElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements
        .map(el => {
          const rect = el.getBoundingClientRect();
          return {
            tagName: el.tagName,
            id: el.id,
            className: el.className,
            width: rect.width,
            left: rect.left,
            right: rect.right
          };
        })
        .filter(info => info.width > 375);
    });
    console.log('OVERFLOWING ELEMENTS:', JSON.stringify(overflowingElements, null, 2));
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  // Test 2: Document-Level No-Overflow (Desktop 1080px)
  test('Document-Level No-Overflow (Desktop 1080px)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Desktop', 'This test is only for Desktop project');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  // Test 3: Viewport Meta Tag Check
  test('Viewport Meta Tag Check', async ({ page }) => {
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveCount(1);
    const content = await viewportMeta.getAttribute('content');
    expect(content).toContain('width=device-width');
    expect(content).toContain('initial-scale=1');
  });

  // Test 4: Header/Navbar Boundary Check (Mobile)
  test('Header/Navbar Boundary Check (Mobile)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile', 'This test is only for Mobile project');
    const navbar = page.locator('nav.navbar');
    await expect(navbar).toBeVisible();
    const box = await navbar.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      // Bounding box of navbar fits in 375px width (allow minor fractional pixel margin)
      expect(box.x + box.width).toBeLessThanOrEqual(376);
    }
  });

  // Test 5: Interactive Funnel Boundary Check (Mobile)
  test('Interactive Funnel Boundary Check (Mobile)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile', 'This test is only for Mobile project');
    const funnel = page.locator('.interactive-funnel');
    await expect(funnel).toBeVisible();
    const box = await funnel.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      // Bounding box of .interactive-funnel fits in 375px width (allow minor fractional pixel margin)
      expect(box.x + box.width).toBeLessThanOrEqual(376);
    }
  });
});
