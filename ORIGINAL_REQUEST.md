# Original User Request

## Initial Request — 2026-06-09T03:00:11-03:00

# Teamwork Project Prompt — Draft

> Status: Ready for launch
> Goal: Craft prompt → delegate to teamwork_preview

Rediseñar, potenciar con animaciones creativas y probar exhaustivamente el portfolio web personal MLSitesLab.AI (basado en Vite + React). El objetivo es crear una experiencia visual única y espectacular ("efecto WOW"), garantizando que el diseño sea responsivo, seguro y optimizado, respetando la paleta "Green Arrow" y la información actual.

Working directory: /home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI
Integrity mode: development

## Requirements

### R1. Investigación y Diseño de Vanguardia
El equipo debe investigar y proponer animaciones web de última generación (Framer Motion, CSS avanzado, o WebGL si es necesario). Se debe rediseñar la interfaz actual para que no sea "lo de siempre", incorporando micro-interacciones, efectos hover únicos y transiciones de página fluidas.

### R2. Calidad y Pruebas Exhaustivas (QA)
Todos los componentes interactivos (botones, enlaces, tarjetas) deben funcionar perfectamente. Se debe verificar visual y programáticamente que no haya desbordamiento de texto (overflow) en resoluciones móviles, tablets ni desktop.

### R3. Seguridad y Optimización
El código debe seguir las mejores prácticas de React/Vite. Se deben aplicar medidas de seguridad estándar (sanitización si aplica, atributos rel="noopener" en enlaces, etc.) y optimización de rendimiento (Lazy loading de componentes pesados si se usan).

## Acceptance Criteria

## Animaciones e Interfaz
- [ ] La web cuenta con al menos 3 animaciones complejas o micro-interacciones (ej. efecto parallax sutil, tarjetas 3D, cursores magnéticos).
- [ ] El diseño mantiene la paleta Dark Green pero con un nivel de pulido profesional superior al estado base.

### Pruebas (Verificación Objetiva)
- [ ] Se ejecuta un script automatizado (ej. Playwright o un script Node con Puppeteer) que navegue la página en resoluciones 375px (Mobile) y 1080px (Desktop), verificando que no existan elementos fuera del viewport horizontal (overflow-x).
- [ ] Se comprueba mediante scripts que todos los botones y enlaces en el DOM son clickeables and no están bloqueados por otros elementos ocultos.

### Rendimiento
- [ ] El comando `npm run build` se ejecuta sin errores de TypeScript ni advertencias graves.

## Follow-up — 2026-06-09T23:10:59Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Arreglar bugs en la web actual (doble saludo, scroll trabado, auto-scroll en chat), mover el funnel interactivo para que sea la cabecera principal (Hero), y reemplazar el loader 2D por una espectacular animación 3D de redes neuronales de nivel premium.

Working directory: /home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI
Integrity mode: development

## Requirements

### R1. Bug Fixes de UI/UX
Corrige el problema de que el chat salude dos veces al iniciar, el comportamiento "trabado" del scroll general de la página, y el auto-scroll defectuoso hacia abajo que ocurre al escribir en la terminal del chat.

### R2. Reestructuración del Layout Principal
Modifica la estructura de la aplicación para que el Funnel Interactivo (Chat + Node Graph) sea el componente "Hero" de la página, apareciendo arriba del todo como lo primero que ve el usuario, en lugar de la bienvenida clásica. 

### R3. Loader 3D Premium
Reemplaza la animación actual en 2D (SVG) del inicio por una red neuronal en 3D de nivel premium, grande y profesional. Debes instalar y utilizar librerías oficiales y nativas (como Three.js, React Three Fiber, etc.) para lograr un efecto visual único y sofisticado que mantenga la estética de la marca.

### R4. Visión Holística del Equipo
Trabajen en conjunto (Programación, Marketing, Branding) para asegurar que la reestructuración del layout, la solución técnica de bugs y el nuevo diseño 3D mantengan la percepción de una marca B2B High-Ticket de vanguardia.

## Acceptance Criteria

### Compilación y Rendimiento
- [ ] El comando `npm run build` se ejecuta exitosamente sin errores de TypeScript o dependencias.
- [ ] Las nuevas dependencias 3D provienen de fuentes oficiales (NPM) y están correctamente listadas en `package.json`.

### Corrección de Bugs
- [ ] El estado del chat inicializa correctamente con un único mensaje de bienvenida (sin duplicados causados por StrictMode u otros renders).
- [ ] No existen propiedades CSS (`overflow: hidden` o similares en `body/html`) que interfieran negativamente con el scroll natural del navegador.

