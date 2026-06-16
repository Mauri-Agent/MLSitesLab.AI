import { test, expect } from '@playwright/test';

test.describe('3D Loader Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Test 1: WebGL Canvas Visibility on Load
  test('WebGL Canvas Visibility on Load', async ({ page }) => {
    // Loader text should be visible on load
    const loaderText = page.locator('text=Inicializando ML Engine');
    await expect(loaderText).toBeVisible();
    
    // WebGL Canvas should be visible (This is expected to fail as no canvas is implemented)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 2000 });
  });

  // Test 2: WebGL Context Initialization
  test('WebGL Context Initialization', async ({ page }) => {
    const canvas = page.locator('canvas');
    // Ensure canvas is visible first (Expected to fail)
    await expect(canvas).toBeVisible({ timeout: 2000 });
    
    // Evaluate WebGL context
    const contextNotNull = await canvas.evaluate((el: Element) => {
      const canvasEl = el as HTMLCanvasElement;
      const gl = canvasEl.getContext('webgl') || canvasEl.getContext('webgl2');
      return gl !== null;
    });
    expect(contextNotNull).toBe(true);
  });

  // Test 3: App Container Hidden during Load
  test('App Container Hidden during Load', async ({ page }) => {
    const appContainer = page.locator('.app-container');
    await expect(appContainer).toBeHidden();
  });

  // Test 4: Loader Lifecycle Complete
  test('Loader Lifecycle Complete', async ({ page }) => {
    const loaderText = page.locator('text=Inicializando ML Engine');
    await expect(loaderText).toBeVisible();
    
    // Wait for the loader lifecycle to finish (3.2 seconds total timer + 0.6 seconds transition)
    await page.waitForTimeout(4000);
    
    // Verify loader container/text is unmounted or hidden
    await expect(loaderText).toBeHidden();
  });

  // Test 5: App Container Mounted & Visible Post-Load
  test('App Container Mounted & Visible Post-Load', async ({ page }) => {
    const appContainer = page.locator('.app-container');
    await expect(appContainer).toBeHidden();
    
    // Wait for loader to finish
    await page.waitForTimeout(4000);
    
    // App container should now be visible
    await expect(appContainer).toBeVisible();
  });
});
