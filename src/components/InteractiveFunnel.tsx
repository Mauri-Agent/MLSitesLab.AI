import { useState, useRef, useEffect } from 'react';
import CommandTerminal, { Message } from './CommandTerminal';
import NodeGraph, { NodeDef, EdgeDef } from './NodeGraph';
import '../styles/InteractiveFunnel.css';

// ── Prompt del sistema (solo para respuestas, no para el saludo) ──────────────
const systemPrompt = `Sos el "AI_AUDITOR", el experto de MLSitesLab.AI en automatización de procesos, desarrollo web y marketing digital.
Tu objetivo es auditar el negocio del usuario de forma interactiva y paso a paso.

REGLAS CRÍTICAS DEL FUNNEL Y DE LOS TAGS (SEGURIDAD Y CONTROL DE FLUJO):
1. El funnel se compone de 3 pasos y un diagnóstico final. Debes avanzar de a UN SOLO PASO A LA VEZ en orden secuencial. No te adelantes ni pidas toda la información junta en una sola respuesta.
2. Queda ESTRICTAMENTE PROHIBIDO incluir un tag en tu respuesta si el usuario no ha respondido o provisto información sobre ese paso todavía.
3. Si el usuario te saluda ("hola", "buenas", etc.) o te habla de temas no relacionados (como el clima, saludos vacíos, preguntas externas), responde de forma coherente, educada y conversacional, pero NO incluyas ningún tag del funnel. Vuelve a pedirle amablemente la información del paso actual.
4. Solo debes incluir los tags cuando el usuario te proporcione la información respectiva:
   - Incluí "[NODE: industry]" ÚNICAMENTE en la respuesta después de que el usuario te explique a qué se dedica su negocio o en qué sector opera.
   - Incluí "[NODE: bottleneck]" ÚNICAMENTE en la respuesta después de que el usuario te describa cuál es su cuello de botella, problema o traba principal.
   - Incluí "[NODE: goal]" ÚNICAMENTE en la respuesta después de que el usuario te comente cuál es su objetivo principal (ej. ahorrar tiempo, vender más, automatizar).
   - Incluí "[NODE: solution]" e inmediatamente al final "[ANALYSIS_COMPLETE]" en tu diagnóstico detallado de la propuesta final, SOLO cuando tengas toda la información de los 3 pasos anteriores y te dé el visto bueno para la propuesta.
5. Está estrictamente prohibido incluir más de un tag del tipo [NODE: ...] en un mismo mensaje. Cada tag se debe desbloquear por separado.

CONOCIMIENTOS CLAVE (Servicios de MLSitesLab.AI):
1. Automatización de Procesos: Conexión de sistemas, flujos de trabajo autónomos, sincronización de CRMs y planillas.
2. Desarrollo de Soluciones Web: Sitios y aplicaciones web ultra rápidos, seguros y con diseño premium a medida.
3. Marketing y Conversión: Estrategias de captación de leads, embudos integrados y email marketing automatizado.
4. Agentes de IA: Asistentes virtuales entrenados para atención al cliente y soporte 24/7.

DIRECTRICES DE COMPORTAMIENTO:
- Si el usuario hace preguntas técnicas o de negocio, responde directo y experto enfocándote en los beneficios (ahorro de tiempo, ventas). Luego retoma el paso actual del funnel.
- CTA (Llamado a la acción): Enfatizá que para llevar a cabo estas implementaciones a medida, el usuario debe hacer clic en el botón flotante de WhatsApp (abajo a la derecha) o escribirnos a mlsiteslab.ai@gmail.com.
- Estilo: Cyberpunk/hacker sutil, profesional y conciso. Español uruguayo neutro ("vos", "tu negocio").
- Extensión máxima: 4-5 líneas por mensaje para legibilidad en la terminal.`;

// ── Saludo inicial hardcodeado (con simulación de escritura) ────────────────────────
const GREETING = `⚡ Conexión establecida. Soy el AI_AUDITOR de MLSitesLab.AI.
En los próximos minutos voy a realizar un escaneo de tu negocio y mostrarte exactamente dónde la IA puede generar más impacto.
Contame: ¿a qué se dedica tu empresa y cuál es tu producto o servicio principal?`;

const ALL_NODES: NodeDef[] = [
  { id: 'core',     label: 'Núcleo de Negocio',     cx: 50, cy: 85 },
  { id: 'industry', label: 'Parámetros del Sector',  cx: 20, cy: 55 },
  { id: 'bottleneck', label: 'Cuello de Botella',    cx: 80, cy: 55 },
  { id: 'goal',     label: 'Objetivo Principal',     cx: 50, cy: 35 },
  { id: 'solution', label: 'Plan IA',                cx: 50, cy: 10 },
];

const ALL_EDGES: EdgeDef[] = [
  { id: 'e1', source: 'core',       target: 'industry'   },
  { id: 'e2', source: 'core',       target: 'bottleneck' },
  { id: 'e3', source: 'industry',   target: 'goal'       },
  { id: 'e4', source: 'bottleneck', target: 'goal'       },
  { id: 'e5', source: 'goal',       target: 'solution'   },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

const InteractiveFunnel = () => {
  // Arrancamos con la simulación de escritura del saludo inicial
  const [messages, setMessages] = useState<Message[]>([
    { id: 'sys',      role: 'system',    content: systemPrompt },
  ]);
  const [isTyping, setIsTyping]     = useState(true);
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>(['core']);
  const abortRef = useRef<AbortController | null>(null);

  // Simulación de escritura del saludo inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, { id: 'greeting', role: 'assistant', content: GREETING }]);
      setIsTyping(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Actualizar nodos según progreso del usuario usando tags
  useEffect(() => {
    const nodes = new Set<string>(['core']);
    messages.forEach(msg => {
      if (msg.role !== 'assistant') return;
      const regex = /\[NODE:\s*(\w+)\]/g;
      let match;
      while ((match = regex.exec(msg.content)) !== null) {
        nodes.add(match[1]);
      }
      if (msg.content.includes('[ANALYSIS_COMPLETE]')) {
        nodes.add('solution');
      }
    });
    setActiveNodeIds(Array.from(nodes));
  }, [messages]);

  const fetchAIResponse = async (history: Message[]) => {
    // Cancelar request anterior si existe
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsTyping(true);

    // Timeout de 15 segundos
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5.4-mini',
          messages: history.map(m => ({ role: m.role, content: m.content })),
          temperature: 0.7,
          max_completion_tokens: 300,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices[0].message.content as string;

      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: reply }]);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        setMessages(prev => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: 'ERROR: Tiempo de respuesta agotado. Intentá de nuevo.',
          },
        ]);
      } else {
        console.error('AI fetch error:', err);
        setMessages(prev => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: 'ERROR: No se pudo conectar con el servidor. Intentá en unos segundos.',
          },
        ]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (content: string) => {
    const userMsg: Message = { id: generateId(), role: 'user', content };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    fetchAIResponse(newHistory);
  };

  return (
    <section id="funnel" className="interactive-funnel section">
      <div className="container">
        <div className="section-label">Auditor Inteligente</div>
        <h2 className="text-gradient funnel-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
          Configurá tu Motor de IA
        </h2>

        <div className="funnel-layout">
          <div className="funnel-left">
            <CommandTerminal
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
            />
          </div>
          <div className="funnel-right">
            <NodeGraph
              nodes={ALL_NODES}
              edges={ALL_EDGES}
              activeNodeIds={activeNodeIds}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveFunnel;
