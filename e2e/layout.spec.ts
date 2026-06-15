import { test, expect } from '@playwright/test';

test.describe('Layout Order', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the loader to finish and app to mount
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
  });

  // Test 1: DOM Tree Precedence
  test('DOM Tree Precedence', async ({ page }) => {
    const result = await page.evaluate(() => {
      const funnel = document.querySelector('.interactive-funnel');
      const hero = document.querySelector('#inicio');
      if (!funnel || !hero) return false;
      // We expect the hero to be structured ABOVE the funnel in the DOM
      return !!(hero.compareDocumentPosition(funnel) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(result).toBe(true);
  });

  // Test 2: Vertical Coordinates Comparison
  test('Vertical Coordinates Comparison', async ({ page }) => {
    const funnel = page.locator('.interactive-funnel');
    const hero = page.locator('#inicio');
    
    await expect(funnel).toBeVisible();
    await expect(hero).toBeVisible();
    
    const funnelBox = await funnel.boundingBox();
    const heroBox = await hero.boundingBox();
    
    expect(funnelBox).not.toBeNull();
    expect(heroBox).not.toBeNull();
    
    if (funnelBox && heroBox) {
      // Hero y should be less than funnel y (above it vertically)
      expect(heroBox.y).toBeLessThan(funnelBox.y);
    }
  });

  // Test 3: Hero in Initial Viewport
  test('Hero in Initial Viewport', async ({ page }) => {
    const hero = page.locator('#inicio');
    await expect(hero).toBeVisible();
    const heroBox = await hero.boundingBox();
    expect(heroBox).not.toBeNull();
    
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    if (heroBox) {
      // Hero should start within the initial viewport
      expect(heroBox.y).toBeLessThan(viewportHeight);
    }
  });

  // Test 4: InteractiveFunnel Positioned Below the fold
  test('InteractiveFunnel Positioned Below the fold', async ({ page }) => {
    const funnel = page.locator('.interactive-funnel');
    const hero = page.locator('#inicio');
    
    await expect(funnel).toBeVisible();
    await expect(hero).toBeVisible();
    
    const funnelBox = await funnel.boundingBox();
    const heroBox = await hero.boundingBox();
    
    expect(funnelBox).not.toBeNull();
    expect(heroBox).not.toBeNull();
    
    if (funnelBox && heroBox) {
      // Funnel y should be greater than or equal to hero y + hero height
      expect(funnelBox.y).toBeGreaterThanOrEqual(heroBox.y + heroBox.height);
    }
  });

  // Test 5: Layout Divider Separation
  test('Layout Divider Separation', async ({ page }) => {
    const result = await page.evaluate(() => {
      const funnel = document.querySelector('.interactive-funnel');
      const hero = document.querySelector('#inicio');
      const dividers = Array.from(document.querySelectorAll('.divider'));
      
      if (!funnel || !hero || dividers.length === 0) return false;
      
      return dividers.some(div => {
        const isBetween1 = !!(hero.compareDocumentPosition(div) & Node.DOCUMENT_POSITION_FOLLOWING) &&
                           !!(div.compareDocumentPosition(funnel) & Node.DOCUMENT_POSITION_FOLLOWING);
        const isBetween2 = !!(funnel.compareDocumentPosition(div) & Node.DOCUMENT_POSITION_FOLLOWING) &&
                           !!(div.compareDocumentPosition(hero) & Node.DOCUMENT_POSITION_FOLLOWING);
        return isBetween1 || isBetween2;
      });
    });
    expect(result).toBe(true);
  });
});
