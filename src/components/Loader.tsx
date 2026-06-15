import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface LoaderProps {
  onComplete: () => void;
}

const NODE_COLOR  = new THREE.Color('#39ff14');
const GLOW_COLOR  = new THREE.Color('#39ff14');
const LINE_COLOR  = '#0fcb54';
const BG_COLOR    = '#050908';
const TOTAL_NODES = 50;        // more nodes for depth
const DURATION_MS = 3600;      // total loader time (2800ms build + 800ms fade)
const BUILD_MS    = 2800;      // 2.8 seconds de animación de construcción

// ─── Hex + depth node generator ──────────────────────────────────────────────
function generateHexNetwork(count: number) {
  const positions: THREE.Vector3[] = [];

  // Hexagonal rings with real 3D depth variation
  const rings = [
    { radius: 0,    n: 1,  zSpread: 0.2  },  // center
    { radius: 0.5,  n: 5,  zSpread: 0.5  },  // near inner
    { radius: 1.1,  n: 6,  zSpread: 0.8  },  // inner hex
    { radius: 1.7,  n: 8,  zSpread: 1.2  },  // mid hex
    { radius: 2.3,  n: 10, zSpread: 1.6  },  // outer hex
    { radius: 2.9,  n: 8,  zSpread: 1.0  },  // far outer
    { radius: 1.4,  n: 6,  zSpread: 2.2  },  // deep back layer
    { radius: 0.8,  n: 6,  zSpread: 2.5  },  // very deep
  ];

  rings.forEach(({ radius, n, zSpread }) => {
    for (let i = 0; i < n && positions.length < count; i++) {
      const angle = (i / n) * Math.PI * 2 + Math.PI / 6;
      const jitter = radius * 0.22;
      const r = radius + (Math.random() - 0.5) * jitter;
      const a = angle + (Math.random() - 0.5) * 0.3;
      const z = (Math.random() - 0.5) * zSpread;
      positions.push(new THREE.Vector3(r * Math.cos(a), r * Math.sin(a), z));
    }
  });

  // Fill remaining randomly inside hex bounds
  while (positions.length < count) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 2.8;
    const z = (Math.random() - 0.5) * 2.8; // strong depth
    positions.push(new THREE.Vector3(
      r * Math.cos(angle),
      r * Math.sin(angle),
      z
    ));
  }

  // Proximity-based edges (organic, not layer-strict)
  const edges: [number, number][] = [];
  const MAX_DIST = 1.6;
  const MAX_PER  = 5;
  const cnt      = new Array(positions.length).fill(0);

  for (let a = 0; a < positions.length; a++) {
    const neighbors = positions
      .map((p, i) => ({ i, d: positions[a].distanceTo(p) }))
      .filter(({ i, d }) => i !== a && d < MAX_DIST)
      .sort((x, y) => x.d - y.d)
      .slice(0, MAX_PER);

    for (const { i: b } of neighbors) {
      if (cnt[a] >= MAX_PER || cnt[b] >= MAX_PER) continue;
      const dup = edges.some(([ea, eb]) =>
        (ea === a && eb === b) || (ea === b && eb === a)
      );
      if (!dup) {
        edges.push([a, b]);
        cnt[a]++;
        cnt[b]++;
      }
    }
  }

  return { positions, edges };
}

// ─── Single node with appear animation ───────────────────────────────────────
function NeuralNode({
  position,
  phase,
  visible,
}: {
  position: THREE.Vector3;
  phase: number;
  visible: boolean;
}) {
  const meshRef  = useRef<THREE.Mesh>(null!);
  const scale    = useRef(0);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Pop-in animation: ease to target scale
    const target = visible ? 1 : 0;
    scale.current += (target - scale.current) * (visible ? 0.12 : 0.3);

    const pulse = visible ? 1 + 0.2 * Math.sin(t * 2.4 + phase) : 1;
    meshRef.current.scale.setScalar(scale.current * pulse);

    // Fade in material opacity
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = Math.min(1, scale.current * 1.8);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.065, 14, 14]} />
      <meshStandardMaterial
        color={NODE_COLOR}
        emissive={GLOW_COLOR}
        emissiveIntensity={2.2}
        roughness={0.05}
        metalness={0.15}
        transparent
        opacity={0}
      />
    </mesh>
  );
}

