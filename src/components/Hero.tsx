import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

/* ── Terminal typewriter animation ──────────────────────────── */
const TERMINAL_LINES = [
  { type: 'cmd',     text: 'mlsiteslab --analyze-business' },
  { type: 'out',     text: '→ Detectando procesos manuales...' },
  { type: 'out',     text: '→ Oportunidades de automatización: 14' },
  { type: 'success', text: '✓ Ahorro estimado: 38 hs/semana' },
  { type: 'dim',     text: '' },
  { type: 'cmd',     text: 'mlsiteslab --deploy-agents' },
  { type: 'success', text: '✓ Agentes IA iniciados con éxito' },
  { type: 'out',     text: '→ Sistema operando 24/7' },
];

const TerminalLine = ({ line, delay }: { line: typeof TERMINAL_LINES[0]; delay: number }) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!shown) return null;

  const cls =
    line.type === 'cmd' ? 'terminal-cmd' :
    line.type === 'success' ? 'terminal-out success' :
    line.type === 'dim' ? 'terminal-out dim' :
    'terminal-out';

  return (
    <motion.div
      className="terminal-line"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      {line.type === 'cmd' && <span className="terminal-prompt">$</span>}
      <span className={cls}>{line.text}</span>
    </motion.div>
  );
};

/* ── Hero ────────────────────────────────────────────────────── */
const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollToServices = () => {
    const el = document.querySelector('#servicios');
    if (el) {
      const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const STATS = [
    { number: '14+', label: 'Automatizaciones' },
    { number: '38h', label: 'Ahorradas/sem' },
    { number: '24/7', label: 'Disponibilidad' },
  ];

  return (
    <section id="inicio" className="hero container" ref={ref} aria-label="Presentación">
      {/* Background glows (parallax) */}
      <motion.div
        className="hero-bg-glow"
        style={{ scale: glowScale, opacity: glowOpacity }}
        aria-hidden="true"
      />
      <div className="hero-bg-glow-2" aria-hidden="true" />

      {/* Left: text */}
      <motion.div className="hero-text" style={{ y: textY }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-badge" role="status">
            <span className="hero-badge-dot" aria-hidden="true" />
            Sistemas Inteligentes · Activos
          </div>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Automatizamos<br />lo complejo.<br />
          <span className="text-gradient">Potenciamos tu estrategia.</span>
        </motion.h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Soy Mauricio. Ayudo a equipos y empresas a delegar sus tareas repetitivas en sistemas de inteligencia artificial. Nuestro objetivo es simple: implementar tecnología de vanguardia que trabaje por ti, ahorrándote horas de trabajo manual para que puedas concentrarte en lo que verdaderamente importa.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <button
            id="hero-cta-primary"
            className="btn btn-primary"
            onClick={scrollToServices}
            aria-label="Ver servicios disponibles"
          >
            Ver Servicios <ArrowRight size={16} aria-hidden="true" />
          </button>
          <button
            id="hero-cta-secondary"
            className="btn btn-outline"
            onClick={() => {
              const el = document.querySelector('#portfolio');
              if (el) {
                const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 72;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }}
            aria-label="Ver portfolio"
          >
            Portfolio
          </button>
        </motion.div>
      </motion.div>

      {/* Right: terminal + stats */}
      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ width: '100%' }}>
          <div className="terminal" role="region" aria-label="Terminal demostrativa">
            <div className="terminal-bar" aria-hidden="true">
              <div className="terminal-dot" style={{ background: '#ff5f57' }} />
              <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
              <div className="terminal-dot" style={{ background: '#28c840' }} />
              <div className="terminal-title">mlsiteslab — bash</div>
            </div>
            <div className="terminal-body">
              {TERMINAL_LINES.map((line, i) => (
                <TerminalLine key={i} line={line} delay={600 + i * 350} />
              ))}
              <div className="terminal-line" aria-hidden="true">
                <span className="terminal-prompt">$</span>
                <span className="terminal-cursor" />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="hero-stats" role="list" aria-label="Estadísticas">
            {STATS.map(({ number, label }, i) => (
              <motion.div
                key={label}
                className="stat-card"
                role="listitem"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
              >
                <div className="stat-number" aria-label={`${number} ${label}`}>{number}</div>
                <div className="stat-label">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToServices}
        aria-label="Ir a servicios"
        id="hero-scroll-btn"
        className="hero-scroll-btn-animated"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.7rem',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        Scroll
        <ChevronDown size={16} aria-hidden="true" />
      </button>
    </section>
  );
};

export default Hero;
