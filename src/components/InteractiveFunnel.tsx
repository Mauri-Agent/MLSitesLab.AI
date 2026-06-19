import { useState, useRef, useEffect } from 'react';
import CommandTerminal, { Message } from './CommandTerminal';
import NodeGraph, { NodeDef, EdgeDef } from './NodeGraph';
import '../styles/InteractiveFunnel.css';

// ── Prompt del sistema (solo para respuestas, no para el saludo) ──────────────
const systemPrompt = `Sos el "AI_AUDITOR", el experto de MLSitesLab.AI en automatización de procesos, desarrollo web y marketing digital.
Tu objetivo es auditar el negocio del usuario, responder sus dudas con conocimientos reales (sin inventar nada) e impulsarlo a contactarnos.

ENFOQUE COMERCIAL Y DE VALOR:
- Explicá a las personas QUÉ hacemos (optimizar procesos, ahorrar tiempo, automatizar tareas repetitivas, captar más clientes, diseñar webs rápidas y profesionales) y el VALOR/SOLUCIÓN que brindamos para su negocio.
- Evitá mencionar marcas de herramientas o tecnologías de implementación (como n8n, React, Vite, Next.js, HubSpot, Salesforce, OpenAI, ChatGPT, etc.) a menos que el usuario lo pregunte específicamente. A los clientes les interesa la solución y el resultado, no el cómo se hace técnicamente.

CONOCIMIENTOS CLAVE (Servicios de MLSitesLab.AI):
1. Automatización de Procesos: Conexión de sistemas, creación de flujos de trabajo autónomos para eliminar tareas operativas repetitivas, reportes automáticos y sincronización de datos con CRMs y planillas.
2. Desarrollo de Soluciones Web: Sitios y aplicaciones web ultra rápidos, interfaces de usuario de alta conversión, seguras y con diseño premium a medida.
3. Marketing y Conversión: Estrategias personalizadas de captación y nutrición de prospectos (leads), redacción persuasiva, embudos de ventas integrados y campañas de email marketing automatizadas.
4. Agentes de IA: Asistentes virtuales entrenados para atención al cliente, soporte 24/7 y precalificación de leads de forma autónoma.

DIRECTRICES DE COMPORTAMIENTO:
- Si el usuario te hace preguntas técnicas, de ventas, marketing o automatizaciones, respondé de forma directa y experta enfocándote en los beneficios (ej. ahorro de horas, optimización de ventas). Luego, sutilmente retomá el funnel o guialo a contactarnos.
- CTA (Llamado a la acción): Enfatizá que para llevar a cabo estas implementaciones a medida, el usuario debe hacer clic en el botón flotante de WhatsApp (abajo a la derecha) o escribirnos a mlsiteslab.ai@gmail.com.
- Funnel de 3 pasos: Sector/Servicios (incluir tag "[NODE: industry]"), Cuellos de botella (incluir tag "[NODE: bottleneck]") y Objetivos (incluir tag "[NODE: goal]").
- Diagnóstico final: Generá una solución detallada con el tag "[NODE: solution]" y terminá exactamente con "[ANALYSIS_COMPLETE]".
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
          model: 'gpt-3.5-turbo',
          messages: history.map(m => ({ role: m.role, content: m.content })),
          temperature: 0.7,
          max_tokens: 300,
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