// ─── Lines drawn progressively ────────────────────────────────────────────────
// We recreate the geometry when visibleEdges changes — reliable draw-range trick
function NetworkLines({
  positions,
  edges,
  visibleEdges,
}: {
  positions: THREE.Vector3[];
  edges: [number, number][];
  visibleEdges: number;
}) {
  // Recompute geometry only when visibleEdges changes
  const geometry = useMemo(() => {
    const verts: number[] = [];
    for (let i = 0; i < visibleEdges && i < edges.length; i++) {
      const [a, b] = edges[i];
      const pa = positions[a];
      const pb = positions[b];
      if (!pa || !pb) continue;
      verts.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
    }
    const geo = new THREE.BufferGeometry();
    if (verts.length > 0) {
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    }
    return geo;
  }, [positions, edges, visibleEdges]); // <-- key: depends on visibleEdges

  if (visibleEdges === 0) return null;

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={LINE_COLOR} transparent opacity={0.60} />
    </lineSegments>
  );
}

// ─── 3D scene: orchestrates build progress ────────────────────────────────────
function NeuralScene({ buildProgress }: { buildProgress: number }) {
  const groupRef = useRef<THREE.Group>(null!);

  const { positions, edges } = useMemo(() => generateHexNetwork(TOTAL_NODES), []);

  // Phase 1 (0 → 0.4): nodes appear
  // Phase 2 (0.4 → 1): lines are traced
  const NODE_PHASE = 0.40;
  const nodeProgress = Math.min(buildProgress / NODE_PHASE, 1);
  const lineProgress = buildProgress <= NODE_PHASE
    ? 0
    : (buildProgress - NODE_PHASE) / (1 - NODE_PHASE);

  const visibleNodes = Math.floor(nodeProgress * positions.length);
  const visibleEdges = Math.floor(lineProgress * edges.length);

  // Slow organic rotation, starts only after build begins
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = Math.min(buildProgress * 2.5, 1) * 0.13;
    groupRef.current.rotation.y = t * speed;
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.14;
    groupRef.current.rotation.z = Math.cos(t * 0.06) * 0.06;
  });

  return (
    <group ref={groupRef}>
      {/* Lines — re-rendered each time a new edge becomes visible */}
      <NetworkLines
        positions={positions}
        edges={edges}
        visibleEdges={visibleEdges}
      />

      {/* Nodes */}
      {positions.map((pos, i) => (
        <NeuralNode
          key={i}
          position={pos}
          phase={i * 0.51}
          visible={i < visibleNodes}
        />
      ))}
    </group>
  );
}

// ─── Loader root ──────────────────────────────────────────────────────────────
const Loader = ({ onComplete }: LoaderProps) => {
  const [buildProgress, setBuildProgress] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const raw  = Math.min(elapsed / BUILD_MS, 1);
      // Ease-out for natural feel
      const eased = 1 - Math.pow(1 - raw, 2.5);
      setBuildProgress(eased);
      if (elapsed < BUILD_MS) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    const timer = setTimeout(onComplete, DURATION_MS);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [onComplete]);

  const pct = Math.round(buildProgress * 100);
  // Two-phase label
  const label = buildProgress < 0.42
    ? 'MAPEANDO NODOS...'
    : buildProgress < 0.98
    ? 'CONECTANDO RED NEURONAL...'
    : 'SISTEMA LISTO';

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: BG_COLOR,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(15,203,84,.015) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(15,203,84,.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* 3D Canvas — 80% viewport */}
      <div style={{ width: '80vw', height: '80vh', position: 'relative' }}>
        <Canvas
          camera={{ position: [0, 0, 6.5], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.25} />
          <pointLight position={[0, 0, 5]}  intensity={2.5} color="#39ff14" />
          <pointLight position={[5, 4, 3]}  intensity={1.2} color="#00ff88" />
          <pointLight position={[-5,-4,-4]} intensity={0.8} color="#0fcb54" />
          <pointLight position={[0, 0,-5]}  intensity={1.0} color="#39ff14" />

          <NeuralScene buildProgress={buildProgress} />
        </Canvas>
      </div>

      {/* Bottom HUD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem',
        }}
      >
        <span style={{
          color: '#39ff14',
          fontFamily: 'var(--font-display, "Inter", sans-serif)',
          fontWeight: 700, fontSize: '1rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          textShadow: '0 0 14px #39ff14, 0 0 32px #39ff1440',
        }}>
          Inicializando ML Engine
        </span>

        {/* Progress bar */}
        <div style={{
          width: '240px', height: '2px',
          background: 'rgba(15,203,84,0.1)',
          borderRadius: '999px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #0a8f3a, #39ff14)',
            borderRadius: '999px',
            boxShadow: '0 0 12px #39ff14',
            transition: 'width 0.08s linear',
          }} />
        </div>

        <span style={{
          color: '#1a9900', fontSize: '0.70rem',
          letterSpacing: '0.14em', fontFamily: 'monospace',
        }}>
          {pct}% · {label}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default Loader;
