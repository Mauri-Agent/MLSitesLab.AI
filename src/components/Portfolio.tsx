import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

// ── Portfolio ─────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const progress = 35;

  return (
    <motion.section
      id="portfolio"
      className="section portfolio"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container">
        {/* Header */}
        <div className="portfolio-header">
          <span className="section-label">Portfolio</span>
          <h2>Nuestros Proyectos</h2>
          <p>Casos de éxito y soluciones destacadas que hemos desarrollado para nuestros clientes.</p>
        </div>

        {/* Coming Soon Card */}
        <motion.div
          className="portfolio-coming-soon"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="coming-soon-icon"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          >
            <Rocket size={36} strokeWidth={1.5} />
          </motion.div>

          <h3 className="coming-soon-title">Próximamente nuevos proyectos</h3>
          <p className="coming-soon-subtitle">
            Estamos preparando casos de éxito para mostrarte. ¡Muy pronto!
          </p>

          {/* Progress bar */}
          <div className="coming-soon-progress-wrap">
            <div className="coming-soon-progress-labels">
              <span>Progreso</span>
              <span>{progress}%</span>
            </div>
            <div className="coming-soon-progress-track">
              <motion.div
                className="coming-soon-progress-fill"
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
