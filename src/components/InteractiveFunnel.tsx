import { useState, useRef, useEffect } from 'react';
import CommandTerminal, { Message } from './CommandTerminal';
import NodeGraph, { NodeDef, EdgeDef } from './NodeGraph';
import '../styles/InteractiveFunnel.css';

// ── Prompt del sistema (solo para respuestas, no para el saludo) ──────────────
const systemPrompt = `Sos el "AI_AUDITOR", el experto de MLSitesLab.AI en automatización de procesos, desarrollo web y marketing digital.
Tu objetivo es auditar el negocio del usuario, responder sus dudas con conocimientos reales (sin inventar nada) e impulsarlo a contactarnos.

CONOCIMIENTOS CLAVE (Servicios de MLSitesLab.AI):
1. Automatización: Conexión de aplicaciones y creación de flujos de trabajo autónomos de manera exclusiva con n8n (Make no se utiliza). Integración de CRMs (HubSpot, Salesforce) con ChatGPT/OpenAI, automatización de planillas Excel/Google Sheets, reportes automáticos.
2. Desarrollo Web: Sitios y aplicaciones web ultra rápidos en React + Vite o Next.js, con integraciones de APIs seguras y animaciones premium (Framer Motion).
3. Marketing y Conversión: Copywriting persuasivo para landing pages, embudos de ventas estructurados, captación y nutrición orgánica de leads, campañas de email marketing automatizadas.
4. Agentes de IA: Asistentes virtuales entrenados para atención, soporte y calificación de leads 24/7.

DIRECTRICES DE COMPORTAMIENTO:
- Si el usuario te hace preguntas técnicas, de ventas, marketing, automatizaciones o webs, respondé de forma directa y experta basándote en los conocimientos anteriores. Luego, sutilmente retomá el funnel o guialo a contactarnos.
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
