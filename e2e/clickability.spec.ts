import { test, expect } from '@playwright/test';

test.describe('Clickability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          animation: none !important;
          transition: none !important;
        }
        button, a, [role="button"] {
          transform: none !important;
        }
        #hero-scroll-btn {
          transform: translateX(-50%) !important;
        }
      `
    });
    // Wait for the loader to finish and app to mount
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
  });

  // Test 1: All Anchor (a) Links Actionability
  test('All Anchor (a) Links Actionability', async ({ page }) => {
    const links = page.locator('a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      if (await link.isVisible()) {
        // click({ trial: true }) verifies the element is ready and clickable, without actually clicking
        await link.click({ trial: true });
      }
    }
  });

  // Test 2: All Button (button) elements Actionability
  test('All Button (button) elements Actionability', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await button.click({ trial: true });
      }
    }
  });

  // Test 3: Mobile Hamburger Menu Toggle clickability
  test('Mobile Hamburger Menu Toggle clickability', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile', 'This test is only for Mobile project');
    const hamburger = page.locator('#hamburger-btn');
    await expect(hamburger).toBeVisible();
    
    const mobileMenu = page.locator('.mobile-menu');
    await expect(mobileMenu).not.toBeVisible();
    
    await hamburger.click();
    await expect(mobileMenu).toBeVisible();
    
    await hamburger.click();
    await expect(mobileMenu).not.toBeVisible();
  });

  // Test 4: Interactive Funnel Service/Node Cards Actionability
  test('Interactive Funnel Service/Node Cards Actionability', async ({ page }) => {
    const elements = page.locator('[role="button"]');
    const count = await elements.count();
    for (let i = 0; i < count; i++) {
      const el = elements.nth(i);
      if (await el.isVisible()) {
        await el.click({ trial: true });
      }
    }
  });

  // Test 5: Hero Primary CTA Actionability
  test('Hero Primary CTA Actionability', async ({ page }) => {
    const primaryCta = page.locator('#hero-cta-primary');
    await expect(primaryCta).toBeVisible();
    await primaryCta.click({ trial: true });
  });
});
