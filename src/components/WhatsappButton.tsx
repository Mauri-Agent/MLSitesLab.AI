import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import '../styles/WhatsappButton.css';

export default function WhatsappButton() {
  // Enlace directo a WhatsApp con número de Uruguay (+598 93 635 208) y mensaje predeterminado
  const whatsappUrl = "https://wa.me/59893635208?text=Hola!%20Me%20interesa%20conocer%20más%20sobre%20las%20automatizaciones%20con%20IA%20de%20MLSitesLab.";

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      aria-label="Contactar por WhatsApp"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.1, translateY: -3 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="whatsapp-pulse"></div>
      <MessageSquare className="whatsapp-icon" size={24} />
      <span className="whatsapp-tooltip">¿Hablamos por WhatsApp?</span>
    </motion.a>
  );
}