### Layout y Diseño 3D
- [ ] El componente `InteractiveFunnel` está posicionado como el primer elemento visible en la estructura de `App.tsx` (actuando como el nuevo Hero).
- [ ] El nuevo `Loader` renderiza un elemento `<canvas>` o contexto WebGL en lugar de SVG, comprobando la implementación 3D interactiva y profesional.

## Layout Clarification Follow-up — 2026-06-09T23:30:30Z

En lugar de poner el `InteractiveFunnel` (Foto 2) arriba del todo como el nuevo Hero, el usuario desea:
1. Mantener la sección de bienvenida/Hero original (componente `Hero.tsx` / Foto 1 con el título "lo complejo. Potenciamos tu estrategia.", la terminal de estadísticas a la derecha, los botones "Ver Servicios"/"Portfolio" y las tarjetas de stats abajo) arriba de todo, actuando como la cabecera principal (Hero).
2. Colocar el `InteractiveFunnel` (componente `InteractiveFunnel.tsx` / Foto 2, con el chat y el grafo) inmediatamente debajo de esa sección de bienvenida/cabecera (`Hero.tsx`).

## Follow-up — 2026-06-16T00:47:56-03:00

The goal of this project is to optimize the scroll mechanics and custom scrollbar aesthetics, add autofocus to the sales funnel chat input, implement intelligent graph node activation driven by AI tags, fix all failing E2E Playwright tests, and deploy the updated application.

Working directory: `/home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI`
Integrity mode: `development`

## Requirements

### R1. Native Scroll Mechanics & Premium Scrollbar Aesthetics
Ensure the main viewport scroll is entirely native and smooth. Prevent Chrome from rendering duplicate scrollbars on `html` and `body` or container elements. Customize the scrollbar in Webkit browsers to show a premium, capsule-style green thumb with a dark track, with a width of 10-12px.

### R2. Sales Funnel Chat Autofocus
Implement autofocus on the terminal chat input element (`.terminal-input`). The input must automatically receive focus on component mount, after the user dispatches a message, and when the AI auditor finishes typing (`isTyping` changes to `false`).

### R3. AI-Driven Intelligent Graph Node Tracing
Update the graph node activation so it is determined by the AI auditor's analysis. Define milestones in the `systemPrompt` (e.g. `[NODE: industry]`, `[NODE: bottleneck]`, `[NODE: goal]`, `[NODE: solution]`) that the AI outputs when a valid response is received. The frontend must parse these tags to activate the corresponding nodes and strip the tags from the visible terminal message text before rendering.

### R4. E2E Test Suite Verification and Fixes
Ensure all tests in `e2e/` pass.
- In `loader.spec.ts`, update the expected text search from English `"Initializing ML Engine"` to the Spanish `"Inicializando ML Engine"`.
- Simulate typing of the initial greeting on mount in `InteractiveFunnel.tsx` and ensure the typing indicator is visible first, then hidden, to satisfy the `Initial Typing Indicator Lifecycle` test.
- Update the greeting text to include the word `"escaneo"` to satisfy the `Validate Greeting Content Persona` test.
- Fix the scroll stability timeout on `#hero-scroll-btn` by using `{ force: true }` in `scrollBtn.click()`.

### R5. EasyPanel Deployment
Commit all changes to GitHub and ensure the build and deployment on EasyPanel are triggered and complete successfully.

## Acceptance Criteria

### Scroll and UI Aesthetics
- [ ] Only one scrollbar (the main viewport scrollbar) is visible. No duplicate scrollbars appear.
- [ ] Scrollbar thumb is customized to be a premium neon-green capsule with a dark track (width: 10-12px).
- [ ] Terminal input receives focus on mount, message updates, and response completion.

### Chat & Graph Node Logic
- [ ] Nodos in NodeGraph only activate when the corresponding tag `[NODE: <id>]` is present in the assistant's message.
- [ ] All tags like `[NODE: ...]` and `[ANALYSIS_COMPLETE]` are completely stripped from the visible text in the chat bubble UI.
- [ ] An initial typing indicator is displayed on page load, followed by the greeting text.

### E2E Testing & Deployment
- [ ] All E2E Playwright tests run and pass without timeout or assertion failures.


## Follow-up — 2026-06-19T14:58:06Z

Diseñar y desarrollar un módulo interactivo en la sección de proyectos de MLSitesLab.AI que presente de forma visual e impactante el caso de éxito de la automatización post-venta desarrollada para Vantrek. La solución debe simular el flujo completo del sistema (Mercado Libre -> Procesamiento de IA -> Base de datos/Sheets -> Notificación/Control en Telegram) para que los leads de la agencia comprendan el valor real del servicio.

Working directory: `/home/mauriciolopez/Documentos/Modelos De Negocios/Web MLSitesLab.AI`
Integrity mode: development

