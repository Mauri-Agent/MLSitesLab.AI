## 2026-06-09T23:12:29Z

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

## 2026-06-09T23:30:30Z

Estimado equipo: El usuario ha aclarado la estructura del layout principal y los requerimientos de diseño de la cabecera.

En lugar de poner el `InteractiveFunnel` (Foto 2) arriba del todo como el nuevo Hero, el usuario desea:
1. Mantener la sección de bienvenida/Hero original (componente `Hero.tsx` / Foto 1 con el título "lo complejo. Potenciamos tu estrategia.", la terminal de estadísticas a la derecha, los botones "Ver Servicios"/"Portfolio" y las tarjetas de stats abajo) arriba de todo, actuando como la cabecera principal (Hero).
2. Colocar el `InteractiveFunnel` (componente `InteractiveFunnel.tsx` / Foto 2, con el chat y el grafo) inmediatamente debajo de esa sección de bienvenida/cabecera (`Hero.tsx`).

He actualizado el archivo `prompt_draft.md` con esta nueva estructura en el requerimiento R2 y en los Acceptance Criteria. Por favor, transmitan esta modificación a todo el equipo de especialistas (Frontend, Marketing, Testing, etc.), actualicen el plan de ejecución (`PROJECT.md`/`TEST_INFRA.md`) y ajusten la implementación consecuentemente.

