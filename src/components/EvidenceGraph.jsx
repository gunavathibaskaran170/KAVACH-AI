import React, { useEffect, useState, useRef } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import { Shield, Smartphone, HardDrive, Server, FileText, Image, Volume2, Video, AlertTriangle, Link2 } from 'lucide-react';

export default function EvidenceGraph({ evidenceItems, devices, cases, relations, onSelectEvidence }) {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const svgRef = useRef(null);

  // Initialize nodes and links
  useEffect(() => {
    // 1. Build nodes list
    const caseNodes = cases.map(c => ({
      id: c.id,
      label: c.name,
      type: 'case',
      raw: c,
      radius: 24,
      color: '#7C3AED' // Violet
    }));

    const deviceNodes = devices.map(d => ({
      id: d.id,
      label: d.name,
      type: 'device',
      raw: d,
      radius: 18,
      color: '#3B82F6' // Blue
    }));

    const evidenceNodes = evidenceItems.map(e => {
      let color = '#10B981'; // Green
      if (e.riskScore > 75) color = '#EF4444'; // Red
      else if (e.riskScore > 50) color = '#F59E0B'; // Orange

      return {
        id: e.id,
        label: e.title,
        type: 'evidence',
        raw: e,
        radius: 14,
        color
      };
    });

    const allNodes = [...caseNodes, ...deviceNodes, ...evidenceNodes];

    // 2. Build links
    const allLinks = relations.map((rel, idx) => ({
      id: `link-${idx}`,
      source: rel.source,
      target: rel.target,
      type: rel.type,
      reason: rel.reason || ''
    })).filter(l => 
      allNodes.some(n => n.id === l.source) && allNodes.some(n => n.id === l.target)
    );

    // Deep copy to prevent mutating raw data during D3 simulation
    const simulatedNodes = allNodes.map(n => ({ ...n }));
    const simulatedLinks = allLinks.map(l => ({ ...l }));

    // 3. Create D3 Simulation
    const width = 800;
    const height = 500;
    
    // Assign starting positions in circle to avoid superposition errors
    simulatedNodes.forEach((node, i) => {
      const angle = (i / simulatedNodes.length) * 2 * Math.PI;
      node.x = width / 2 + Math.cos(angle) * 150;
      node.y = height / 2 + Math.sin(angle) * 150;
    });

    const simulation = forceSimulation(simulatedNodes)
      .force('link', forceLink(simulatedLinks).id(d => d.id).distance(90))
      .force('charge', forceManyBody().strength(-120))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collision', forceCollide().radius(d => d.radius + 12))
      .on('tick', () => {
        // Force state update to trigger re-render on each simulation tick
        setNodes([...simulatedNodes]);
        setLinks([...simulatedLinks]);
      });

    return () => simulation.stop();
  }, [evidenceItems, devices, cases, relations]);

  // Handle Drag Events manually for simple implementation in React
  const handleMouseDown = (e, node) => {
    e.preventDefault();
    setSelectedNode(node);
    if (node.type === 'evidence') {
      onSelectEvidence(node.raw);
    }
    setDraggedNode(node);
  };

  const handleMouseMove = (e) => {
    if (!draggedNode || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale coords to match viewBox (800x500)
    const scaleX = 800 / rect.width;
    const scaleY = 500 / rect.height;

    setNodes(prev => prev.map(n => {
      if (n.id === draggedNode.id) {
        n.x = x * scaleX;
        n.y = y * scaleY;
        n.fx = x * scaleX;
        n.fy = y * scaleY;
      }
      return n;
    }));
  };

  const handleMouseUp = () => {
    if (draggedNode) {
      // Release node constraint so simulation handles balance
      setNodes(prev => prev.map(n => {
        if (n.id === draggedNode.id) {
          delete n.fx;
          delete n.fy;
        }
        return n;
      }));
      setDraggedNode(null);
    }
  };

  // Node Icons
  const getNodeIcon = (node) => {
    const size = node.type === 'case' ? 18 : node.type === 'device' ? 14 : 12;
    if (node.type === 'case') return <Shield size={size} className="text-white" />;
    if (node.type === 'device') {
      if (node.raw.type === 'Mobile Phone') return <Smartphone size={size} className="text-white" />;
      if (node.raw.type === 'Cloud Storage') return <HardDrive size={size} className="text-white" />;
      return <Server size={size} className="text-white" />;
    }
    // Evidence type
    const evType = node.raw?.type;
    if (evType === 'text') return <FileText size={size} className="text-white" />;
    if (evType === 'image') return <Image size={size} className="text-white" />;
    if (evType === 'audio') return <Volume2 size={size} className="text-white" />;
    if (evType === 'video') return <Video size={size} className="text-white" />;
    return <Link2 size={size} className="text-white" />;
  };

  // Get neighboring links and nodes for highlighting
  const getConnectedDetails = () => {
    if (!selectedNode) return null;
    const connectedLinks = links.filter(l => 
      (typeof l.source === 'object' ? l.source.id : l.source) === selectedNode.id ||
      (typeof l.target === 'object' ? l.target.id : l.target) === selectedNode.id
    );

    const connectedNodeIds = new Set(
      connectedLinks.flatMap(l => [
        typeof l.source === 'object' ? l.source.id : l.source,
        typeof l.target === 'object' ? l.target.id : l.target
      ])
    );
    connectedNodeIds.delete(selectedNode.id);

    const connectedNodes = nodes.filter(n => connectedNodeIds.has(n.id));

    return { connectedLinks, connectedNodes };
  };

  const connectionDetails = getConnectedDetails();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
      {/* Graph Area */}
      <div className="lg:col-span-2 cyber-glass border border-cyber-border rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2 z-10">
          <div>
            <h3 className="font-semibold text-cyber-text-primary text-sm flex items-center gap-1.5">
              <Link2 size={16} className="text-cyber-accent" />
              Cross-Modal Evidence Map
            </h3>
            <p className="text-xs text-gray-400">Interactive correlation map. Click and drag nodes to explore links.</p>
          </div>
          {/* Legend */}
          <div className="flex gap-3 text-2xs md:text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-cyber-accent" />
              <span>Case</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue" />
              <span>Device</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-cyber-red" />
              <span>High Risk Evidence</span>
            </div>
          </div>
        </div>

        {/* SVG Wrapper */}
        <div className="w-full flex-grow relative min-h-[400px]">
          <svg
            ref={svgRef}
            viewBox="0 0 800 500"
            className="w-full h-full cursor-grab select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* SVG Gradients for glowing links */}
            <defs>
              <linearGradient id="link-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render Links */}
            {links.map((link) => {
              const sourceNode = typeof link.source === 'object' ? link.source : nodes.find(n => n.id === link.source);
              const targetNode = typeof link.target === 'object' ? link.target : nodes.find(n => n.id === link.target);

              if (!sourceNode || !targetNode) return null;

              const isHighlighted = selectedNode && (
                sourceNode.id === selectedNode.id || targetNode.id === selectedNode.id
              );

              return (
                <g key={link.id}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHighlighted ? '#7C3AED' : '#23223A'}
                    strokeWidth={isHighlighted ? 2.5 : 1}
                    strokeOpacity={isHighlighted ? 0.9 : 0.4}
                    strokeDasharray={link.type === 'timestamp' ? '4 2' : undefined}
                    className="transition-all duration-300"
                  />
                  {isHighlighted && link.reason && (
                    <text
                      x={(sourceNode.x + targetNode.x) / 2}
                      y={(sourceNode.y + targetNode.y) / 2 - 4}
                      fill="#C084FC"
                      fontSize="9"
                      textAnchor="middle"
                      className="bg-cyber-bg px-1 font-mono"
                    >
                      {link.reason}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode && node.id === selectedNode.id;
              const isNeighbor = connectionDetails?.connectedNodes.some(n => n.id === node.id);
              const opacity = !selectedNode || isSelected || isNeighbor ? 1 : 0.35;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x || 0}, ${node.y || 0})`}
                  className="cursor-pointer transition-opacity duration-300"
                  style={{ opacity }}
                  onMouseDown={(e) => handleMouseDown(e, node)}
                >
                  {/* Glowing Outer Border for Selected */}
                  {isSelected && (
                    <circle
                      r={node.radius + 6}
                      fill="none"
                      stroke="#7C3AED"
                      strokeWidth={2}
                      filter="url(#glow)"
                      className="animate-pulse"
                    />
                  )}
                  {/* Node Circle */}
                  <circle
                    r={node.radius}
                    fill={node.color}
                    stroke="#0B0A14"
                    strokeWidth={2}
                    className="shadow-lg"
                  />
                  {/* Icon Overlay inside Node */}
                  <foreignObject
                    x={-node.radius / 2 - 2}
                    y={-node.radius / 2 - 2}
                    width={node.radius + 4}
                    height={node.radius + 4}
                    className="pointer-events-none"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {getNodeIcon(node)}
                    </div>
                  </foreignObject>

                  {/* Label */}
                  <text
                    y={node.radius + 16}
                    fill="#F3F4F6"
                    fontSize="9.5"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="pointer-events-none select-none font-sans drop-shadow-md"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Details Side Panel */}
      <div className="cyber-glass border border-cyber-border rounded-xl p-5 flex flex-col justify-between">
        {selectedNode ? (
          <div className="flex-grow flex flex-col">
            <div className="flex items-center gap-2 border-b border-cyber-border pb-3 mb-4">
              <span className="p-2 rounded bg-cyber-border/40">
                {getNodeIcon(selectedNode)}
              </span>
              <div>
                <span className="text-2xs uppercase tracking-wider font-mono text-cyber-accent font-semibold">{selectedNode.type}</span>
                <h4 className="font-semibold text-cyber-text-primary text-base">{selectedNode.label}</h4>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-1 text-sm">
              <div>
                <span className="text-xs text-gray-400 font-mono">NODE ID</span>
                <p className="font-mono text-xs text-cyber-blue">{selectedNode.id}</p>
              </div>

              {selectedNode.type === 'evidence' && (
                <>
                  <div>
                    <span className="text-xs text-gray-400">Risk Assessment</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full bg-cyber-border rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${selectedNode.raw.riskScore}%`,
                            backgroundColor: selectedNode.color
                          }}
                        />
                      </div>
                      <span className="font-mono font-bold text-xs" style={{ color: selectedNode.color }}>
                        {selectedNode.raw.riskScore}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400">Mock Snippet / Payload</span>
                    <div className="bg-cyber-bg border border-cyber-border/50 rounded-lg p-2.5 mt-1 font-mono text-2xs leading-relaxed text-gray-300">
                      {selectedNode.raw.snippet}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400">Triage Assignment</span>
                    <span className={`block mt-1 text-xs font-semibold px-2 py-0.5 rounded border w-fit ${
                      selectedNode.raw.triageStatus.includes('High')
                        ? 'bg-cyber-red/10 border-cyber-red/30 text-cyber-red'
                        : selectedNode.raw.triageStatus.includes('Ambiguous')
                        ? 'bg-cyber-orange/10 border-cyber-orange/30 text-cyber-orange'
                        : 'bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue'
                    }`}>
                      {selectedNode.raw.triageStatus}
                    </span>
                  </div>
                </>
              )}

              {selectedNode.type === 'device' && (
                <>
                  <div>
                    <span className="text-xs text-gray-400">Device Owner Reference</span>
                    <p className="text-gray-200 mt-0.5">{selectedNode.raw.owner}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Hardware Profile</span>
                    <p className="text-gray-200 mt-0.5">{selectedNode.raw.type}</p>
                  </div>
                </>
              )}

              {selectedNode.type === 'case' && (
                <>
                  <div>
                    <span className="text-xs text-gray-400">Scope Description</span>
                    <p className="text-gray-300 text-xs mt-0.5">{selectedNode.raw.description}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Lead Investigator</span>
                    <p className="text-gray-200 text-xs mt-0.5">{selectedNode.raw.leadInvestigator}</p>
                  </div>
                </>
              )}

              {/* Neighbors list */}
              {connectionDetails && connectionDetails.connectedNodes.length > 0 && (
                <div className="border-t border-cyber-border/50 pt-3">
                  <span className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                    <Link2 size={13} className="text-cyber-accent" />
                    Correlated Nodes ({connectionDetails.connectedNodes.length})
                  </span>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                    {connectionDetails.connectedNodes.map(node => (
                      <button
                        key={node.id}
                        onClick={() => {
                          setSelectedNode(node);
                          if (node.type === 'evidence') {
                            onSelectEvidence(node.raw);
                          }
                        }}
                        className="w-full text-left bg-cyber-bg hover:bg-cyber-border/20 border border-cyber-border/40 rounded px-2 py-1 text-2xs font-mono text-gray-300 flex items-center justify-between group transition"
                      >
                        <span className="truncate pr-2">{node.label}</span>
                        <span className="text-2xs text-cyber-accent font-semibold group-hover:underline">View</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col justify-center items-center text-center text-gray-400 py-12">
            <AlertTriangle size={32} className="text-cyber-border mb-3" />
            <p className="text-sm">No node selected</p>
            <p className="text-xs text-gray-500 max-w-[200px] mt-1">
              Select any node in the map to reveal cryptographic connections and cross-modal correlations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
