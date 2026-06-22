import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import Loader from './components/Loader';
import InteractiveFunnel from './components/InteractiveFunnel';
import WhatsappButton from './components/WhatsappButton';
import VantrekCaseStudy from './components/VantrekCaseStudy';
import './styles/App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Monitor back/forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Custom client-side router navigation
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const isCaseStudy = currentPath === '/portfolio/vantrek';

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <main className="app-container">
          <Cursor />
          <Navbar currentPath={currentPath} navigate={navigate} />

          <AnimatePresence mode="wait">
            {!isCaseStudy ? (
              <div key="homepage-content">
                <Hero />
                <div className="divider" />
                <InteractiveFunnel />
                <div className="divider" />
                <Services />
                <div className="divider" />
                <Portfolio navigate={navigate} />
              </div>
            ) : (
              <VantrekCaseStudy key="case-study-content" navigate={navigate} />
            )}
          </AnimatePresence>

          <Footer currentPath={currentPath} navigate={navigate} />
          <WhatsappButton />
        </main>
      )}
    </>
  );
}

export default App;
