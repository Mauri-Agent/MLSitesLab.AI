# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: layout.spec.ts >> Layout Order >> InteractiveFunnel in Initial Viewport
- Location: e2e/layout.spec.ts:43:3

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 900
Received:   901
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - img [ref=e5]
    - generic [ref=e52]: Initializing ML Engine
  - main [ref=e53]:
    - navigation "Navegación principal" [ref=e54]:
      - generic [ref=e55]:
        - link "MLSitesLab.AI — inicio" [ref=e56]:
          - /url: "#inicio"
          - text: MLSitesLab.AI
        - menubar [ref=e57]:
          - menuitem "Inicio" [ref=e58]
          - menuitem "Servicios" [ref=e59]
          - menuitem "Portfolio" [ref=e60]
        - link "Contactar" [ref=e61]:
          - /url: "#servicios"
    - region "Presentación" [ref=e62]:
      - generic [ref=e63]:
        - status [ref=e65]: Sistemas Inteligentes · Activos
        - heading "Automatizamos lo complejo. Potenciamos tu estrategia." [level=1] [ref=e67]:
          - text: Automatizamos
          - text: lo complejo.
          - text: Potenciamos tu estrategia.
        - paragraph [ref=e68]: "Soy Mauricio. Ayudo a equipos y empresas a delegar sus tareas repetitivas en sistemas de inteligencia artificial. Nuestro objetivo es simple: implementar tecnología de vanguardia que trabaje por ti, ahorrándote horas de trabajo manual para que puedas concentrarte en lo que verdaderamente importa."
        - generic [ref=e69]:
          - button "Ver servicios disponibles" [ref=e70]:
            - text: Ver Servicios
            - img [ref=e71]
          - button "Ver portfolio" [ref=e73]: Portfolio
      - generic [ref=e75]:
        - region "Terminal demostrativa" [ref=e76]:
          - generic [ref=e81]: mlsiteslab — bash
          - generic [ref=e84]: $
        - list "Estadísticas" [ref=e86]:
          - listitem [ref=e87]:
            - generic "14+ Automatizaciones" [ref=e88]: 14+
            - generic [ref=e89]: Automatizaciones
          - listitem [ref=e90]:
            - generic "38h Ahorradas/sem" [ref=e91]: 38h
            - generic [ref=e92]: Ahorradas/sem
          - listitem [ref=e93]:
            - generic "24/7 Disponibilidad" [ref=e94]: 24/7
            - generic [ref=e95]: Disponibilidad
      - button "Ir a servicios" [ref=e96]:
        - text: Scroll
        - img [ref=e97]
    - generic [ref=e100]:
      - generic [ref=e101]: Interactive Auditor
      - heading "Configure your AI Engine" [level=2] [ref=e102]
      - generic [ref=e103]:
        - generic [ref=e105]:
          - generic [ref=e110]: AI_AUDITOR.exe
          - generic [ref=e112]:
            - generic [ref=e113]: AI_SYSTEM>
            - generic [ref=e114]: ...
          - generic [ref=e115]:
            - generic [ref=e116]: USER>
            - textbox "Processing..." [disabled] [ref=e117]
        - img [ref=e120]:
          - generic [ref=e127]: Business Core
          - generic [ref=e129]: Industry Params
          - generic [ref=e131]: Bottleneck
          - generic [ref=e133]: Primary Goal
          - generic [ref=e136]: AI Blueprint
    - generic [ref=e139]:
      - generic [ref=e140]:
        - generic [ref=e141]: Servicios
        - heading "Ecosistema de Soluciones" [level=2] [ref=e143]
        - paragraph [ref=e144]: Tecnología de vanguardia aplicada para resolver problemas reales, optimizar tiempos y escalar tus operaciones.
      - generic [ref=e145]:
        - article "Automatización de Procesos" [ref=e146]:
          - generic: "01"
          - img [ref=e148]
          - heading "Automatización de Procesos" [level=3] [ref=e151]
          - paragraph [ref=e152]: Diseñamos e implementamos flujos automatizados con n8n y Make para conectar tus aplicaciones y eliminar horas de trabajo manual repetitivo.
          - generic [ref=e153]: Ver más →
        - article "Consultoría Estratégica IA" [ref=e154]:
          - generic: "02"
          - img [ref=e156]
          - heading "Consultoría Estratégica IA" [level=3] [ref=e159]
          - paragraph [ref=e160]: Analizamos las operaciones de tu empresa para identificar cuellos de botella y descubrir dónde la Inteligencia Artificial puede optimizar costos y escalar resultados.
          - generic [ref=e161]: Ver más →
        - article "Desarrollo de Soluciones Web" [ref=e162]:
          - generic: "03"
          - img [ref=e164]
          - heading "Desarrollo de Soluciones Web" [level=3] [ref=e168]
          - paragraph [ref=e169]: Creamos plataformas web modernas y personalizadas, integradas con la última tecnología y diseñadas para ofrecer una experiencia de usuario premium.
          - generic [ref=e170]: Ver más →
        - article "Agentes Inteligentes" [ref=e171]:
          - generic: "04"
          - img [ref=e173]
          - heading "Agentes Inteligentes" [level=3] [ref=e176]
          - paragraph [ref=e177]: Desarrollamos asistentes virtuales impulsados por IA, capaces de atender a tus clientes, clasificar leads o asistir a tu equipo 24/7 de forma autónoma.
          - generic [ref=e178]: Ver más →
    - generic [ref=e181]:
      - generic [ref=e182]:
        - generic [ref=e183]: Portfolio
        - heading "Nuestros Proyectos" [level=2] [ref=e184]
        - paragraph [ref=e185]: Casos de éxito y soluciones destacadas que hemos desarrollado para nuestros clientes.
      - generic [ref=e186]:
        - img [ref=e188]
        - heading "Portfolio en Construcción" [level=3] [ref=e190]
        - paragraph [ref=e191]: Próximamente estaremos agregando nuestros casos de éxito y proyectos destacados.
        - generic [ref=e193]:
          - generic [ref=e194]: Progreso
          - generic [ref=e195]: 35%
        - button "Notificarme cuando esté listo" [ref=e197]
    - contentinfo "Pie de página" [ref=e198]:
      - generic [ref=e200]:
        - generic [ref=e201]: MLSitesLab.AI
        - paragraph [ref=e202]: © 2026 MLSitesLab.AI — Todos los derechos reservados.
        - navigation "Links del footer" [ref=e203]:
          - link "Inicio" [ref=e204]:
            - /url: "#inicio"
          - link "Servicios" [ref=e205]:
            - /url: "#servicios"
          - link "Portfolio" [ref=e206]:
            - /url: "#portfolio"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Layout Order', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     // Wait for the loader to finish and app to mount
  7  |     await page.waitForSelector('.app-container', { state: 'visible', timeout: 10000 });
  8  |   });
  9  | 
  10 |   // Test 1: DOM Tree Precedence
  11 |   test('DOM Tree Precedence', async ({ page }) => {
  12 |     const result = await page.evaluate(() => {
  13 |       const funnel = document.querySelector('.interactive-funnel');
  14 |       const hero = document.querySelector('#inicio');
  15 |       if (!funnel || !hero) return false;
  16 |       // We expect the hero to be structured ABOVE the funnel in the DOM
  17 |       return !!(hero.compareDocumentPosition(funnel) & Node.DOCUMENT_POSITION_FOLLOWING);
  18 |     });
  19 |     expect(result).toBe(true);
  20 |   });
  21 | 
  22 |   // Test 2: Vertical Coordinates Comparison
  23 |   test('Vertical Coordinates Comparison', async ({ page }) => {
  24 |     const funnel = page.locator('.interactive-funnel');
  25 |     const hero = page.locator('#inicio');
  26 |     
  27 |     await expect(funnel).toBeVisible();
  28 |     await expect(hero).toBeVisible();
  29 |     
  30 |     const funnelBox = await funnel.boundingBox();
  31 |     const heroBox = await hero.boundingBox();
  32 |     
  33 |     expect(funnelBox).not.toBeNull();
  34 |     expect(heroBox).not.toBeNull();
  35 |     
  36 |     if (funnelBox && heroBox) {
  37 |       // Hero y should be less than funnel y (above it vertically)
  38 |       expect(heroBox.y).toBeLessThan(funnelBox.y);
  39 |     }
  40 |   });
  41 | 
  42 |   // Test 3: Hero in Initial Viewport
  43 |   test('Hero in Initial Viewport', async ({ page }) => {
  44 |     const hero = page.locator('#inicio');
  45 |     await expect(hero).toBeVisible();
  46 |     const heroBox = await hero.boundingBox();
  47 |     expect(heroBox).not.toBeNull();
  48 |     
  49 |     const viewportHeight = await page.evaluate(() => window.innerHeight);
  50 |     if (heroBox) {
  51 |       // Hero should start within the initial viewport
> 52 |       expect(heroBox.y).toBeLessThan(viewportHeight);
     |                           ^ Error: expect(received).toBeLessThan(expected)
  53 |     }
  54 |   });
  55 | 
  56 |   // Test 4: InteractiveFunnel Positioned Below the fold
  57 |   test('InteractiveFunnel Positioned Below the fold', async ({ page }) => {
  58 |     const funnel = page.locator('.interactive-funnel');
  59 |     const hero = page.locator('#inicio');
  60 |     
  61 |     await expect(funnel).toBeVisible();
  62 |     await expect(hero).toBeVisible();
  63 |     
  64 |     const funnelBox = await funnel.boundingBox();
  65 |     const heroBox = await hero.boundingBox();
  66 |     
  67 |     expect(funnelBox).not.toBeNull();
  68 |     expect(heroBox).not.toBeNull();
  69 |     
  70 |     if (funnelBox && heroBox) {
  71 |       // Funnel y should be greater than or equal to hero y + hero height
  72 |       expect(funnelBox.y).toBeGreaterThanOrEqual(heroBox.y + heroBox.height);
  73 |     }
  74 |   });
  75 | 
  76 |   // Test 5: Layout Divider Separation
  77 |   test('Layout Divider Separation', async ({ page }) => {
  78 |     const result = await page.evaluate(() => {
  79 |       const funnel = document.querySelector('.interactive-funnel');
  80 |       const hero = document.querySelector('#inicio');
  81 |       const dividers = Array.from(document.querySelectorAll('.divider'));
  82 |       
  83 |       if (!funnel || !hero || dividers.length === 0) return false;
  84 |       
  85 |       return dividers.some(div => {
  86 |         const isBetween1 = !!(hero.compareDocumentPosition(div) & Node.DOCUMENT_POSITION_FOLLOWING) &&
  87 |                            !!(div.compareDocumentPosition(funnel) & Node.DOCUMENT_POSITION_FOLLOWING);
  88 |         const isBetween2 = !!(funnel.compareDocumentPosition(div) & Node.DOCUMENT_POSITION_FOLLOWING) &&
  89 |                            !!(div.compareDocumentPosition(hero) & Node.DOCUMENT_POSITION_FOLLOWING);
  90 |         return isBetween1 || isBetween2;
  91 |       });
  92 |     });
  93 |     expect(result).toBe(true);
  94 |   });
  95 | });
  96 | 
```