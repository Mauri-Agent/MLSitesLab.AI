import { motion, Variants } from 'framer-motion';

export interface NodeDef {
  id: string;
  label: string;
  cx: number;
  cy: number;
}

export interface EdgeDef {
  id: string;
  source: string;
  target: string;
}

interface NodeGraphProps {
  nodes: NodeDef[];
  edges: EdgeDef[];
  activeNodeIds: string[];
}

const NodeGraph = ({ nodes, edges, activeNodeIds }: NodeGraphProps) => {
  const nodeVariants: Variants = {
    inactive: { 
      scale: 0.85,
      opacity: 0.4,
    },
    active: { 
      scale: 1.15, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    }
  };

  const edgeVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 1.2, ease: "easeInOut" }
    }
  };

  return (
    <div className="node-graph-container" style={{ width: '100%', height: '100%', padding: '1rem' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Render background lines first (inactive blueprint) */}
        {edges.map((edge) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          return (
            <line
              key={`${edge.id}-bg`}
              x1={sourceNode.cx}
              y1={sourceNode.cy}
              x2={targetNode.cx}
              y2={targetNode.cy}
              stroke="rgba(15, 203, 84, 0.08)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Render animated active overlay lines */}
        {edges.map((edge) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const isActive = activeNodeIds.includes(edge.source) && activeNodeIds.includes(edge.target);

          return (
            <motion.line
              key={edge.id}
              x1={sourceNode.cx}
              y1={sourceNode.cy}
              x2={targetNode.cx}
              y2={targetNode.cy}
              stroke="var(--accent-bright)"
              strokeWidth="0.55"
              variants={edgeVariants}
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
            />
          );
        })}
        
        {/* Render nodes */}
        {nodes.map((node) => {
          const isActive = activeNodeIds.includes(node.id);
          return (
            <g key={node.id}>
              {/* Outer halo / pulse for active nodes */}
              {isActive && (
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r="5"
                  fill="none"
                  stroke="var(--accent-bright)"
                  strokeWidth="0.25"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                />
              )}
              
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="3"
                fill={isActive ? "var(--accent-bright)" : "var(--bg-card)"}
                stroke={isActive ? "var(--accent-bright)" : "var(--border)"}
                strokeWidth="0.5"
                variants={nodeVariants}
                animate={isActive ? "active" : "inactive"}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 6px var(--accent-bright))' : 'none',
                  cursor: 'default'
                }}
              />
              <motion.text
                x={node.cx}
                y={node.cy + 7}
                fontSize="3.2"
                fill={isActive ? "var(--accent-bright)" : "var(--text-muted)"}
                textAnchor="middle"
                animate={{ opacity: isActive ? 1 : 0.45 }}
                transition={{ duration: 0.4 }}
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, pointerEvents: 'none' }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default NodeGraph;
