import { chromium } from 'playwright';

async function runTests() {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const context = await browser.newContext({ hasTouch: false });
  const page = await context.newPage();

  try {
    console.log("Navigating to app...");
    await page.goto('http://127.0.0.1:4173');

    console.log("Test 1: Body has 'has-custom-cursor' class...");
    await page.waitForSelector('body.has-custom-cursor', { timeout: 5000 });
    console.log("Test 1 Passed");

    console.log("Test 2: Hero Parallax...");
    const content = page.locator('.hero-content');
    const glow = page.locator('.hero-glow');
    
    await page.waitForTimeout(500);

    const initialContentTransform = await content.evaluate((el) => window.getComputedStyle(el).transform);
    const initialGlowTransform = await glow.evaluate((el) => window.getComputedStyle(el).transform);
    
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    const scrolledContentTransform = await content.evaluate((el) => window.getComputedStyle(el).transform);
    const scrolledGlowTransform = await glow.evaluate((el) => window.getComputedStyle(el).transform);
    
    if (initialContentTransform === scrolledContentTransform) throw new Error("Hero content did not move.");
    if (initialGlowTransform === scrolledGlowTransform) throw new Error("Hero glow did not move.");
    console.log("Test 2 Passed");

    console.log("Test 3: Service Card 3D Transform...");
    const firstCard = page.locator('.service-card').first();
    await firstCard.scrollIntoViewIfNeeded();
    const box = await firstCard.boundingBox();
    
    await page.mouse.move(box.x + 10, box.y + 10);
    await page.waitForTimeout(500);
    const topLeftTransform = await firstCard.evaluate((el) => window.getComputedStyle(el).transform);
    
    await page.mouse.move(box.x + box.width - 10, box.y + box.height - 10);
    await page.waitForTimeout(500);
    const bottomRightTransform = await firstCard.evaluate((el) => window.getComputedStyle(el).transform);
    
    if (topLeftTransform === bottomRightTransform) throw new Error("Service card did not rotate on mouse move.");
    console.log("Test 3 Passed");

    console.log("Test 4: Cursor Hover State...");
    const cursorEl = page.locator('div[style*="z-index: 9999"]');
    const isVisible = await cursorEl.isVisible();
    if (!isVisible) throw new Error("Cursor element not visible.");

    await page.mouse.move(10, 10);
    await page.waitForTimeout(500);
    const initialBgColor = await cursorEl.evaluate((el) => window.getComputedStyle(el).backgroundColor);

    const btn = page.locator('.btn-primary');
    await btn.scrollIntoViewIfNeeded();
    const btnBox = await btn.boundingBox();
    await page.mouse.move(btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2);
    await page.evaluate(() => {
        const event = new MouseEvent('mouseover', { bubbles: true });
        document.querySelector('.btn-primary').dispatchEvent(event);
    });
    await page.waitForTimeout(500);

    const hoverBgColor = await cursorEl.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    
    if (initialBgColor === hoverBgColor) throw new Error(`Cursor background color did not change. initial: ${initialBgColor}, hover: ${hoverBgColor}`);
    console.log("Test 4 Passed");

    console.log("All tests passed successfully!");

  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await browser.close();
  }
}

runTests();
