import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface PortfolioProps {
  navigate: (path: string) => void;
}

export default function Portfolio({ navigate }: PortfolioProps) {
  return (
    <motion.section
      id="portfolio"
      className="section portfolio"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="portfolio-header">
          <span className="section-label">Casos de Éxito</span>
          <h2>Nuestros Proyectos</h2>
          <p>Soluciones de automatización de alto impacto desarrolladas para potenciar operaciones comerciales.</p>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {/* Vantrek Project Card */}
          <motion.div
            className="project-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8, borderColor: 'rgba(15, 203, 84, 0.4)', boxShadow: '0 10px 30px rgba(15, 203, 84, 0.05)' }}
            onClick={() => navigate('/portfolio/vantrek')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/portfolio/vantrek');
              }
            }}
          >
            <div className="project-card-header">
              <span className="project-badge">AUTOMATIZACIÓN & IA</span>
              <span className="project-meta">Caso de Éxito</span>
            </div>
            
            <div className="project-card-body">
              <h3>Vantrek: Soporte Post-Venta Autónomo</h3>
              <p>
                Implementación de un ecosistema inteligente que captura e interpreta consultas complejas de post-venta en Mercado Libre, automatizando respuestas y planillas de despacho con alertas de control en Telegram.
              </p>
              
              <div className="project-highlights">
                <div className="highlight-item">
                  <span className="highlight-value">95%</span>
                  <span className="highlight-label">Mensajes Auto</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-value">&lt; 2 min</span>
                  <span className="highlight-label">Tiempo de Resp.</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-value">0</span>
                  <span className="highlight-label">Errores Planillas</span>
                </div>
              </div>
            </div>
            
            <div className="project-card-footer">
              <div
                className="btn-project-link"
                id="vantrek-case-link"
                aria-label="Ver caso de estudio de Vantrek"
              >
                <span>Ver Caso de Estudio</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
