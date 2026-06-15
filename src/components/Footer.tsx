import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#portfolio', label: 'Portfolio' },
];

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      role="contentinfo"
      aria-label="Pie de página"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container">
        <div className="footer-inner">
          <div className="footer-left">
            <span className="footer-brand">
              ML<span>SitesLab</span>.AI
            </span>
            <p className="footer-copy">
              © {new Date().getFullYear()} MLSitesLab.AI — Todos los derechos reservados.
            </p>
          </div>

          <div className="footer-contact">
            <a href="mailto:mlsiteslab.ai@gmail.com" className="footer-contact-item" aria-label="Enviar correo">
              <Mail size={16} />
              <span>mlsiteslab.ai@gmail.com</span>
            </a>
            <a href="tel:+59893635208" className="footer-contact-item" aria-label="Llamar por teléfono">
              <Phone size={16} />
              <span>+598 93 635 208</span>
            </a>
          </div>

          <nav className="footer-links" aria-label="Links del footer">
            {links.map(({ href, label }) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </motion.footer>
  );
}
