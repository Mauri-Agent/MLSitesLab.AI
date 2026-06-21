import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Cpu, 
  Database, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight,
  Check
} from 'lucide-react';
import '../styles/VantrekSimulator.css';

// Definition of the simulation steps
interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export default function VantrekSimulator() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [step1Processed, setStep1Processed] = useState<boolean>(false);
  
  // Step 2 AI scanning state
  const [step2Scanning, setStep2Scanning] = useState<boolean>(false);
  const [step2Completed, setStep2Completed] = useState<boolean>(false);
  
  // Step 3 Google Sheets row animation state
  const [step3RowAdded, setStep3RowAdded] = useState<boolean>(false);
  
  // Step 4 Telegram state: 'pending' | 'approved' | 'rejected'
  const [telegramState, setTelegramState] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [sheetsRowState, setSheetsRowState] = useState<'Pendiente' | 'Aprobado' | 'Rechazado'>('Pendiente');

  // Trigger step 2 scanning when user enters step 2
  useEffect(() => {
    if (currentStep === 2) {
      if (!step2Completed) {
        setStep2Scanning(true);
        const timer = setTimeout(() => {
          setStep2Scanning(false);
          setStep2Completed(true);
        }, 1800); // 1.8s scan animation
        return () => {
          clearTimeout(timer);
          setStep2Scanning(false);
        };
      }
    }
  }, [currentStep, step2Completed]);

  // Trigger step 3 row addition animation when user enters step 3
  useEffect(() => {
    if (currentStep === 3) {
      const timer = setTimeout(() => {
        setStep3RowAdded(true);
      }, 400); // Small delay to let the grid render first
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Restart the simulation
  const handleRestart = () => {
    setCurrentStep(1);
    setStep1Processed(false);
    setStep2Scanning(false);
    setStep2Completed(false);
    setStep3RowAdded(false);
    setTelegramState('pending');
    setSheetsRowState('Pendiente');
  };

  // Move to next step manually
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Move to previous step manually
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Step 1: Procesar con IA action
  const handleProcessIA = () => {
    setStep1Processed(true);
    setCurrentStep(2);
  };

  // Step 4: Approved/Rejected Actions
  const handleApprove = () => {
    setTelegramState('approved');
    setSheetsRowState('Aprobado');
  };

  const handleReject = () => {
    setTelegramState('rejected');
    setSheetsRowState('Rechazado');
  };

  const steps: Step[] = [
    { 
      id: 1, 
      title: "1. Entrada", 
      subtitle: "Chat Mercado Libre", 
      icon: <MessageSquare size={18} /> 
    },
    { 
      id: 2, 
      title: "2. Cerebro IA", 
      subtitle: "Análisis Semántico", 
      icon: <Cpu size={18} /> 
    },
    { 
      id: 3, 
      title: "3. Acción/Guardado", 
      subtitle: "Google Sheets", 
      icon: <Database size={18} /> 
    },
    { 
      id: 4, 
      title: "4. Alerta Humana", 
      subtitle: "Telegram Bot", 
      icon: <Send size={18} /> 
    }
  ];

  return (
    <div className="vantrek-simulator-container">
      {/* Header Controller */}
      <div className="simulator-header">
        <div className="status-indicator">
          <span className={`status-dot ${currentStep === 4 && telegramState === 'approved' ? 'success' : 'active'}`} />
          <span className="status-text">
            {currentStep === 4 && telegramState === 'approved' 
              ? 'SIMULACIÓN COMPLETADA ✓' 
              : `PROCESANDO ETAPA ${currentStep}/4`}
          </span>
        </div>
        <button className="restart-btn" onClick={handleRestart} title="Reiniciar Simulación">
          <RefreshCw size={14} />
          <span>Reiniciar</span>
        </button>
      </div>

      <div className="simulator-layout">
        {/* Sidebar Console (Desktop only) */}
        <div className="simulator-sidebar">
          <div className="console-title-wrap">
            <span className="console-title">VANTREK PROCESS DEBUGGER</span>
          </div>
          <div className="sidebar-steps">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;
              
              return (
                <button
                  key={step.id}
                  className={`sidebar-step-item ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className="step-icon-badge">
                    {step.icon}
                  </div>
                  <div className="step-text-content">
                    <span className="step-item-title">{step.title}</span>
                    <span className="step-item-sub">{step.subtitle}</span>
                  </div>
                  {isPast && (
                    <div className="step-success-check">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="console-logs">
            <div className="log-line header">&gt;_ SISTEMA OPERATIVO VANTREK:</div>
            {currentStep >= 1 && (
              <div className="log-line success">&gt; Conexión con webhook ML activa.</div>
            )}
            {currentStep >= 2 && (
              <div className="log-line">
                {step2Scanning 
                  ? '> ESCANEANDO: Analizando mensaje entrante...' 
                  : '> NLP: Clasificación e intenciones identificadas.'}
              </div>
            )}
            {currentStep >= 3 && (
              <div className="log-line">
                {step3RowAdded 
                  ? '> SHEETS: Fila Nacho Pisano insertada con éxito.' 
                  : '> SHEETS: Conectando con Google Sheets API...'}
              </div>
            )}
            {currentStep >= 4 && (
              <div className="log-line warning">
                {telegramState === 'pending' && '> TELEGRAM: Pendiente de aprobación manual.'}
                {telegramState === 'approved' && '> TELEGRAM: Estado cambiado a APROBADO. Actualizando Sheets.'}
                {telegramState === 'rejected' && '> TELEGRAM: Estado cambiado a RECHAZADO. Cancelando flujo.'}
              </div>
            )}
          </div>
        </div>

        {/* Mockup Output Area */}
        <div className="simulator-display">
          {/* Mobile top stepper */}
          <div className="mobile-steppers">
            {steps.map((step) => (
              <button 
                key={step.id} 
                className={`mobile-step-tab ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'past' : ''}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className="mobile-step-num">
                  {currentStep > step.id ? <Check size={12} /> : step.id}
                </div>
                <span>{step.subtitle.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Step Panel Wrapper with transition */}
          <div className="display-panel-content">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="mockup-panel ml-chat-mockup"
                >
                  <div className="ml-header">
                    <div className="ml-avatar">NP</div>
                    <div className="ml-header-info">
                      <span className="ml-username">Nacho Pisano</span>
                      <span className="ml-order-id">Detalle de Venta #2000109482</span>
                    </div>
                    <div className="ml-badge-status">Pago Aprobado</div>
                  </div>

                  <div className="ml-chat-body">
                    <div className="chat-date">19 de Junio de 2026</div>
                    
                    {/* Auto message from seller */}
                    <div className="chat-bubble seller">
                      <div className="bubble-content">
                        ¡Hola Nacho! Gracias por tu compra. Procesaremos tu pedido a la brevedad. Si necesitás Factura A o hacer algún cambio, avisanos por acá.
                      </div>
                      <span className="bubble-time">12:00</span>
                    </div>

                    {/* Buyer Message */}
                    <div className="chat-bubble buyer">
                      <div className="bubble-content">
                        Hola, compré pero necesito cambiar la dirección de envío y quiero factura A
                      </div>
                      <span className="bubble-time">12:01</span>
                    </div>
                  </div>

                  <div className="ml-chat-footer">
                    <motion.button 
                      className="btn-process-ia"
                      onClick={handleProcessIA}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Cpu size={16} />
                      <span>Procesar con IA</span>
                      <span className="btn-glow" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="mockup-panel ai-brain-mockup"
                >
                  <div className="brain-header">
                    <Cpu size={16} className="pulse-icon" />
                    <span>PROCESAMIENTO COGNITIVO NLP (CEREBRO IA)</span>
                  </div>

                  <div className="brain-body">
                    {/* Original Message to Scan */}
                    <div className="scan-text-container">
                      <span className="scan-label">TEXTO ORIGINAL RECIBIDO:</span>
                      <div className="scan-text-box">
                        "Hola, compré pero necesito cambiar la dirección de envío y quiero factura A"
                        {step2Scanning && (
                          <motion.div 
                            className="scan-line"
                            animate={{ y: ["0%", "100%", "0%"] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Intent Extraction cards */}
                    <div className="extraction-grid">
                      {/* Intent 1 */}
                      <motion.div 
                        className="extraction-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: step2Scanning ? 0.3 : 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="card-header">
                          <span className="intent-badge delivery">Entrega / Dirección</span>
                          <span className="intent-confidence text-success">99% Confianza</span>
                        </div>
                        <div className="card-body">
                          <div className="card-field">
                            <span className="field-label">Fragmento:</span>
                            <span className="field-value">"...cambiar la dirección de envío..."</span>
                          </div>
                          <div className="card-field">
                            <span className="field-label">Acción:</span>
                            <span className="field-value text-accent">Detectado cambio de dirección de despacho.</span>
                          </div>
                        </div>
                        <div className="confidence-bar-track">
                          <motion.div 
                            className="confidence-bar-fill success"
                            initial={{ width: 0 }}
                            animate={{ width: step2Scanning ? 0 : "99%" }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </motion.div>

                      {/* Intent 2 */}
                      <motion.div 
                        className="extraction-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: step2Scanning ? 0.3 : 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="card-header">
                          <span className="intent-badge billing">Facturación</span>
                          <span className="intent-confidence text-success">98% Confianza</span>
                        </div>
                        <div className="card-body">
                          <div className="card-field">
                            <span className="field-label">Fragmento:</span>
                            <span className="field-value">"...quiero factura A..."</span>
                          </div>
                          <div className="card-field">
                            <span className="field-label">Acción:</span>
                            <span className="field-value text-accent">Modo Factura A activado. Solicitar CUIT.</span>
                          </div>
                        </div>
                        <div className="confidence-bar-track">
                          <motion.div 
                            className="confidence-bar-fill success"
                            initial={{ width: 0 }}
                            animate={{ width: step2Scanning ? 0 : "98%" }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </motion.div>
                    </div>

                    {!step2Scanning && step2Completed && (
                      <div className="brain-footer-action">
                        <span className="scan-success-msg">✓ Intenciones clasificadas correctamente</span>
                        <button className="btn-next-step" onClick={handleNext}>
                          <span>Registrar en Sheets</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="mockup-panel sheets-mockup"
                >
                  <div className="sheets-header">
                    <div className="sheets-icon-bg">
                      <Database size={14} />
                    </div>
                    <span>Planilla de Operaciones Vantrek — Google Sheets</span>
                  </div>

                  <div className="sheets-body">
                    <div className="sheets-grid-wrapper">
                      <table className="sheets-table">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Producto</th>
                            <th>Dirección de Envío</th>
                            <th>Facturación</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Animated inserted row */}
                          <AnimatePresence>
                            {step3RowAdded && (
                              <motion.tr
                                key="nacho-row"
                                initial={{ opacity: 0, y: -20, backgroundColor: 'rgba(15, 203, 84, 0.15)' }}
                                animate={{ 
                                  opacity: 1, 
                                  y: 0,
                                  backgroundColor: sheetsRowState === 'Aprobado' 
                                    ? 'rgba(15, 203, 84, 0.05)' 
                                    : sheetsRowState === 'Rechazado' 
                                      ? 'rgba(255, 95, 86, 0.05)'
                                      : 'rgba(255, 255, 255, 0.01)'
                                }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className={`sheets-row row-added ${sheetsRowState.toLowerCase()}`}
                              >
                                <td className="font-mono">19-06 12:01</td>
                                <td className="font-bold text-primary">Nacho Pisano</td>
                                <td>Soporte Premium Vantrek</td>
                                <td className="text-secondary highlight-cell">Calle Falsa 123, CABA</td>
                                <td>Factura A (Pendiente CUIT)</td>
                                <td>
                                  <span className={`sheets-badge ${sheetsRowState.toLowerCase()}`}>
                                    {sheetsRowState === 'Pendiente' ? 'Pendiente Aprobación' : sheetsRowState}
                                  </span>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>

                          {/* Existing Rows */}
                          <tr className="sheets-row">
                            <td className="font-mono">19-06 11:30</td>
                            <td className="font-bold">Juan Perez</td>
                            <td>Soporte Premium Vantrek</td>
                            <td>Belgrano 456, Córdoba</td>
                            <td>Factura B</td>
                            <td>
                              <span className="sheets-badge aprobado">Aprobado</span>
                            </td>
                          </tr>

                          <tr className="sheets-row">
                            <td className="font-mono">19-06 10:15</td>
                            <td className="font-bold">Maria Gomez</td>
                            <td>Soporte Premium Vantrek</td>
                            <td>Av. Santa Fe 1234, CABA</td>
                            <td>Consumidor Final</td>
                            <td>
                              <span className="sheets-badge aprobado">Aprobado</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="sheets-footer-action">
                      <div className="sheets-status-desc text-secondary">
                        {step3RowAdded 
                          ? '✓ Fila de Nacho Pisano insertada automáticamente.' 
                          : 'Procesando inserción de datos en Sheets...'}
                      </div>
                      <button className="btn-next-step" onClick={handleNext} disabled={!step3RowAdded}>
                        <span>Ver Alerta de Control</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="mockup-panel telegram-mockup"
                >
                  <div className="tg-header">
                    <div className="tg-avatar">VB</div>
                    <div className="tg-header-info">
                      <span className="tg-name">Vantrek Operations Bot</span>
                      <span className="tg-status">bot</span>
                    </div>
                  </div>

                  <div className="tg-body">
                    <div className="tg-message-wrap">
                      <div className="tg-message-bubble">
                        <div className="tg-alert-title">
                          <AlertTriangle size={14} className="warning-icon" />
                          <span>ALERTA POST-VENTA VANTREK</span>
                        </div>
                        
                        <div className="tg-alert-content">
                          <p><strong>Comprador:</strong> Nacho Pisano</p>
                          <p><strong>Solicitud:</strong> Cambio de dirección de envío solicitado post-venta.</p>
                          <p><strong>Nueva Dirección:</strong> Calle Falsa 123, CABA</p>
                          <p><strong>Facturación:</strong> Solicitó Factura A</p>
                        </div>
                        
                        <div className="tg-alert-question">
                          ¿Aprobás el cambio en Mercado Libre y actualización en Google Sheets?
                        </div>

                        {telegramState === 'pending' ? (
                          <div className="tg-actions">
                            <motion.button 
                              className="tg-btn approve"
                              onClick={handleApprove}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Aprobar
                            </motion.button>
                            <motion.button 
                              className="tg-btn reject"
                              onClick={handleReject}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Rechazar
                            </motion.button>
                          </div>
                        ) : (
                          <div className="tg-action-result">
                            {telegramState === 'approved' ? (
                              <span className="result-text success">Aprobado ✓</span>
                            ) : (
                              <span className="result-text danger">Rechazado ✗</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Completion or rejection cards */}
                    {telegramState !== 'pending' && (
                      <motion.div 
                        className="completion-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {telegramState === 'approved' ? (
                          <>
                            <div className="completion-icon-bg success">
                              <CheckCircle2 size={20} />
                            </div>
                            <div className="completion-content">
                              <h4 className="text-primary font-bold">¡Flujo Completado con Éxito!</h4>
                              <p className="text-secondary text-sm">
                                Se notificó automáticamente a Nacho Pisano en Mercado Libre, la planilla de Google Sheets actualizó el estado a <strong>Aprobado</strong> y se disparó el pedido de CUIT para Factura A.
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="completion-icon-bg danger">
                              <XCircle size={20} />
                            </div>
                            <div className="completion-content">
                              <h4 className="text-primary font-bold">Solicitud Rechazada</h4>
                              <p className="text-secondary text-sm">
                                Se canceló el cambio de dirección. Se envió un mensaje automático en Mercado Libre pidiendo confirmación al comprador.
                              </p>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <div className="tg-footer">
                    <button className="btn-restart-sim" onClick={handleRestart}>
                      <RefreshCw size={14} />
                      <span>Volver a empezar</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Bottom Navigation Controls */}
          <div className="mobile-controls">
            <button 
              className="mobile-nav-btn prev" 
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              <ArrowLeft size={16} />
              <span>Anterior</span>
            </button>
            
            <button 
              className="mobile-nav-btn restart" 
              onClick={handleRestart}
              title="Reiniciar"
            >
              <RefreshCw size={14} />
            </button>

            <button 
              className="mobile-nav-btn next" 
              onClick={handleNext}
              disabled={currentStep === 4 || (currentStep === 1 && !step1Processed) || (currentStep === 2 && !step2Completed) || (currentStep === 3 && !step3RowAdded)}
            >
              <span>Siguiente</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
