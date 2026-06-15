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

### Animaciones e Interfaz
- [ ] La web cuenta con al menos 3 animaciones complejas o micro-interacciones (ej. efecto parallax sutil, tarjetas 3D, cursores magnéticos).
- [ ] El diseño mantiene la paleta Dark Green pero con un nivel de pulido profesional superior al estado base.

### Pruebas (Verificación Objetiva)
- [ ] Se ejecuta un script automatizado (ej. Playwright o un script Node con Puppeteer) que navegue la página en resoluciones 375px (Mobile) y 1080px (Desktop), verificando que no existan elementos fuera del viewport horizontal (overflow-x).
- [ ] Se comprueba mediante scripts que todos los botones y enlaces en el DOM son clickeables y no están bloqueados por otros elementos ocultos.

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

