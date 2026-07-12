import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Shield, X, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export default function CaseFolderCard({ c, idx, evidence, AnimatedCounter }) {
  const [isScanning, setIsScanning] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const caseEvids = evidence.filter(e => e.caseId === c.id);
  const avgRisk = Math.round(caseEvids.reduce((acc, curr) => acc + curr.riskScore, 0) / (caseEvids.length || 1));
  const isHigh = avgRisk > 75;
  const riskLabel = avgRisk > 75 ? 'HIGH RISK' : avgRisk > 45 ? 'MEDIUM RISK' : 'LOW RISK';
  
  // Simulate AI Scan timeline on mount
  useEffect(() => {
    const scanTime = 1800 + idx * 400;
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 10;
      });
    }, scanTime / 10);

    const timer = setTimeout(() => {
      setIsScanning(false);
    }, scanTime);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [idx]);

  // Risk Circular Ring dimensions
  const radius = 22;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (avgRisk / 100) * circumference;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { delay: idx * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
        }}
        whileHover={{ 
          scale: 1.03, 
          y: -8, 
          boxShadow: "0 15px 35px rgba(168,85,247,0.22)",
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        onClick={() => setIsModalOpen(true)}
        className={`p-6 bg-gradient-to-tr from-cyber-bg/90 via-cyber-card/40 to-cyber-bg/95 border rounded-xl flex justify-between items-center transition-all relative overflow-hidden min-h-[140px] group corner-brackets cursor-pointer ${
          isHigh 
            ? 'border-cyber-red/40 hover:border-cyber-red' 
            : 'border-cyber-border hover:border-cyber-accent/50'
        }`}
      >
        {/* Subtle grid overlay inside cards */}
        <div className="absolute inset-0 card-grid-overlay opacity-30 pointer-events-none" />

        {/* Dynamic scan line travels across the card face */}
        {isScanning && (
          <div className="absolute inset-0 bg-cyber-accent/[0.03] pointer-events-none">
            <div className="absolute left-0 right-0 h-0.5 bg-cyber-accent/60 shadow-[0_0_10px_#A855F7] animate-[hud-scan_2s_linear_infinite]" />
          </div>
        )}

        {/* Particle nodes floating effect on hover */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-40 transition-opacity duration-300">
          <div className="absolute w-1 h-1 bg-cyber-accent rounded-full animate-ping top-4 left-1/3" />
          <div className="absolute w-1.5 h-1.5 bg-cyber-accent rounded-full animate-pulse bottom-6 right-1/4" />
        </div>

        {/* Travel border line effect */}
        <div className="absolute inset-0 border border-cyber-accent/0 group-hover:border-cyber-accent/20 rounded-xl transition duration-500 pointer-events-none" />

        {/* Left: Case Info Section */}
        <div className="space-y-2 flex-grow pr-4 z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-3xs font-bold text-cyber-accent bg-cyber-accent/10 px-2 py-0.5 rounded border border-cyber-accent/25 tracking-widest">{c.id}</span>
            <h4 className="text-sm font-bold text-gray-100 group-hover:text-cyber-accent transition">{c.name}</h4>
            
            {/* Live analysis indicator */}
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyber-accent/80 font-bold ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent blink-hud-node" />
              <span>LIVE ANALYSIS</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">{c.description}</p>
          
          <div className="flex items-center gap-4 text-4xs font-mono uppercase tracking-wider text-gray-500 pt-1">
            <span>Evidence: <strong className="text-gray-300 font-bold">{caseEvids.length} nodes linked</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {isScanning ? (
                <>
                  <span className="text-cyber-orange blink-hud-node">AI ANALYZING...</span>
                  <span className="text-cyber-orange">({scanProgress}%)</span>
                </>
              ) : (
                <span className="text-cyber-green flex items-center gap-0.5">
                  <CheckCircle size={10} />
                  Evidence Verified
                </span>
              )}
            </span>
          </div>

          {/* Hidden Open Case action slide up */}
          <div className="max-h-0 opacity-0 group-hover:max-h-8 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 text-cyber-accent font-mono text-[9px] uppercase font-bold tracking-wider pt-2">
            <span>Open Case File</span>
            <ChevronRight size={10} className="animate-[bounce_1.5s_infinite]" />
          </div>
        </div>

        {/* Right: Circular Risk Gauge Panel */}
        <div className="text-right flex items-center gap-4 border-l border-cyber-border/40 pl-6 min-w-[170px] justify-end z-10">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-gray-400 font-mono tracking-wider uppercase">Risk Score</span>
            <span className={`text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 rounded border inline-block mt-2 ${
              isHigh 
                ? 'text-cyber-red border-cyber-red/30 bg-cyber-red/5 animate-pulse' 
                : avgRisk > 45 
                  ? 'text-cyber-orange border-cyber-orange/30 bg-cyber-orange/5' 
                  : 'text-cyber-green border-cyber-green/30 bg-cyber-green/5'
            }`}>
              {riskLabel}
            </span>
          </div>

          {/* SVG Circular Ring Gauge */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r={radius} stroke="rgba(168, 85, 247, 0.08)" strokeWidth={strokeWidth} fill="transparent" />
              <motion.circle 
                cx="28" cy="28" r={radius} 
                stroke={isHigh ? '#EF4444' : avgRisk > 45 ? '#F97316' : '#10B981'} 
                strokeWidth={strokeWidth} 
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, delay: idx * 0.15 + 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-mono font-bold ${isHigh ? 'text-cyber-red' : avgRisk > 45 ? 'text-cyber-orange' : 'text-cyber-green'}`}>
                <AnimatedCounter value={avgRisk} />%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Shared Element Case Investigation Modal View */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-cyber-bg/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-2xl bg-gradient-to-b from-[#160D2C] to-[#0A0515] border border-cyber-accent/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.3)] z-10 relative corner-brackets"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 border-b border-cyber-border pb-4 mb-4">
                <Shield className="text-cyber-accent" size={24} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyber-accent bg-cyber-accent/10 px-2 py-0.5 rounded border border-cyber-accent/25">{c.id}</span>
                    <h3 className="text-lg font-bold text-white">{c.name}</h3>
                  </div>
                  <p className="text-3xs text-gray-500 font-mono mt-0.5">Lead Officer: {c.leadInvestigator || 'Unassigned'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-2xs font-mono text-cyber-accent uppercase tracking-wider">Case Objective</h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">{c.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-cyber-bg/40 border border-cyber-border/60 rounded-xl p-4">
                    <span className="text-3xs font-mono text-gray-500 uppercase">Analysis Risk Score</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className={`text-2xl font-mono font-bold ${isHigh ? 'text-cyber-red' : 'text-cyber-orange'}`}>{avgRisk}%</span>
                      <span className="text-4xs font-mono text-gray-400 uppercase">Average Weight</span>
                    </div>
                  </div>
                  <div className="bg-cyber-bg/40 border border-cyber-border/60 rounded-xl p-4">
                    <span className="text-3xs font-mono text-gray-500 uppercase">Related Elements</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-mono font-bold text-cyber-blue">{caseEvids.length} Files</span>
                      <span className="text-4xs font-mono text-gray-400">linked to case</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-2xs font-mono text-cyber-accent uppercase tracking-wider mb-2">Evidence List Summary</h4>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {caseEvids.length > 0 ? (
                      caseEvids.map(ev => (
                        <div key={ev.id} className="p-2.5 bg-cyber-bg/50 border border-cyber-border/40 rounded-lg flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-cyber-accent" />
                            <span className="text-gray-200 font-bold">{ev.id}</span>
                            <span className="text-gray-400 truncate max-w-[280px]">{ev.title}</span>
                          </div>
                          <span className="text-cyber-red font-mono font-semibold">{ev.riskScore}% Risk</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 font-mono">No evidence linked yet.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-cyber-border pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-cyber-accent hover:bg-cyber-accent/80 text-white text-xs font-mono px-4 py-2 rounded-lg transition"
                >
                  Close Case File
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
