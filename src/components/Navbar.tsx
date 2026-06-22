import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentPath?: string;
  navigate?: (path: string) => void;
}

const Navbar = ({ currentPath = '/', navigate }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const links = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#servicios', label: 'Servicios' },
    { href: '#portfolio', label: 'Portfolio' },
  ];

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    
    // Cross-page navigation scroll handler
    if (currentPath !== '/' && navigate) {
      navigate('/');
      setTimeout(() => {
        if (href === '#inicio') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const el = document.querySelector(href);
        if (el) {
          const computedPaddingTop = parseFloat(window.getComputedStyle(el).paddingTop) || 0;
          const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 72 + computedPaddingTop;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 150);
      return;
    }

    if (href === '#inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      const computedPaddingTop = parseFloat(window.getComputedStyle(el).paddingTop) || 0;
      const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 72 + computedPaddingTop;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        className={`navbar${scrolled ? ' scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="navbar-inner">
          <a
            className="logo"
            href="#inicio"
            onClick={e => { e.preventDefault(); handleNavClick('#inicio'); }}
            aria-label="MLSitesLab.AI — inicio"
          >
            ML<span>SitesLab</span>.AI
          </a>

          <div className="nav-links" role="menubar">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="nav-link"
                role="menuitem"
                onClick={e => { e.preventDefault(); handleNavClick(href); }}
              >
                {label}
              </a>
            ))}
          </div>

          <a
            href="#servicios"
            className="btn btn-outline nav-cta"
            onClick={e => { e.preventDefault(); handleNavClick('#servicios'); }}
            id="nav-contact-btn"
          >
            Contactar
          </a>

          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            id="hamburger-btn"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="menu"
            aria-label="Menú móvil"
          >
            {links.map(({ href, label }, i) => (
              <motion.a
                key={href}
                href={href}
                className="nav-link"
                role="menuitem"
                onClick={e => { e.preventDefault(); handleNavClick(href); }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                {label}
              </motion.a>
            ))}
            <motion.a
              href="#servicios"
              className="btn btn-primary"
              onClick={e => { e.preventDefault(); handleNavClick('#servicios'); }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              id="mobile-contact-btn"
            >
              Contactar
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
