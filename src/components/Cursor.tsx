import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const Cursor = () => {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Dot follows mouse instantly
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);

  // Ring follows with spring lag
  const ringX = useSpring(rawX, { damping: 22, stiffness: 200, mass: 0.3 });
  const ringY = useSpring(rawY, { damping: 22, stiffness: 200, mass: 0.3 });

  const rafRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsDesktop(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    document.body.classList.add('has-cursor');

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        dotX.set(e.clientX);
        dotY.set(e.clientY);
        rawX.set(e.clientX);
        rawY.set(e.clientY);
      });
      if (!visible) setVisible(true);
    };

    const onEnter = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest('a, button, [data-cursor]');
      if (t) setHovering(true);
    };

    const onLeave = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest('a, button, [data-cursor]');
      if (t) setHovering(false);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    return () => {
      document.body.classList.remove('has-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isDesktop, visible, rawX, rawY, dotX, dotY]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Small dot — follows exactly */}
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: hovering ? 0 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
        aria-hidden="true"
      />

      {/* Outer ring — spring lag */}
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: hovering ? 2 : 1,
          opacity: visible ? 1 : 0,
          borderColor: hovering ? 'rgba(15, 203, 84, 0.8)' : 'rgba(15, 203, 84, 0.5)',
          backgroundColor: hovering ? 'rgba(15, 203, 84, 0.06)' : 'transparent',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        aria-hidden="true"
      />
    </>
  );
};

export default Cursor;
