import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  AlertTriangle, 
  Clock, 
  Info
} from 'lucide-react';
import '../styles/VantrekLiveDemo.css';

interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  isSystemPrompt?: boolean;
}

interface TelegramAlert {
  id: string;
  userMessage: string;
  suggestedReply: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

const ORDER_ID = '2000169054178';
const PRODUCT_NAME = 'Reflector LED Solar Portátil Vantrek 200W IP65';
const PRODUCT_PRICE = '$18.750';

const SYSTEM_PROMPT = `Eres el asistente de atención al cliente post-venta oficial de nuestra tienda en Mercado Libre Uruguay. Tu objetivo es resolver dudas de los compradores sobre sus pedidos, brindar tranquilidad y ofrecer un servicio impecable. Tu tono de voz debe ser SIEMPRE amigable, empático, profesional y muy servicial, utilizando un estilo uruguayo/rioplatense. Tus respuestas deben ser concisas y resolutivas, evitando rodeos inexplicados, pero manteniendo siempre un tono cálido, cercano y conversacional. No seas frío ni cortante.

INFORMACIÓN DINÁMICA DEL PEDIDO ACTUAL:
- Número de compra/orden: ${ORDER_ID}
- Tipo/Modo de envío de la orden: custom
- Producto comprado: ${PRODUCT_NAME}
- Precio pagado: ${PRODUCT_PRICE}
- Estado del pago: Aprobado
- Estado del envío: Pendiente de entrega

REGLAS SEGÚN EL MODO DE ENVÍO DE LA ORDEN:
- Si el modo de envío es "me2" o "me1", y el cliente pregunta por el número de rastreo, si ya se envió el producto, o tiene cualquier duda o consulta respecto al envío o entrega, tu respuesta debe iniciar OBLIGATORIAMENTE con la etiqueta [HUMAN_REVIEW] al principio de todo (ejemplo: "[HUMAN_REVIEW] Hola, ¿cómo estás? ..."). Está prohibido intentar coordinar el envío o pedir datos adicionales en este caso.
- Si el modo de envío es "custom" o "not_specified", puedes responder y coordinar el envío o retiro directamente sin usar la etiqueta [HUMAN_REVIEW] (a menos que sea por devolución, cambio, artículo dañado, o consulta sobre precios/costos de envío, lo cual sí lleva [HUMAN_REVIEW]). En este caso, tienes permitido solicitar el número de teléfono y dirección de entrega del cliente si no los tienes.

REGLA DE TONO OBLIGATORIA: Tu lenguaje debe ser 100% consistente utilizando el voseo rioplatense/uruguayo de forma educada y cercana (ejemplos: "cómo estás", "tenés", "querés", "llegue a vos", "decime"). Está ESTRICTAMENTE PROHIBIDO alternar con el tuteo (no uses "tienes", "tú", "cuentas") o dirigirte al comprador individual en plural ("ustedes", "necesitan", "tienen").

REGLA DE REVISIÓN HUMANA CRÍTICA (REQUISITO ABSOLUTO):
- Si el cliente solicita una DEVOLUCIÓN de dinero, una DEVOLUCIÓN de producto, un CAMBIO de artículo, si reporta un artículo DAÑADO, DEFECTUOSO o INCORRECTO, o si realiza cualquier consulta sobre PRECIOS, COSTOS o TARIFAS DE ENVÍO (por ejemplo: "cuánto sale el envío", "cuál es el costo del envío", etc.), tu respuesta debe iniciar OBLIGATORIAMENTE con la etiqueta [HUMAN_REVIEW] al principio de todo (ejemplo: "[HUMAN_REVIEW] Hola, ¿cómo estás? ..."). Esta regla es absoluta y prioritaria sobre cualquier otra.

INFORMACIÓN Y POLÍTICAS DE LA TIENDA:
1. Horario de atención humana: Lunes a Viernes de 10:00 a 17:00 hs.
2. Dirección y Retiro en persona:
   - Se permite el retiro de productos en nuestro local físico.
   - La dirección exacta es: Marcelino sosa 2179.
   - IMPORTANTE: Si el cliente pregunta por la dirección, ubicación o cómo retirar su compra, indícale INMEDIATAMENTE la dirección exacta (Marcelino sosa 2179) y los requisitos. NUNCA le digas que revise "Mis Compras" para buscar la dirección. Responde el dato directamente.
   - Requisitos para el retiro: Solicita amablemente el Nombre y Apellido de la persona que retira. NUNCA le pidas el número de compra o número de orden al cliente, ya que el número de compra ya lo conoces (es el ${ORDER_ID}).
3. Productos dañados, incorrectos o defectuosos:
   - Si el artículo llegó diferente, dañado o defectuoso, NO intentes resolver el problema, NO sugieras soluciones, NO hagas preguntas, ni pidas fotos. Este caso requiere revisión humana obligatoria, por lo que debes derivar la consulta de inmediato iniciando tu respuesta con la etiqueta [HUMAN_REVIEW].
4. Cambios y Devoluciones:
   - Si el cliente solicita una devolución o un cambio de producto, NO intentes resolver el problema. Este caso requiere revisión humana obligatoria, por lo que debes derivar la consulta de inmediato iniciando tu respuesta con la etiqueta [HUMAN_REVIEW].
5. Cancelaciones:
   - Si el cliente solicita cancelar la compra antes de recibirla, indícale de forma amable que puede gestionarlo directamente desde "Mis Compras" en Mercado Libre (aclárale que no es una gestión urgente, pero que puede hacerlo él mismo).
6. Flujo de Envío Especial (Acuerdo de Entrega) para modos "custom" o "not_specified":
   - Si el modo de envío es "custom" o "not_specified", y además el cliente solicita que se lo envíen a su domicilio/casa:
     - Debes solicitarle amablemente su dirección de entrega exacta y su número de teléfono.
     - Una vez que tengas los datos completos de retiro o envío (Nombre y Apellido de la persona, y de ser aplicable, dirección y teléfono), debes registrar esta información simulando la herramienta "Acuerdo De Entrega". Para registrarla, añade la etiqueta [TOOL:ACUERDO_ENTREGA] al final de tu mensaje.
7. Flujo de Solicitud de Factura con RUT (Facturación):
   - Si el cliente solicita una factura o factura con RUT:
     - Debes pedirle de manera amable el nombre de la Razón Social y el número de RUT del comprador.
     - Una vez que tengas ambos datos completos (Razón Social y RUT), debes registrar esta información simulando la herramienta "Facturacion". Para registrarla, añade la etiqueta [TOOL:FACTURACION] al final de tu mensaje.
8. Consultas sobre Envíos y Rastreo:
   - Si el modo de envío es "me2" o "me1" y el cliente pregunta por el número de rastreo, si ya se envió el producto o tiene cualquier duda o consulta respecto al envío de su producto, NO intentes responder con los datos de la orden. Este caso requiere revisión humana obligatoria, por lo que debes derivar la consulta de inmediato iniciando tu respuesta con la etiqueta [HUMAN_REVIEW].
   - Si el modo de envío es "custom" o "not_specified", puedes gestionar la consulta de envío y coordinar la entrega o retiro tú mismo sin derivar a revisión humana (siempre y cuando no sea una consulta de costos o precios de envío, en cuyo caso sí debe ir a revisión humana).

REGLAS CRÍTICAS DE SEGURIDAD Y POLÍTICAS (SI ROMPES ALGUNA, CERRARÁN NUESTRA TIENDA):
1. NUNCA escribas ni compartas números de teléfono de contacto nuestros, correos electrónicos, links de WhatsApp, redes sociales ni páginas web externas. Está estrictamente prohibido pedir el teléfono del cliente excepto cuando el modo de envío es "custom" o "not_specified", en cuyo caso se te permite de forma exclusiva solicitar su número de teléfono y dirección para coordinar la entrega. La dirección física del local (Marcelino sosa 2179) SOLO se permite compartir si el cliente pregunta o indica explícitamente sobre el retiro o dirección de retiro.
2. NUNCA sugieras al cliente comunicarse "por fuera" de la plataforma de Mercado Libre. Toda la gestión (envíos, garantías, facturas) debe hacerse por este medio.
3. NUNCA le pidas al cliente que cancele un reclamo o mediación antes de haber resuelto su problema real.
4. Si el cliente solicita una devolución, un cambio de producto, presenta un reclamo grave, consulta sobre precios o costos de envío, o (si el envío es "me2" o "me1") pregunta por el número de rastreo, si ya se envió el producto o tiene dudas sobre el envío, añade obligatoriamente el prefijo [HUMAN_REVIEW] al inicio de tu respuesta para que el equipo humano apruebe o edite tu mensaje antes de ser enviado.
5. No ofrezcas compensaciones económicas, reembolsos automáticos ni descuentos. Para reclamos o problemas de artículos defectuosos o diferentes, el bot debe notificar al equipo humano para revisarlo.

CONTEXTO DE ESTA CONVERSACIÓN:
- Esta es una simulación interactiva en la página web de MLSitesLab.AI. El comprador "Mateo Silva" es un visitante de la web probando la inteligencia del sistema. Responde de forma muy natural y realista.
- ¿DEBES INCLUIR SALUDO INICIAL EN ESTA RESPUESTA? Si es la primera interacción, sí. En las respuestas siguientes, no.`;

const GREETING = `¡Hola! 👋 Soy el asistente de IA de Vantrek y atiendo el servicio de post-venta de Mercado Libre las 24 horas, los 7 días de la semana.

Estás interactuando con una simulación real de cómo atiendo a los clientes de Vantrek en Mercado Libre. Tu pedido es un **Reflector LED Solar Portátil Vantrek 200W IP65** por **$18.750** (Orden #${ORDER_ID}).

¡Preguntame lo que necesites! Probá escribir cosas como:
• "Quiero retirar mi compra"
• "Necesito factura con RUT"
• "El producto me llegó roto"`;

const SUGGESTIONS = [
  "Quiero retirar mi compra",
  "Necesito factura con RUT",
  "El producto me llegó roto"
];

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function VantrekLiveDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'system', role: 'system', content: SYSTEM_PROMPT, isSystemPrompt: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [vibratePhone, setVibratePhone] = useState(false);
  
