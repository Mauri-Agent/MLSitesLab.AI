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
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const edgeVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 0.6, 
      transition: { duration: 1, ease: "easeInOut" }
    }
  };

  return (
    <div className="node-graph-container">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
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
              stroke="var(--accent-mid)"
              strokeWidth="0.5"
              variants={edgeVariants}
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
            />
          );
        })}
        
        {nodes.map((node) => {
          const isActive = activeNodeIds.includes(node.id);
          return (
            <g key={node.id}>
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="3"
                fill={isActive ? "var(--accent-bright)" : "var(--bg-card)"}
                stroke="var(--accent-mid)"
                strokeWidth="0.5"
                variants={nodeVariants}
                initial="hidden"
                animate={isActive ? "visible" : "hidden"}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 5px var(--accent-bright))' : 'none'
                }}
              />
              <motion.text
                x={node.cx}
                y={node.cy + 7}
                fontSize="3"
                fill={isActive ? "var(--accent-bright)" : "var(--text-muted)"}
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ delay: 0.2 }}
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
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
