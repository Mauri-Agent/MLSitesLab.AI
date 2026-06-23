import { useEffect, useRef, useState } from 'react';
import { Bot, Code2, Cpu, LineChart } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

/* ── Types ───────────────────────────────────────────────────── */
interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: string;
}

/* ── Single card ─────────────────────────────────────────────── */
function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const [isDesktop, setIsDesktop] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  /* Detect pointer device once on mount */
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* 3D tilt via Framer Motion */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-12deg', '12deg']);

  /* Mouse move: tilt + spotlight */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;

    /* Spotlight CSS custom properties */
    el.style.setProperty('--mx', `${mx}%`);
    el.style.setProperty('--my', `${my}%`);

    if (isDesktop) {
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    }
  };

  const handleMouseLeave = () => {
    if (isDesktop) {
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="service-card"
      role="article"
      aria-label={service.title}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        isDesktop
          ? { rotateX, rotateY, transformStyle: 'preserve-3d' }
          : undefined
      }
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Decorative number */}
      <span className="service-card-number" aria-hidden="true">
        {service.number}
      </span>

      {/* Icon */}
      <div className="service-icon-wrap" aria-hidden="true">
        {service.icon}
      </div>

      {/* Content */}
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </motion.div>
  );
}

/* ── Section ─────────────────────────────────────────────────── */
const services: Service[] = [
  {
    icon: <Cpu size={24} />,
    title: 'Automatización de Procesos',
    description:
      'Diseñamos e implementamos flujos automatizados con n8n y Make para conectar tus aplicaciones y eliminar horas de trabajo manual repetitivo.',
    number: '01',
  },
  {
    icon: <LineChart size={24} />,
    title: 'Consultoría Estratégica IA',
    description:
      'Analizamos las operaciones de tu empresa para identificar cuellos de botella y descubrir dónde la Inteligencia Artificial puede optimizar costos y escalar resultados.',
    number: '02',
  },
  {
    icon: <Code2 size={24} />,
    title: 'Desarrollo de Soluciones Web',
    description:
      'Creamos plataformas web modernas y personalizadas, integradas con la última tecnología y diseñadas para ofrecer una experiencia de usuario premium.',
    number: '03',
  },
  {
    icon: <Bot size={24} />,
    title: 'Agentes Inteligentes',
    description:
      'Desarrollamos asistentes virtuales impulsados por IA, capaces de atender a tus clientes, clasificar leads o asistir a tu equipo 24/7 de forma autónoma.',
    number: '04',
  },
];

export default function Services() {
  return (
    <motion.section
      id="servicios"
      className="section services"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container">
        {/* Header */}
        <div className="services-header">
          <span className="section-label">Servicios</span>
          <div className="divider" style={{ marginBottom: '1.5rem' }} />
          <h2>Ecosistema de Soluciones</h2>
          <p>
            Tecnología de vanguardia aplicada para resolver problemas reales,
            optimizar tiempos y escalar tus operaciones.
          </p>
        </div>

        {/* Grid */}
        <div className="services-grid" style={{ perspective: '1200px' }}>
          {services.map((svc, i) => (
            <ServiceCard key={svc.number} service={svc} index={i} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
