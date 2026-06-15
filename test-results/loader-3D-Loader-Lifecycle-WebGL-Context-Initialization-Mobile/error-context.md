# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: loader.spec.ts >> 3D Loader Lifecycle >> WebGL Context Initialization
- Location: e2e/loader.spec.ts:20:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('canvas')
Expected: visible
Timeout: 2000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 2000ms
  - waiting for locator('canvas')

```

```yaml
- img
- text: Initializing ML Engine
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('3D Loader Lifecycle', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   // Test 1: WebGL Canvas Visibility on Load
  9  |   test('WebGL Canvas Visibility on Load', async ({ page }) => {
  10 |     // Loader text should be visible on load
  11 |     const loaderText = page.locator('text=Initializing ML Engine');
  12 |     await expect(loaderText).toBeVisible();
  13 |     
  14 |     // WebGL Canvas should be visible (This is expected to fail as no canvas is implemented)
  15 |     const canvas = page.locator('canvas');
  16 |     await expect(canvas).toBeVisible({ timeout: 2000 });
  17 |   });
  18 | 
  19 |   // Test 2: WebGL Context Initialization
  20 |   test('WebGL Context Initialization', async ({ page }) => {
  21 |     const canvas = page.locator('canvas');
  22 |     // Ensure canvas is visible first (Expected to fail)
> 23 |     await expect(canvas).toBeVisible({ timeout: 2000 });
     |                          ^ Error: expect(locator).toBeVisible() failed
  24 |     
  25 |     // Evaluate WebGL context
  26 |     const contextNotNull = await canvas.evaluate((el: Element) => {
  27 |       const canvasEl = el as HTMLCanvasElement;
  28 |       const gl = canvasEl.getContext('webgl') || canvasEl.getContext('webgl2');
  29 |       return gl !== null;
  30 |     });
  31 |     expect(contextNotNull).toBe(true);
  32 |   });
  33 | 
  34 |   // Test 3: App Container Hidden during Load
  35 |   test('App Container Hidden during Load', async ({ page }) => {
  36 |     const appContainer = page.locator('.app-container');
  37 |     await expect(appContainer).toBeHidden();
  38 |   });
  39 | 
  40 |   // Test 4: Loader Lifecycle Complete
  41 |   test('Loader Lifecycle Complete', async ({ page }) => {
  42 |     const loaderText = page.locator('text=Initializing ML Engine');
  43 |     await expect(loaderText).toBeVisible();
  44 |     
  45 |     // Wait for the loader lifecycle to finish (3.2 seconds total timer + 0.6 seconds transition)
  46 |     await page.waitForTimeout(4000);
  47 |     
  48 |     // Verify loader container/text is unmounted or hidden
  49 |     await expect(loaderText).toBeHidden();
  50 |   });
  51 | 
  52 |   // Test 5: App Container Mounted & Visible Post-Load
  53 |   test('App Container Mounted & Visible Post-Load', async ({ page }) => {
  54 |     const appContainer = page.locator('.app-container');
  55 |     await expect(appContainer).toBeHidden();
  56 |     
  57 |     // Wait for loader to finish
  58 |     await page.waitForTimeout(4000);
  59 |     
  60 |     // App container should now be visible
  61 |     await expect(appContainer).toBeVisible();
  62 |   });
  63 | });
  64 | 
```