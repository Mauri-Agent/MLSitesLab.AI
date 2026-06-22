import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import VantrekLiveDemo from './VantrekLiveDemo';

interface VantrekCaseStudyProps {
  navigate: (path: string) => void;
}

export default function VantrekCaseStudy({ navigate }: VantrekCaseStudyProps) {
  return (
    <motion.div
      className="case-study-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container case-study-container">
        {/* Back Link */}
        <div className="back-link-wrapper">
          <button
            onClick={() => navigate('/')}
            className="back-btn"
            id="case-study-back-btn"
            aria-label="Volver al inicio"
          >
            <ArrowLeft size={16} />
            <span>Volver al inicio</span>
          </button>
        </div>

        {/* Header */}
        <div className="case-study-header">
          <span className="section-label">Caso de Estudio</span>
          <h1 className="case-study-title">Automatización Post-Venta Vantrek</h1>
          <p className="case-study-subtitle">
            Un motor inteligente que integra Mercado Libre, agentes de IA, Google Sheets y Telegram para eliminar el soporte post-venta manual.
          </p>
        </div>

        {/* Live Demo Area (Full Width) */}
        <VantrekLiveDemo />

        {/* Case Study Content Cards (3-Column Grid Below) */}
        <div className="case-study-cards-grid">
          {/* El Problema */}
          <div className="case-card problem">
            <div className="case-card-header">
              <AlertCircle className="icon-problem" size={20} />
              <h3>El Problema: El cuello de botella de la post-venta</h3>
            </div>
            <p>
              Vantrek, una empresa líder en ventas de Mercado Libre con alto volumen transaccional, se enfrentaba a un obstáculo invisible que limitaba su crecimiento: <strong>el soporte post-venta</strong>.
            </p>
            <p>
              Cada venta abre un canal de comunicación. Diariamente, cientos de compradores enviaban consultas críticas de forma desorganizada inmediatamente después de comprar:
            </p>
            <ul className="case-list">
              <li><span>⚠️</span> <em>"Necesito cambiar la dirección de entrega porque me equivoqué."</em></li>
              <li><span>⚠️</span> <em>"Quiero factura A, acá te dejo mi CUIT."</em></li>
              <li><span>⚠️</span> <em>"¿Cuándo llega mi pedido?"</em></li>
            </ul>
            <p className="case-impact">
              <strong>Consecuencias operativas:</strong> El equipo pasaba de 4 a 6 horas diarias copiando y pegando datos manualmente de Mercado Libre a planillas de despacho, respuestas demoradas hasta por 12 horas, y errores humanos de envío y demoras en facturación.
            </p>
          </div>

          {/* La Solución */}
          <div className="case-card solution">
            <div className="case-card-header">
              <Sparkles className="icon-solution" size={20} />
              <h3>La Solución: El Motor Post-Venta Autónomo</h3>
            </div>
            <p>
              Diseñamos e implementamos un ecosistema de automatización integrado a las APIs de Mercado Libre, impulsado por agentes de Inteligencia Artificial y flujos de trabajo autónomos:
            </p>
            <ul className="case-list">
              <li><span>✓</span> <strong>Sincronización en tiempo real:</strong> Captura inmediata de cada mensaje post-venta en Mercado Libre.</li>
              <li><span>✓</span> <strong>Cerebro de Clasificación de IA (NLP):</strong> Un asistente entrenado para clasificar intenciones y extraer datos (direcciones modificadas, CUITs) con un 98% de precisión.</li>
              <li><span>✓</span> <strong>Auto-registro estructurado:</strong> Inserción automática de datos del cliente en Google Sheets de despacho consolidada.</li>
              <li><span>✓</span> <strong>Alertas de Aprobación Humana (Telegram Bot):</strong> Para cambios críticos, el bot envía una alerta con botones interactivos de <code>[Aprobar]</code> y <code>[Rechazar]</code>. Al aprobar, los datos se actualizan y se confirma al cliente al instante.</li>
            </ul>
          </div>

          {/* Métricas e Impacto */}
          <div className="case-card metrics">
            <div className="case-card-header">
              <TrendingUp className="icon-metrics" size={20} />
              <h3>Resultados e Impacto (Métricas Reales)</h3>
            </div>
            <div className="metrics-grid">
              <div className="metric-box">
                <span className="metric-num">95%</span>
                <span className="metric-lbl">Mensajes Automatizados</span>
              </div>
              <div className="metric-box">
                <span className="metric-num">&lt; 2 min</span>
                <span className="metric-lbl">Tiempo de Respuesta</span>
              </div>
              <div className="metric-box">
                <span className="metric-num">0</span>
                <span className="metric-lbl">Errores de Planillas</span>
              </div>
              <div className="metric-box">
                <span className="metric-num">30+ hs</span>
                <span className="metric-lbl">Recuperadas Semanales</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
