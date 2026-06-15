import { test, expect } from '@playwright/test';

test.describe('Scroll Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
    // Wait for the loader to finish and app to mount
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
  });

  // Test 1: HTML Element Scroll Clearance
  test('HTML Element Scroll Clearance', async ({ page }) => {
    const overflowY = await page.evaluate(() => window.getComputedStyle(document.documentElement).overflowY);
    expect(overflowY).not.toBe('hidden');
  });

  // Test 2: Body Element Scroll Clearance
  test('Body Element Scroll Clearance', async ({ page }) => {
    const overflowY = await page.evaluate(() => window.getComputedStyle(document.body).overflowY);
    expect(overflowY).not.toBe('hidden');
  });

  // Test 3: Execution of Scroll Offsets
  test('Execution of Scroll Offsets', async ({ page }) => {
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    const scrolledY = await page.evaluate(() => window.scrollY);
    expect(scrolledY).toBeGreaterThan(0);
  });

  // Test 4: Scroll Indicator Integration
  test('Scroll Indicator Integration', async ({ page }) => {
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);
    
    const scrollBtn = page.locator('#hero-scroll-btn');
    await expect(scrollBtn).toBeVisible();
    await scrollBtn.click();
    
    // Wait for smooth scroll animation to finish
    await page.waitForTimeout(1500);
    
    const scrolledY = await page.evaluate(() => window.scrollY);
    expect(scrolledY).toBeGreaterThan(0);
  });

  // Test 5: Body Style Restored
  test('Body Style Restored', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile', 'This test is only for Mobile project');
    const hamburger = page.locator('#hamburger-btn');
    await expect(hamburger).toBeVisible();
    
    // Open hamburger menu
    await hamburger.click();
    await page.waitForTimeout(500);
    
    const openOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(openOverflow).toBe('hidden');
    
    // Close hamburger menu
    await hamburger.click();
    await page.waitForTimeout(500);
    
    const closedOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(closedOverflow === '' || closedOverflow === 'visible').toBe(true);
  });
});
