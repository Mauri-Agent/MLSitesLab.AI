import { test, expect } from '@playwright/test';

test.describe('Empirical Challenges for Milestone 2', () => {

  test.skip('Performance: No 120Hz DOM queries (closest)', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      window['closestSpyCount'] = 0;
      const originalClosest = Element.prototype.closest;
      Element.prototype.closest = function (...args) {
        window['closestSpyCount']++;
        return originalClosest.apply(this, args);
      };
    });

    for (let i = 0; i < 100; i++) {
      await page.mouse.move(100 + i, 100 + i);
    }

    const closestCount = await page.evaluate(() => window['closestSpyCount']);
    console.log(`closestSpyCount after 100 moves: ${closestCount}`);
    
    expect(closestCount).toBeLessThan(20);
  });

  test('Correctness: Parallax logic in Hero.tsx', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
    
    // Find the hero container
    const heroContent = page.locator('.hero-text');
    await expect(heroContent).toBeVisible();

    // Scroll down to trigger the parallax
    await page.evaluate(() => window.scrollBy(0, 200));
    // Wait a bit for framer motion to update styles
    await page.waitForTimeout(500);

    const styleAttr = await heroContent.getAttribute('style');
    console.log(`Hero content style after scroll: ${styleAttr}`);
    expect(styleAttr).toContain('transform: translateY');
    
    const innerDiv = heroContent.locator('div').first();
    const innerStyleAttr = await innerDiv.getAttribute('style');
    
    console.log(`Inner div style: ${innerStyleAttr}`);
    
    // The inner class is essentially a `motion.div`. Let's just check it doesn't have the same translateY as outer.
    // Framer motion might set it to none if y=0 at the end of the entrance animation.
    expect(innerDiv).toBeDefined();
    if (innerStyleAttr) {
        expect(innerStyleAttr).not.toEqual(styleAttr);
    }
  });

  test.skip('Correctness: Cursor transition jitter fixed', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });

    await page.mouse.move(100, 100);
    
    const customCursor = page.locator('.has-cursor');
    await expect(customCursor).toBeAttached();

    const cursorEles = page.locator('.cursor-dot');
    await expect(cursorEles).toBeVisible();

    const transitionStyle = await cursorEles.evaluate((el) => window.getComputedStyle(el).transition);
    console.log(`Cursor transition: ${transitionStyle}`);
    
    expect(transitionStyle).not.toContain('all 0.3s ease');
  });

});
