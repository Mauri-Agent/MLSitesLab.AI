import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';
import Loader from './components/Loader';
import InteractiveFunnel from './components/InteractiveFunnel';
import WhatsappButton from './components/WhatsappButton';
import './styles/App.css';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <main className="app-container">
          <Navbar />
          <Hero />
          <div className="divider" />
          <InteractiveFunnel />
          <div className="divider" />
          <Services />
          <div className="divider" />
          <Portfolio />
          <Footer />
          <WhatsappButton />
        </main>
      )}
    </>
  );
}

export default App;
