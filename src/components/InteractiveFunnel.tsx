import { useState, useRef, useEffect } from 'react';
import CommandTerminal, { Message } from './CommandTerminal';
import NodeGraph, { NodeDef, EdgeDef } from './NodeGraph';
import '../styles/InteractiveFunnel.css';

// ── Prompt del sistema (solo para respuestas, no para el saludo) ──────────────
const systemPrompt = `Sos el "AI_AUDITOR", un sistema de inteligencia artificial de MLSitesLab.AI especializado en detectar oportunidades de automatización y crecimiento en empresas.

Tono: profesional, directo, con estilo "hacker/cyberpunk" sutil. Usá frases cortas como "Datos recibidos.", "Escaneando...", "Procesando arquitectura...".
Idioma: español uruguayo neutro. Usá "vos", "tu negocio", "tu empresa".

Llevá al visitante por un funnel de 3 pasos, UNA pregunta por vez:
1. ¿A qué se dedica la empresa y cuál es su producto o servicio principal?
2. ¿Cuál es el mayor cuello de botella operativo que les quita tiempo o dinero hoy?
3. ¿Qué resultado concreto querés lograr con IA? (bajar costos, escalar sin contratar más, automatizar atención al cliente, etc.)

Después de las 3 respuestas, generá un diagnóstico breve y una propuesta de solución con IA personalizada. Mencioná que el equipo de MLSitesLab.AI puede implementarla. Finalizá exactamente con "[ANALYSIS_COMPLETE]".

Máximo 3-4 líneas por mensaje. No hagas más de una pregunta a la vez.`;

// ── Saludo inicial hardcodeado (instantáneo, sin API) ────────────────────────
const GREETING = `⚡ Conexión establecida. Soy el AI_AUDITOR de MLSitesLab.AI.
En los próximos minutos voy a analizar tu negocio y mostrarte exactamente dónde la IA puede generar más impacto.
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
  // Arrancamos con el saludo ya en el historial — sin API call
  const [messages, setMessages] = useState<Message[]>([
    { id: 'sys',      role: 'system',    content: systemPrompt },
    { id: 'greeting', role: 'assistant', content: GREETING     },
  ]);
  const [isTyping, setIsTyping]     = useState(false);
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>(['core']);
  const abortRef = useRef<AbortController | null>(null);

  // Actualizar nodos según progreso del usuario
  useEffect(() => {
    const userCount = messages.filter(m => m.role === 'user').length;
    const nodes = ['core'];
    if (userCount >= 1) nodes.push('industry');
    if (userCount >= 2) nodes.push('bottleneck');
    if (userCount >= 3) nodes.push('goal');
    if (messages.some(m => m.content.includes('[ANALYSIS_COMPLETE]'))) {
      nodes.push('solution');
    }
    setActiveNodeIds(nodes);
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
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
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
    <div className="interactive-funnel section container">
      <div className="section-label">Auditor Inteligente</div>
      <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
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
  );
};

export default InteractiveFunnel;