## Asignación de Roles del Equipo
*   **Lucía Fernández (Estratega de Marketing Orgánico & Copywriting):** Responsable de redactar todos los textos del caso de éxito, estructurando la propuesta de valor (ahorro de tiempo, eliminación de errores, atención 24/7) y el viaje del lead.
*   **Tomás (Arquitecto Frontend & UI/UX):** Responsable de diseñar e implementar el simulador interactivo, las micro-animaciones cyberpunk, el layout responsive y los estilos visuales en el componente.
*   **Andrés (Arquitecto de Sistemas):** Responsable de revisar la estructura del código, optimizar componentes y asegurar que no haya regresiones en el flujo general del sitio.

## Requirements

### R1. Estructura Persuasiva del Caso de Éxito (Marketing y Redacción)
Escribir el caso de estudio de Vantrek sin textos genéricos o de relleno (placeholders), enfocado en la conversión de leads:
- **Problema:** Describir el cuello de botella que tenía Vantrek (atención lenta post-venta, errores en entregas y retrasos en facturación en Mercado Libre).
- **Solución:** Explicar el sistema implementado de forma clara y accesible (asistente de IA entrenado, sincronización en tiempo real y alertas de aprobación).
- **Resultados/Métricas (simulados pero realistas):** Destacar el impacto (ej. 95% de mensajes automatizados, tiempo de respuesta < 2 min, 0 errores en planillas).

### R2. Simulador de Flujo Interactivo (Frontend)
Desarrollar un componente interactivo en la sección de portafolio que simule en tiempo real el funcionamiento de la automatización:
- **Disparador:** Un botón destacado que invite al usuario a "Simular Compra" o "Ver Automatización en Acción".
- **Etapa 1 (Entrada):** Mostrar un chat mockup de Mercado Libre donde un cliente ficticio envía un mensaje confuso de post-venta (ej. "Hola, compré pero necesito cambiar la dirección de envío y quiero factura A").
- **Etapa 2 (Cerebro IA):** Mostrar un efecto visual o consola simplificada que simule la "lectura e interpretación de intenciones" por parte de la IA (clasificando en "Acuerdo de Entrega" y "Facturación").
- **Etapa 3 (Acción/Guardado):** Mostrar una representación visual de Google Sheets/Base de datos donde se añade una fila automáticamente con la información extraída.
- **Etapa 4 (Alerta Humana):** Mostrar un mockup de Telegram que reciba el mensaje del bot: "⚠️ Alerta Post-Venta Vantrek: Nacho Pisano solicita cambio de dirección. [Aprobar] [Rechazar]" y que al hacer clic simule completar el proceso con éxito.

### R3. Diseño Visual y Estilos (UI/UX)
- Integrar el nuevo componente y layouts en la sección actual de `Portfolio.tsx` de forma nativa.
- Utilizar la paleta de colores del Design System actual (negros profundos, bordes semitransparentes, detalles y glows en verde neón `--accent-bright`).
- Asegurar que todas las animaciones y transiciones de Framer Motion sean suaves y coherentes con el resto de la web.
- El diseño debe ser 100% responsive (mobile-friendly), reordenando el simulador de forma vertical en pantallas pequeñas.

### R4. Verificación y Calidad de Código
- El proyecto debe compilar correctamente mediante `npm run build` sin errores de compilación de TypeScript o Vite.
- No se deben introducir librerías de diagramación externas a menos que sea estrictamente necesario; se debe priorizar el uso de CSS/SVG nativo y Framer Motion.

## Acceptance Criteria

### Presentación de Contenido
- [ ] No existen textos de relleno ("Lorem Ipsum", "Coming Soon" al 35%, etc.) en la sección de portafolio.
- [ ] Los textos están redactados en español con foco en la conversión de clientes potenciales de MLSitesLab.AI.

### Interactividad del Simulador
- [ ] El botón de simulación activa la secuencia animada de 4 etapas de forma fluida.
- [ ] El usuario puede reiniciar la simulación o interactuar con el botón del mockup de Telegram para finalizar el flujo.
- [ ] Cada etapa de la simulación destaca visualmente (glow, cambio de opacidad o flechas de conexión activas) cuando la información está pasando por ella.

### UI/UX e Integración
- [ ] El simulador se ve perfectamente centrado y escalado tanto en pantallas de escritorio (desktop) como en celulares (mobile).
- [ ] Los colores, tipografías y sombras respetan exactamente las variables de `--bg-dark`, `--accent-bright`, y la estética cyberpunk de la web.

### Robustez Técnica
- [ ] La aplicación web compila sin errores ejecutando `npm run build`.
- [ ] No existen errores o warnings de React en la consola del desarrollador durante la ejecución local de la simulación.

