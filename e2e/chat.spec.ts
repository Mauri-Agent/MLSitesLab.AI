import { test, expect } from '@playwright/test';

test.describe('Chat Greetings & Auto-Scroll', () => {
  test.beforeEach(async ({ page }) => {
    // Mock OpenAI API endpoint
    await page.route('https://api.openai.com/v1/chat/completions', async (route, request) => {
      if (request.method() === 'POST') {
        const postData = JSON.parse(request.postData() || '{}');
        const messages = postData.messages || [];
        const userMessages = messages.filter((m: { role: string }) => m.role === 'user');
        
        let reply = '';
        if (userMessages.length === 0) {
          reply = 'Iniciando escaneo... Hola, soy el AI_AUDITOR. ¿Cuál es la industria y el principal producto/servicio de tu empresa?';
        } else if (userMessages.length === 1) {
          reply = 'Datos procesados. Entendido. Segunda pregunta: ¿Cuál es el mayor cuello de botella actual?';
        } else if (userMessages.length === 2) {
          reply = 'Seguimiento completado. Tercera pregunta: ¿Cuál es el objetivo principal a lograr con la IA?';
        } else {
          reply = 'Procesando auditoría final... Solución: Implementar flujos automatizados. [ANALYSIS_COMPLETE]';
        }
        
        // Artificial delay to allow React 18 StrictMode abort/unmount to clear first request in dev mode
        await new Promise(resolve => setTimeout(resolve, 800));
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            choices: [{ message: { role: 'assistant', content: reply } }]
          })
        });
      } else {
        await route.fallback();
      }
    });

    await page.goto('/');
    
    // Inject style tag to disable transitions & animations
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
  });

  /* ── Chat Greetings (5 Tests) ──────────────────────────────── */

  // Test 1: Verify Single Greeting Welcome Bubble
  test('Verify Single Greeting Welcome Bubble', async ({ page }) => {
    // Wait for loader
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
    // Wait for the typing indicator to disappear
    await page.waitForSelector('.terminal-typing-indicator', { state: 'detached', timeout: 5000 });
    
    // Verify there is exactly 1 assistant message bubble
    const bubbles = page.locator('.terminal-message.assistant');
    await expect(bubbles).toHaveCount(1);
  });

  // Test 2: Ensure System Prompt is Excluded from UI
  test('Ensure System Prompt is Excluded from UI', async ({ page }) => {
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('.terminal-typing-indicator', { state: 'detached', timeout: 5000 });
    
    const bubbles = page.locator('.terminal-message');
    const count = await bubbles.count();
    for (let i = 0; i < count; i++) {
      const text = await bubbles.nth(i).textContent();
      expect(text).not.toContain('Eres el "AI_AUDITOR"');
      expect(text).not.toContain('Tu objetivo es hacer 3 preguntas');
    }
  });

  // Test 3: Validate Greeting Content Persona
  test('Validate Greeting Content Persona', async ({ page }) => {
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('.terminal-typing-indicator', { state: 'detached', timeout: 5000 });
    
    const greetingBubble = page.locator('.terminal-message.assistant').first();
    const content = await greetingBubble.textContent();
    expect(content).toContain('AI_AUDITOR');
    expect(content).toContain('escaneo');
  });

  // Test 4: Initial Typing Indicator Lifecycle
  test('Initial Typing Indicator Lifecycle', async ({ page }) => {
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
    // Check typing indicator is visible first
    await expect(page.locator('.terminal-typing-indicator')).toBeVisible();
    // Then disappears
    await expect(page.locator('.terminal-typing-indicator')).toBeHidden({ timeout: 5000 });
  });

  // Test 5: No Greeting Stacking
  test('No Greeting Stacking', async ({ page }) => {
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('.terminal-typing-indicator', { state: 'detached', timeout: 5000 });
    
    const input = page.locator('.terminal-input');
    await input.click();
    await input.focus();
    
    await page.waitForTimeout(1000);
    const bubbles = page.locator('.terminal-message.assistant');
    await expect(bubbles).toHaveCount(1);
  });

  /* ── Chat Auto-Scroll (5 Tests) ────────────────────────────── */

  // Test 6: Initial scroll at bottom
  test('Initial scroll at bottom', async ({ page }) => {
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('.terminal-typing-indicator', { state: 'detached', timeout: 5000 });
    
    const isAtBottom = await page.evaluate(() => {
      const body = document.querySelector('.terminal-body');
      if (!body) return false;
      const offset = body.scrollHeight - body.scrollTop - body.clientHeight;
      return offset <= 2;
    });
    expect(isAtBottom).toBe(true);
  });

  // Test 7: Auto-Scroll on Message Dispatch
  test('Auto-Scroll on Message Dispatch', async ({ page }) => {
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('.terminal-typing-indicator', { state: 'detached', timeout: 5000 });
    
    // Scroll to top manually
    await page.evaluate(() => {
      const body = document.querySelector('.terminal-body');
      if (body) body.scrollTop = 0;
    });
    
    const input = page.locator('.terminal-input');
    await input.fill('Automotriz y venta de repuestos');
    await input.press('Enter');
    
    await expect(page.locator('.terminal-typing-indicator')).toBeVisible();
    
    const isAtBottom = await page.evaluate(() => {
      const body = document.querySelector('.terminal-body');
      if (!body) return false;
      const offset = body.scrollHeight - body.scrollTop - body.clientHeight;
      return offset <= 2;
    });
    expect(isAtBottom).toBe(true);
  });

  // Test 8: Auto-Scroll on Response Reception
  test('Auto-Scroll on Response Reception', async ({ page }) => {
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('.terminal-typing-indicator', { state: 'detached', timeout: 5000 });
    
    const input = page.locator('.terminal-input');
    await input.fill('Automotriz y venta de repuestos');
    await input.press('Enter');
    
    await expect(page.locator('.terminal-typing-indicator')).toBeVisible();
    await expect(page.locator('.terminal-typing-indicator')).toBeHidden({ timeout: 5000 });
    
    const isAtBottom = await page.evaluate(() => {
      const body = document.querySelector('.terminal-body');
      if (!body) return false;
      const offset = body.scrollHeight - body.scrollTop - body.clientHeight;
      return offset <= 2;
    });
    expect(isAtBottom).toBe(true);
  });

  // Test 9: No Scroll During Keyboard Typing
  test('No Scroll During Keyboard Typing', async ({ page }) => {
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('.terminal-typing-indicator', { state: 'detached', timeout: 5000 });
    
    // Add two interactions to make terminal scrollable
    const input = page.locator('.terminal-input');
    await input.fill('Interaccion 1');
    await input.press('Enter');
    await expect(page.locator('.terminal-typing-indicator')).toBeHidden({ timeout: 5000 });
    
    await input.fill('Interaccion 2');
    await input.press('Enter');
    await expect(page.locator('.terminal-typing-indicator')).toBeHidden({ timeout: 5000 });
    
    // Scroll up manually
    await page.evaluate(() => {
      const body = document.querySelector('.terminal-body');
      if (body) body.scrollTop = 0;
    });
    
    // Type into the input character by character without pressing Enter
    await input.pressSequentially('Mi respuesta parcial...');
    await page.waitForTimeout(500);
    
    const scrollTop = await page.evaluate(() => {
      const body = document.querySelector('.terminal-body');
      return body ? body.scrollTop : -1;
    });
    expect(scrollTop).toBe(0);
  });

  // Test 10: Manual Scroll Position Retained on Focus
  test('Manual Scroll Position Retained on Focus', async ({ page }) => {
    await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
    await page.waitForSelector('.terminal-typing-indicator', { state: 'detached', timeout: 5000 });
    
    const input = page.locator('.terminal-input');
    await input.fill('Interaccion 1');
    await input.press('Enter');
    await expect(page.locator('.terminal-typing-indicator')).toBeHidden({ timeout: 5000 });
    
    await input.fill('Interaccion 2');
    await input.press('Enter');
    await expect(page.locator('.terminal-typing-indicator')).toBeHidden({ timeout: 5000 });
    
    // Scroll up manually
    await page.evaluate(() => {
      const body = document.querySelector('.terminal-body');
      if (body) body.scrollTop = 0;
    });
    
    // Focus terminal input
    await input.focus();
    await page.waitForTimeout(500);
    
    const scrollTop = await page.evaluate(() => {
      const body = document.querySelector('.terminal-body');
      return body ? body.scrollTop : -1;
    });
    expect(scrollTop).toBe(0);
  });
});
