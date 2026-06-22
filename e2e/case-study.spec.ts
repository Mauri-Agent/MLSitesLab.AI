import { test, expect } from '@playwright/test';

test.describe('Vantrek Case Study Page Routing & Experience', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage first
    await page.goto('/');
    // Wait for the loader to finish and app to mount
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
  });

  test('Vantrek Case Study Navigation Flow', async ({ page }) => {
    // 1. Verify Vantrek Project Card is visible on homepage
    const projectCard = page.locator('.project-card');
    await expect(projectCard).toBeVisible();

    const caseLink = page.locator('#vantrek-case-link');
    await expect(caseLink).toBeVisible();

    // 2. Click the case study link
    await caseLink.click();

    // 3. Verify path updated to /portfolio/vantrek
    await expect(page).toHaveURL(/\/portfolio\/vantrek$/);

    // 4. Verify Case Study Title and elements are visible
    const caseTitle = page.locator('h1.case-study-title');
    await expect(caseTitle).toContainText('Automatización Post-Venta Vantrek');

    // 5. Verify Back Button is visible
    const backBtn = page.locator('#case-study-back-btn');
    await expect(backBtn).toBeVisible();

    // 6. Verify interactive simulator is rendered
    const simulator = page.locator('.vantrek-simulator-container');
    await expect(simulator).toBeVisible();

    // 7. Click back button to return to homepage
    await backBtn.click();

    // 8. Verify URL returns to root and home components are visible
    await expect(page).toHaveURL(/\/$/);
    const hero = page.locator('#inicio');
    await expect(hero).toBeVisible();
  });
});