  // Simulated tools log
  const [sheetsLogs, setSheetsLogs] = useState<{ id: string; action: string; time: string; status: string }[]>([
    { id: '1', action: 'Pedido Creado en Mercado Libre', time: '12:00', status: 'Aprobado' }
  ]);

  // Telegram Alerts State
  const [tgAlerts, setTgAlerts] = useState<TelegramAlert[]>([]);

  const chatAreaRef = useRef<HTMLDivElement>(null);
  const phoneBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of chat area without page viewport jumping
  useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus the text input whenever typing ends or messages change
  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [messages, isTyping]);

  useEffect(() => {
    phoneBodyRef.current?.scrollTo({
      top: phoneBodyRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [tgAlerts]);

  // Initial bot greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, { id: 'greeting', role: 'assistant', content: GREETING }]);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: generateId(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Build api request payload
    const updatedHistory = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5.4-mini',
          messages: updatedHistory,
          temperature: 0.7,
          max_completion_tokens: 300,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error API: ${res.status}`);
      }

      const data = await res.json();
      let reply = data.choices[0].message.content as string;

      // Handle custom tools simulations in the prompt
      let detectedTool = '';
      if (reply.includes('[TOOL:ACUERDO_ENTREGA]')) {
        detectedTool = 'acuerdo_entrega';
        reply = reply.replace('[TOOL:ACUERDO_ENTREGA]', '').trim();
      } else if (reply.includes('[TOOL:FACTURACION]')) {
        detectedTool = 'facturacion';
        reply = reply.replace('[TOOL:FACTURACION]', '').trim();
      }

      // Check if it triggered human review
      if (reply.startsWith('[HUMAN_REVIEW]')) {
        const cleanedReply = reply.replace('[HUMAN_REVIEW]', '').trim();

        // 1. Show the bot's auto-message in ML chat ("Aguardame...")
        setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: cleanedReply }]);

        // 2. Escalate to Telegram phone mockup
        const alertId = generateId();
        const newAlert: TelegramAlert = {
          id: alertId,
          userMessage: text,
          suggestedReply: cleanedReply,
          status: 'pending',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setTgAlerts(prev => [...prev, newAlert]);

        // Trigger phone vibration
        setVibratePhone(true);
        setTimeout(() => setVibratePhone(false), 600);

        // Log Sheets state
        setSheetsLogs(prev => [
          ...prev, 
          { id: generateId(), action: 'Derivación por IA a Soporte Humano', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Pendiente' }
        ]);
      } else {
        // Normal response
        setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: reply }]);

        // Process mock tools logging to sheets
        if (detectedTool === 'acuerdo_entrega') {
          setSheetsLogs(prev => [
            ...prev,
            { id: generateId(), action: 'Registro Acuerdo de Entrega (Sheets)', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Completado' }
          ]);
        } else if (detectedTool === 'facturacion') {
          setSheetsLogs(prev => [
            ...prev,
            { id: generateId(), action: 'Registro Facturación RUT (Sheets)', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Completado' }
          ]);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { id: generateId(), role: 'assistant', content: '⚠️ Error de comunicación. Asegúrate de tener conexión y de configurar la API key en tu panel.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApproveAlert = (alertId: string) => {
    setTgAlerts(prev =>
      prev.map(alert => (alert.id === alertId ? { ...alert, status: 'approved' } : alert))
    );
    
    // Simulate human response in chat
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          id: generateId(), 
          role: 'assistant', 
          content: '🧑‍💻 *[Operador de Vantrek]:* Hola Mateo, ya revisamos tu solicitud. Aprobamos el cambio. Nos comunicaremos contigo si necesitamos algún detalle adicional. ¡Muchas gracias!' 
        }
      ]);

      setSheetsLogs(prev => [
        ...prev,
        { id: generateId(), action: 'Cambio Aprobado por Humano (Sheets)', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Aprobado' }
      ]);
    }, 1000);
  };

  const handleRejectAlert = (alertId: string) => {
    setTgAlerts(prev =>
      prev.map(alert => (alert.id === alertId ? { ...alert, status: 'rejected' } : alert))
    );

    // Simulate human rejection in chat
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          id: generateId(), 
          role: 'assistant', 
          content: '🧑‍💻 *[Operador de Vantrek]:* Hola Mateo. Lamentablemente no podemos procesar tu última solicitud en este momento por políticas de envío de Mercado Libre. Por favor dinos si podemos ayudarte con algo más.' 
        }
      ]);

      setSheetsLogs(prev => [
        ...prev,
        { id: generateId(), action: 'Cambio Rechazado por Humano (Sheets)', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Rechazado' }
      ]);
    }, 1000);
  };

  const handleClearChat = () => {
    setMessages([{ id: 'system', role: 'system', content: SYSTEM_PROMPT, isSystemPrompt: true }]);
    setTgAlerts([]);
    setSheetsLogs([{ id: '1', action: 'Pedido Creado en Mercado Libre', time: '12:00', status: 'Aprobado' }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { id: 'greeting', role: 'assistant', content: GREETING }]);
    }, 500);
  };

  return (
    <div className="vantrek-live-demo vantrek-simulator-container">
      <div className="demo-header-info">
        <div className="status-label">
          <span className="live-dot" />
          <span>SIMULACIÓN CON IA REAL DEL ASISTENTE DE VANTREK</span>
        </div>
        <button className="reset-demo-btn" onClick={handleClearChat}>
          Reiniciar Demo
        </button>
      </div>

      <div className="demo-panels">
        {/* LEFT PANEL: Mercado Libre Chat Mockup */}
        <div className="ml-panel">
          <div className="ml-panel-header">
            <div className="ml-logo-badge">VANTREK</div>
            <div className="ml-order-details">
              <span className="order-title">Detalle de Compra #${ORDER_ID}</span>
              <span className="order-buyer">Comprador: Mateo Silva</span>
            </div>
            <div className="order-status-badge">Pago Aprobado</div>
          </div>

          <div className="ml-product-strip">
            <div className="product-info-icon">
              <Info size={16} />
            </div>
            <div className="product-strip-text">
              <strong>Articulo:</strong> {PRODUCT_NAME} | <strong>Precio:</strong> {PRODUCT_PRICE}
            </div>
          </div>

          <div className="ml-chat-area" ref={chatAreaRef}>
            {messages.filter(m => !m.isSystemPrompt).map((msg) => (
              <div 
                key={msg.id} 
                className={`ml-chat-bubble-wrapper ${msg.role === 'user' ? 'user-align' : 'bot-align'}`}
              >
                <div className={`ml-chat-bubble ${msg.role === 'user' ? 'user-style' : 'bot-style'}`}>
                  {/* Parse markdown-like syntax for the simulated operator */}
                  {msg.content.includes('*[Operador') ? (
                    <div className="operator-msg">
                      <span className="operator-tag">🧑‍💻 Operador Vantrek</span>
                      <p>{msg.content.replace(/\*\[Operador de Vantrek\]:\*/g, '').trim()}</p>
                    </div>
                  ) : (
                    <div className="text-content">
                      {msg.content.split('\n').map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}
                  <span className="bubble-time-stamp">
                    {msg.role === 'user' ? 'Enviado' : 'Asistente'}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ml-chat-bubble-wrapper bot-align">
                <div className="ml-chat-bubble bot-style typing-bubble">
                  <div className="typing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ml-quick-suggestions">
            <span className="quick-label">Sugerencias:</span>
            <div className="suggestions-list">
              {SUGGESTIONS.map((sug, idx) => (
                <button 
                  key={idx} 
                  className="sug-btn" 
                  onClick={() => handleSendMessage(sug)}
                  disabled={isTyping}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <form 
            className="ml-input-area" 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Escribe un mensaje de prueba al asistente de Vantrek..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="send-btn" disabled={!inputText.trim() || isTyping}>
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Telegram Mobile Mockup */}
        <div className="tg-phone-panel">
          <div className={`phone-frame ${vibratePhone ? 'vibrate-anim' : ''}`}>
            <div className="phone-notch" />
            <div className="phone-status-bar">
              <span className="time">12:01</span>
              <div className="icons">
                <span className="wifi">📶</span>
                <span className="battery">🔋 98%</span>
              </div>
            </div>

            <div className="tg-app-header">
              <div className="tg-back">◀</div>
              <div className="tg-info">
                <span className="tg-bot-name">Vantrek Operations Bot</span>
                <span className="tg-bot-status">bot</span>
              </div>
              <div className="tg-menu">⋮</div>
            </div>

            <div className="tg-app-body" ref={phoneBodyRef}>
              <div className="tg-chat-date">Hoy</div>
              
              <div className="tg-system-msg">
                🤖 Sistema de Notificación de Alertas Post-Venta Vantrek v1.4
              </div>

              {tgAlerts.length === 0 ? (
                <div className="tg-empty-state">
                  <Clock size={32} className="clock-icon" />
                  <p>Esperando alertas...</p>
                  <span>Cuando simules una consulta de devolución, cambio o rotura, el bot escalará el caso aquí.</span>
                </div>
              ) : (
                tgAlerts.map((alert) => (
                  <div key={alert.id} className="tg-alert-bubble">
                    <div className="tg-alert-header">
                      <AlertTriangle size={14} className="warning-icon" />
                      <span>🔔 ALERTA DE HUMAN_REVIEW</span>
                    </div>

                    <div className="tg-alert-content">
                      <div className="alert-item">
                        <span className="label">Comprador:</span>
                        <span className="value">Mateo Silva</span>
                      </div>
                      <div className="alert-item">
                        <span className="label">Orden:</span>
                        <span className="value">#{ORDER_ID}</span>
                      </div>
                      <div className="alert-item">
                        <span className="label">Mensaje Cliente:</span>
                        <span className="value font-italic">"{alert.userMessage}"</span>
                      </div>
                      <div className="alert-item">
                        <span className="label">Respuesta del Bot:</span>
                        <span className="value bot-suggested">"{alert.suggestedReply}"</span>
                      </div>
                    </div>

                    {alert.status === 'pending' ? (
                      <div className="tg-alert-actions">
                        <button className="approve-action-btn" onClick={() => handleApproveAlert(alert.id)}>
                          Aprobar
                        </button>
                        <button className="reject-action-btn" onClick={() => handleRejectAlert(alert.id)}>
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <div className="tg-action-result">
                        {alert.status === 'approved' ? (
                          <span className="result-badge approved-badge">✓ Aprobado e Integrado</span>
                        ) : (
                          <span className="result-badge rejected-badge">✗ Rechazado / Ignorado</span>
                        )}
                      </div>
                    )}
                    <span className="tg-time">{alert.timestamp}</span>
                  </div>
                ))
              )}
            </div>

            <div className="phone-home-bar" />
          </div>

          {/* Real-time Google Sheets database updates */}
          <div className="simulated-db-status">
            <span className="db-title">Base de Datos de Despacho (Sheets):</span>
            <div className="db-logs">
              {sheetsLogs.map((log) => (
                <div key={log.id} className="db-log-row">
                  <span className="log-time font-mono">[{log.time}]</span>
                  <span className="log-action">{log.action}</span>
                  <span className={`log-status ${log.status.toLowerCase()}`}>{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
