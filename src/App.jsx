import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Layers, 
  GitBranch, 
  CheckSquare, 
  Eye, 
  Clock, 
  Terminal, 
  Search, 
  BookOpen, 
  Settings, 
  TrendingUp, 
  Check, 
  X, 
  AlertOctagon, 
  ChevronRight, 
  Send,
  Download,
  AlertTriangle,
  RefreshCw,
  User,
  Fingerprint,
  Calendar,
  Filter,
  Info
} from 'lucide-react';
import { mockCases, mockDevices, initialEvidenceItems, mockRelations, initialAuditLogs } from './mockData';
import EvidenceGraph from './components/EvidenceGraph';
import MobileSimulator from './components/MobileSimulator';
import CaseFolderCard from './components/CaseFolderCard';

// Standardized animations based on spec
const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const duration = 1200; // ms
    const increment = Math.ceil(value / 30) || 1;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        clearInterval(timer);
        setCount(value);
      } else {
        setCount(start);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count}</>;
}

export default function App() {
  const [appMode, setAppMode] = useState('investigator'); // investigator, mobile
  const [bootPhase, setBootPhase] = useState('logo'); // logo, scanning, cards, ready
  useEffect(() => {
    const t1 = setTimeout(() => setBootPhase('scanning'), 600);
    const t2 = setTimeout(() => setBootPhase('cards'), 1800);
    const t3 = setTimeout(() => setBootPhase('ready'), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [evidence, setEvidence] = useState(initialEvidenceItems);
  const [selectedEvid, setSelectedEvid] = useState(initialEvidenceItems[1]); // Default to image metadata log #02
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [selectedCaseFilter, setSelectedCaseFilter] = useState('ALL');
  
  // Floating Background particles
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const generated = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 20}s`,
      duration: `${20 + Math.random() * 25}s`,
      size: `${8 + Math.random() * 12}px`,
      char: ['01', '10', '0x3F', '🔑', '🛡️', '[EVD]', 'SYS_LOG', 'KP_CYBER', 'HEX_E4', '{ID}', '1', '0'][Math.floor(Math.random() * 12)]
    }));
    setParticles(generated);
  }, []);
  
  // Timeline zoom/filter state
  const [timeRange, setTimeRange] = useState([0, 100]); // percentage of range

  // Chat Copilot State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'KAVACH-AI Command Interface active. State your query regarding active Cases (#101, #102, #103) or Device correlations.',
      timestamp: new Date().toLocaleTimeString(),
      visualization: null
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Expandable factors in Risk Scoring
  const [expandedFactor, setExpandedFactor] = useState(null);

  // Stats Counter Animation Mock
  const [stats, setStats] = useState({ items: 0, cases: 0, leads: 0, pending: 0 });
  useEffect(() => {
    // Stat count animating logic on mount
    const timer = setTimeout(() => {
      setStats({
        items: evidence.length,
        cases: mockCases.length,
        leads: evidence.filter(e => e.riskScore > 75).length,
        pending: evidence.filter(e => e.triageStatus === 'Ambiguous — Needs Judgment').length
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [evidence]);

  // Handle Triage status change
  const handleTriage = (evidId, newStatus, reason) => {
    const timestamp = new Date().toISOString();
    const investigatorId = "KP-8893 (Investigator R. Nair)";

    setEvidence(prev => prev.map(item => {
      if (item.id === evidId) {
        return { ...item, triageStatus: newStatus };
      }
      return item;
    }));

    // Update log
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp,
      actor: investigatorId,
      action: `Triage updated to [${newStatus}]. Reason: "${reason || 'N/A'}"`,
      target: evidId
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Keep selectedEvidence in sync
    setSelectedEvid(prev => prev.id === evidId ? { ...prev, triageStatus: newStatus } : prev);
  };

  // Chat Submission Handler
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Generate responsive response based on keyword matching
    setTimeout(() => {
      let aiResponseText = '';
      let visualization = null;

      const lowerText = userText.toLowerCase();

      if (lowerText.includes('device-001') || lowerText.includes('dev-001')) {
        const linked = evidence.filter(e => e.deviceId === 'DEV-001');
        aiResponseText = `Found ${linked.length} evidence items linked to Suspect Device A (Mobile). The items range in risk from 78% to 92%. A temporal correlation indicates high density matching around June 10, 2026.`;
        visualization = {
          type: 'graph',
          nodes: [
            { id: 'DEV-001', label: 'DEV-001', type: 'device', color: '#3B82F6' },
            ...linked.map(l => ({ id: l.id, label: l.id, type: 'evidence', color: l.riskScore > 75 ? '#EF4444' : '#F59E0B' }))
          ]
        };
      } else if (lowerText.includes('case-101') || lowerText.includes('aurora') || lowerText.includes('101')) {
        const linked = evidence.filter(e => e.caseId === 'CASE-101');
        aiResponseText = `Project Aurora (CASE-101) summary: 5 mock evidence nodes connected. The average risk score is 74.2%. Geographic logs indicate operations centered in the Trivandrum Sector near cell tower id 'Trivandrum-3342'.`;
        visualization = {
          type: 'timeline',
          events: linked.map(l => ({ id: l.id, title: l.title, date: l.timestamp.split('T')[0] }))
        };
      } else if (lowerText.includes('summarize') || lowerText.includes('list') || lowerText.includes('evidence')) {
        aiResponseText = `Ingested synthetic dataset holds ${evidence.length} entries across 3 mock cases. High risk indices account for ${evidence.filter(e => e.riskScore > 75).length} priority targets.`;
      } else {
        aiResponseText = `Command processed. I have scanned the mock repository. Please specify the case (e.g., "summarize Case 101") or device (e.g., "show evidence for DEV-001") for focused inline visualization.`;
      }

      // Add audit log for chat query
      const newLog = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Investigator R. Nair (ID: KP-8893)',
        action: `Copilot Query: "${userText}"`,
        target: 'Copilot Chat'
      };
      setAuditLogs(prev => [newLog, ...prev]);

      setChatMessages(prev => [...prev, {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString(),
        visualization
      }]);
    }, 850);
  };

  // Filter evidence based on active selection filters
  const filteredEvidence = evidence.filter(e => {
    // Case filter
    if (selectedCaseFilter !== 'ALL' && e.caseId !== selectedCaseFilter) return false;
    
    // Timeline slider filter
    const dates = evidence.map(x => new Date(x.timestamp).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const rangeSpan = maxDate - minDate;
    
    const startVal = minDate + (rangeSpan * (timeRange[0] / 100));
    const endVal = minDate + (rangeSpan * (timeRange[1] / 100));
    const itemTime = new Date(e.timestamp).getTime();
    
    return itemTime >= startVal && itemTime <= endVal;
  });

  return (
    <div className="min-h-screen bg-cyber-bg cyber-grid flex flex-col font-sans select-none overflow-x-hidden relative">
      {/* Initial HUD Boot Scan Line */}
      {bootPhase === 'scanning' && (
        <div className="absolute left-0 right-0 w-full h-[3px] bg-cyber-accent/60 shadow-[0_0_12px_#A855F7] z-50 pointer-events-none initial-scan-sweep" />
      )}

      {/* Centered Watermark Police Logo Badge in Background */}
      <div id="bg-police-child-animation" className="fixed inset-0 flex items-center justify-center pointer-events-none z-30 overflow-hidden select-none">
        {/* Subtle Police Emergency Ambient Light reflections (Red & Blue sweeps) */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-between opacity-[0.03] blur-3xl pointer-events-none">
          <div className="w-[400px] h-[400px] rounded-full animate-[pulse_10s_infinite_alternate]" style={{ backgroundColor: '#2563eb', transform: 'translate(-10%, -10%)' }} />
          <div className="w-[400px] h-[400px] rounded-full animate-[pulse_8s_infinite_alternate]" style={{ backgroundColor: '#dc2626', transform: 'translate(10%, 10%)' }} />
        </div>

        {/* Floating, Breathing, Perspective-driven Shield badge */}
        <motion.div
          animate={{
            y: [0, -10, 10, 0],
            rotateX: [0, 4, -4, 0],
            rotateY: [0, -5, 5, 0],
            opacity: [0.06, 0.11, 0.06]
          }}
          transition={{
            y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
            rotateX: { duration: 9, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: 9, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          className="w-[620px] h-[620px] text-cyber-accent flex items-center justify-center relative"
        >
          {/* Horizontal Scanner laser beam traversing the shield */}
          <div className="absolute left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-cyber-accent to-transparent shadow-[0_0_10px_#A855F7] animate-[hud-scan_6s_linear_infinite]" style={{ opacity: 0.4 }} />

          {/* Child Protection Digital Circle/Rings */}
          <div className="absolute w-[450px] h-[450px] rounded-full border border-cyber-accent/5 animate-[spin_20s_linear_infinite] border-dashed" />
          <div className="absolute w-[360px] h-[360px] rounded-full border border-cyber-accent/10 animate-[spin_12s_linear_infinite_reverse]" />

          <svg className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100" fill="currentColor">
            {/* Shield Outline bevels */}
            <path d="M50 5 L85 20 V55 C85 75 50 95 50 95 C50 95 15 75 15 55 V20 L50 5 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <path d="M50 10 L80 23 V53 C80 70 50 88 50 88 C50 88 20 70 20 53 V23 L50 10 Z" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 1.5" />
            
            {/* Kerala Police Star Emblem */}
            <polygon points="50,23 52.5,29 59,29 54,32.5 56,38.5 50,35 44,38.5 46,32.5 41,29 47.5,29" fill="currentColor" opacity="0.4" />
            
            {/* Detailed Parent-Child Protection Silhouette path (Respectful, Professional) */}
            {/* Parent */}
            <path d="M44 44 C44 41.5 46.5 41.5 46.5 44 C46.5 46.5 44 46.5 44 44 Z M42.5 49 C42.5 47 48 47 48 49 V57 H42.5 V49 Z" fill="currentColor" opacity="0.65" />
            {/* Child */}
            <path d="M52 48.5 C52 46.5 54.5 46.5 54.5 48.5 C54.5 50.5 52 50.5 52 48.5 Z M50.5 52.5 C50.5 51 56 51 56 52.5 V57 H50.5 V52.5 Z" fill="currentColor" opacity="0.75" />
            {/* Protective circle / cradling hand mock path */}
            <path d="M33 55 C33 65 43 70 50 70 C57 70 67 65 67 55" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 1" opacity="0.5" />

            <path d="M30 73 Q50 80 70 73" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <text x="50" y="63" textAnchor="middle" fontSize="3.3" fontWeight="bold" letterSpacing="0.4" fill="currentColor" fontFamily="monospace">KERALA POLICE</text>
            <text x="50" y="67" textAnchor="middle" fontSize="2.3" fontWeight="bold" fill="currentColor" fontFamily="monospace">CHILD SAFEGUARD</text>
          </svg>
        </motion.div>
      </div>

      {/* Moving tactical radar sweeps (police/forensics style) + Floating bits */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Tactical Radar 1 (Top-Left) */}
        <div className="absolute top-[12%] left-[4%] w-[200px] h-[200px] border border-cyber-accent/10 rounded-full flex items-center justify-center">
          <div className="absolute w-[140px] h-[140px] border border-cyber-accent/5 rounded-full" />
          <div className="absolute w-[70px] h-[70px] border border-cyber-accent/5 rounded-full" />
          <div className="absolute w-full h-[1px] bg-cyber-accent/5" />
          <div className="absolute h-full w-[1px] bg-cyber-accent/5" />
          <div className="absolute w-full h-full rounded-full radar-sweep-line" />
          {/* Target points */}
          <div className="absolute top-[45px] left-[60px] w-1.5 h-1.5 rounded-full bg-cyber-red blink-hud-node" />
          <div className="absolute bottom-[35px] right-[55px] w-1.5 h-1.5 rounded-full bg-cyber-green blink-hud-node" style={{ animationDelay: '0.6s' }} />
          <span className="absolute top-2 left-2 text-[8px] font-mono text-cyber-accent/30 tracking-widest uppercase animate-pulse">SCANNING...</span>
        </div>

        {/* Tactical Radar 2 (Bottom-Right) */}
        <div className="absolute bottom-[10%] right-[4%] w-[260px] h-[260px] border border-cyber-accent/10 rounded-full flex items-center justify-center">
          <div className="absolute w-[180px] h-[180px] border border-cyber-accent/5 rounded-full" />
          <div className="absolute w-[90px] h-[90px] border border-cyber-accent/5 rounded-full" />
          <div className="absolute w-full h-[1px] bg-cyber-accent/5" />
          <div className="absolute h-full w-[1px] bg-cyber-accent/5" />
          <div className="absolute w-full h-full rounded-full radar-sweep-line" style={{ animationDuration: '12s' }} />
          <span className="absolute bottom-3 right-3 text-[8px] font-mono text-cyber-accent/30 tracking-widest uppercase">LOCATING DETECTS</span>
        </div>
        
        {/* Floating elements */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute font-mono text-cyber-accent/20 select-none pointer-events-none"
            style={{
              left: p.left,
              bottom: '-40px',
              fontSize: p.size,
              animationName: 'float-up',
              animationDuration: p.duration,
              animationDelay: p.delay,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear'
            }}
          >
            {p.char}
          </div>
        ))}
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full ambient-glow-1 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full ambient-glow-2 pointer-events-none" />

      {/* Main Glass Header Navigation */}
      <header className="sticky top-0 z-50 cyber-glass border-b border-cyber-border/40 backdrop-blur-md px-6 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          {/* 3D Perspective Police Shield Logo System */}
          <div style={{ perspective: '800px' }} className="relative flex items-center justify-center">
            <motion.div
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ 
                rotateY: [0, 15, -15, 0], 
                y: [0, -3, 3, 0] 
              }}
              transition={{ 
                rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-11 h-11 bg-gradient-to-tr from-[#0F0A20] via-[#2C184D] to-[#0F0A20] border border-cyber-accent/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.35)] cursor-pointer hover:border-cyber-accent/60 shine-sweep-effect relative"
            >
              {/* Orbiting particles */}
              <div className="absolute w-14 h-14 rounded-full border border-cyber-accent/10 animate-[spin_8s_linear_infinite]" style={{ transform: 'rotateX(75deg)' }} />
              {/* Detailed Inner SVG chrome Shield */}
              <svg className="w-8 h-8 text-cyber-accent drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 8 L82 22 V52 C82 72 50 90 50 90 C50 90 18 72 18 52 V22 L50 8 Z" fill="url(#chrome-face)" stroke="#C084FC" strokeWidth="2.5" />
                <path d="M50 14 L76 25 V49 C76 66 50 82 50 82 C50 82 24 66 24 49 V25 L50 14 Z" fill="#060211" opacity="0.8" stroke="#A855F7" strokeWidth="1" strokeDasharray="2 1" />
                <polygon points="50,30 53,37 60,37 55,41 57,48 50,44 43,48 45,41 40,37 47,37" fill="#C084FC" />
                <defs>
                  <linearGradient id="chrome-face" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E0B36" />
                    <stop offset="50%" stopColor="#3E1A68" />
                    <stop offset="100%" stopColor="#0B0314" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wider text-cyber-text-primary m-0 font-mono">KAVACH-AI</h1>
              <div className="flex items-center gap-1.5 ml-2 font-mono text-[9px] text-cyber-green bg-cyber-green/10 border border-cyber-green/20 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green blink-hud-node" />
                <span>AI SECURE SYSTEM ONLINE</span>
              </div>
            </div>
            <p className="text-4xs md:text-3xs text-gray-400 mt-0.5 tracking-wider">Kerala Agentic Vulnerability Analysis & Child Protection Assistant</p>
          </div>
        </div>

        {/* Horizontal Navigation Links */}
        {appMode === 'investigator' && (
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Layers },
              { id: 'graph', label: 'Evidence Map', icon: GitBranch },
              { id: 'triage', label: 'Triage Queue', icon: CheckSquare },
              { id: 'risk', label: 'Risk Analysis', icon: AlertOctagon },
              { id: 'timeline', label: 'Timeline Reconstruction', icon: Clock },
              { id: 'copilot', label: 'Investigator Copilot', icon: Terminal },
              { id: 'audit', label: 'Audit Log & Reports', icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // log navigation
                    setAuditLogs(prev => [{
                      id: `LOG-${Date.now()}`,
                      timestamp: new Date().toISOString(),
                      actor: 'Investigator R. Nair (ID: KP-8893)',
                      action: `Navigated to ${tab.label}`,
                      target: 'UI Router'
                    }, ...prev]);
                  }}
                  className={`relative px-4 py-2 text-xs font-mono font-medium rounded-lg flex items-center gap-2 transition duration-300 ${
                    isActive ? 'text-cyber-accent bg-cyber-accent/10 border border-cyber-accent/20' : 'text-gray-400 hover:text-gray-200 hover:bg-cyber-border/20'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabGlow"
                      className="absolute -bottom-1 left-4 right-4 h-0.5 bg-cyber-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Toggle Mode Selectors */}
        <div className="flex items-center gap-2 font-mono text-3xs border border-cyber-border/80 rounded-lg p-0.5 bg-cyber-bg/40">
          <button
            onClick={() => setAppMode('investigator')}
            className={`px-3 py-1.5 rounded transition ${
              appMode === 'investigator' 
                ? 'bg-cyber-accent text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Investigator Workspace
          </button>
          <button
            onClick={() => setAppMode('mobile')}
            className={`px-3 py-1.5 rounded transition ${
              appMode === 'mobile' 
                ? 'bg-cyber-accent text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Citizen SOS App
          </button>
        </div>

        {/* Small screen indicator */}
        {appMode === 'investigator' && (
          <div className="lg:hidden text-2xs font-mono text-cyber-accent border border-cyber-accent/30 rounded bg-cyber-accent/10 px-2.5 py-1">
            Active View: {activeTab.toUpperCase()}
          </div>
        )}
      </header>

      <main className="flex-grow max-w-[95%] w-full mx-auto p-3 md:p-5 z-10 flex flex-col">
        {appMode === 'mobile' ? (
          <div className="flex-grow flex items-center justify-center py-6">
            <MobileSimulator />
          </div>
        ) : (
          <>
            {/* Quick Dropdown selector for filters on top of all screens */}
            <div className="flex flex-wrap justify-between items-center bg-cyber-card/40 border border-cyber-border/40 rounded-xl p-3.5 mb-6 gap-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-cyber-accent" />
            <span className="text-2xs font-mono uppercase text-gray-400">Target Investigation Scope:</span>
            <select
              value={selectedCaseFilter}
              onChange={(e) => setSelectedCaseFilter(e.target.value)}
              className="bg-cyber-bg border border-cyber-border text-xs text-gray-200 rounded px-2 py-1 outline-none font-mono focus:border-cyber-accent transition"
            >
              <option value="ALL">All Active Cases</option>
              {mockCases.map(c => (
                <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-4xs md:text-3xs text-gray-500 font-mono">
            <Info size={12} className="text-cyber-accent/60" />
            <span>MOCK DEMO PLATFORM — CLEARLY LABELED SYNTHETIC DATA ONLY. NO REAL EVIDENCE INGESTED.</span>
          </div>
        </div>

        {/* Navigation for Mobile Screens */}
        <div className="flex lg:hidden overflow-x-auto gap-2 pb-4 mb-2 border-b border-cyber-border/30">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'graph', label: 'Map' },
            { id: 'triage', label: 'Triage' },
            { id: 'risk', label: 'Risk' },
            { id: 'timeline', label: 'Timeline' },
            { id: 'copilot', label: 'Copilot' },
            { id: 'audit', label: 'Logs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap ${
                activeTab === tab.id ? 'bg-cyber-accent text-white' : 'bg-cyber-card text-gray-400 border border-cyber-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Views Area */}
        <div className="flex-grow flex flex-col justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-grow flex flex-col"
            >
              {/* ==================== MODULE 1: DASHBOARD (HOME) ==================== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Overview Cards */}
                  <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Total Evidence Items", val: stats.items, color: "text-cyber-blue" },
                      { label: "Active Case Profiles", val: stats.cases, color: "text-cyber-accent" },
                      { label: "High-Priority Leads (>75)", val: stats.leads, color: "text-cyber-red" },
                      { label: "Pending Human Review", val: stats.pending, color: "text-cyber-orange" }
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="cyber-glass border border-cyber-border/60 rounded-xl p-6 flex flex-col justify-between min-h-[135px] corner-brackets neon-glow-border relative overflow-hidden"
                      >
                        {/* Holographic light sweep reflection */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] hover:translate-x-[150%] transition-transform duration-1000" />
                        <span className="text-3xs uppercase tracking-wider font-mono text-gray-400 font-semibold">{stat.label}</span>
                        <div className="flex justify-between items-end mt-4">
                          <span className={`text-4xl md:text-5xl font-mono font-bold ${stat.color}`}>
                            <AnimatedCounter value={stat.val} />
                          </span>
                          <span className="text-4xs text-gray-500 font-mono uppercase">Verified AI Log</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Active Cases & Recent Activities Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Active Cases */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="cyber-glass border border-cyber-border rounded-xl p-6 flex flex-col h-full justify-between">
                        <div>
                          <h3 className="text-sm font-semibold font-mono tracking-wider text-cyber-text-primary border-b border-cyber-border pb-3 mb-4 flex items-center gap-2">
                            <Shield size={16} className="text-cyber-accent" />
                            Active Case Folders
                          </h3>
                          <div className="space-y-4">
                            {mockCases.map((c, idx) => (
                              <CaseFolderCard 
                                key={c.id} 
                                c={c} 
                                idx={idx} 
                                evidence={evidence} 
                                AnimatedCounter={AnimatedCounter} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Recent activity feed */}
                    <div className="cyber-glass border border-cyber-border rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
                      <div className="hud-scanner pointer-events-none" />
                      <div>
                        <h3 className="text-sm font-semibold font-mono tracking-wider text-cyber-text-primary border-b border-cyber-border pb-3 mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent blink-hud-node" />
                          <TrendingUp size={16} className="text-cyber-accent" />
                          Recent Action Logs
                        </h3>
                        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                          {auditLogs.slice(0, 8).map((log, idx) => (
                            <motion.div 
                              key={log.id} 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.08 } }}
                              className="border-l-2 border-cyber-accent/60 pl-3 py-0.5 space-y-1"
                            >
                              <div className="flex justify-between items-center text-4xs font-mono">
                                <span className="text-cyber-blue font-bold">{log.actor}</span>
                                <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-3xs text-gray-300 leading-relaxed font-mono">
                                {log.action}
                              </p>
                              {log.action.includes('Generated') ? (
                                <span className="text-5xs uppercase tracking-wider text-cyber-green mt-1.5 block font-mono font-semibold">
                                  Analyzing → Processing → Completed ✓
                                </span>
                              ) : null}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Launch Triage Button - Full Width CTA */}
                  <motion.button 
                    onClick={() => setActiveTab('triage')}
                    whileHover={{ scale: 1.005, boxShadow: "0 0 25px rgba(168,85,247,0.4)" }}
                    whileTap={{ scale: 0.995 }}
                    className="w-full bg-gradient-to-r from-cyber-accent/20 via-cyber-accent/30 to-cyber-accent/20 border border-cyber-accent/50 hover:border-cyber-accent text-cyber-text-primary text-sm font-mono font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition group shine-sweep-effect cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  >
                    Launch Interactive Triage Queue
                    <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                  </motion.button>
                </div>
              )}

              {/* ==================== MODULE 2: INTERACTIVE EVIDENCE GRAPH ==================== */}
              {activeTab === 'graph' && (
                <div className="flex-grow flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-base font-bold font-mono text-cyber-text-primary flex items-center gap-1.5">
                        <GitBranch size={18} className="text-cyber-accent" />
                        Cross-Modal Evidence Map
                      </h2>
                      <p className="text-2xs text-gray-400">Forces display clusters based on geographic parameters, hashes, and times.</p>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <EvidenceGraph
                      evidenceItems={filteredEvidence}
                      devices={mockDevices}
                      cases={mockCases}
                      relations={mockRelations}
                      onSelectEvidence={(ev) => {
                        setSelectedEvid(ev);
                        // Open detail panel trigger tab
                        setActiveTab('risk');
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ==================== MODULE 3: CONFIDENCE-WEIGHTED TRIAGE QUEUE ==================== */}
              {activeTab === 'triage' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold font-mono text-cyber-text-primary flex items-center gap-2">
                      <CheckSquare size={18} className="text-cyber-accent" />
                      Confidence-Weighted Triage Queue
                    </h2>
                    <p className="text-2xs text-gray-400">
                      Sort and action synthetic evidence. Every action must be manually approved; the system never auto-resolves.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lanes */}
                    {[
                      { 
                        title: "High Confidence — Verify", 
                        status: "High Confidence — Verify",
                        color: "border-cyber-red/40 bg-cyber-red/5 text-cyber-red" 
                      },
                      { 
                        title: "Ambiguous — Needs Judgment", 
                        status: "Ambiguous — Needs Judgment",
                        color: "border-cyber-orange/40 bg-cyber-orange/5 text-cyber-orange" 
                      },
                      { 
                        title: "Low Priority — Batch Review", 
                        status: "Low Priority — Batch Review",
                        color: "border-cyber-blue/40 bg-cyber-blue/5 text-cyber-blue" 
                      }
                    ].map(lane => {
                      const laneEvids = filteredEvidence.filter(e => e.triageStatus === lane.status);
                      return (
                        <div key={lane.title} className="cyber-glass border border-cyber-border rounded-xl p-4 flex flex-col min-h-[450px]">
                          <div className={`p-2.5 rounded-lg border font-mono text-xs font-semibold text-center mb-4 ${lane.color}`}>
                            {lane.title} ({laneEvids.length})
                          </div>
                          
                          <div className="flex-grow space-y-3 overflow-y-auto max-h-[500px] pr-1">
                            {laneEvids.length === 0 ? (
                              <div className="text-center text-4xs font-mono text-gray-500 py-12">LANE VACANT</div>
                            ) : (
                              laneEvids.map(ev => (
                                <div key={ev.id} className="p-3 bg-cyber-bg/70 hover:bg-cyber-bg border border-cyber-border hover:border-cyber-accent/40 rounded-lg space-y-3 transition duration-300">
                                  <div className="flex justify-between items-start">
                                    <span className="font-mono text-2xs font-bold text-cyber-accent">{ev.id}</span>
                                    <span className="font-mono text-3xs font-semibold text-gray-400 bg-cyber-border/40 px-1.5 py-0.5 rounded">
                                      Conf: {ev.confidence}%
                                    </span>
                                  </div>
                                  <h4 className="text-3xs font-semibold text-gray-200 font-mono truncate">{ev.title}</h4>
                                  <p className="text-4xs text-gray-400 font-mono line-clamp-2 leading-normal">
                                    {ev.snippet}
                                  </p>
                                  
                                  {/* Quick Decision buttons */}
                                  <div className="flex gap-1.5 pt-2 border-t border-cyber-border/40">
                                    <button
                                      onClick={() => handleTriage(ev.id, 'Low Priority — Batch Review', 'Moved to low priority via triage queue')}
                                      className="flex-1 bg-cyber-blue/10 hover:bg-cyber-blue/25 border border-cyber-blue/30 text-cyber-blue text-4xs font-mono py-1 rounded transition"
                                    >
                                      Batch
                                    </button>
                                    <button
                                      onClick={() => handleTriage(ev.id, 'Ambiguous — Needs Judgment', 'Moved to ambiguous via triage queue')}
                                      className="flex-1 bg-cyber-orange/10 hover:bg-cyber-orange/25 border border-cyber-orange/30 text-cyber-orange text-4xs font-mono py-1 rounded transition"
                                    >
                                      Review
                                    </button>
                                    <button
                                      onClick={() => {
                                        const r = prompt("Provide audit trail verification note:") || "Verified";
                                        handleTriage(ev.id, 'Verified & Locked', r);
                                      }}
                                      className="flex-1 bg-cyber-green/10 hover:bg-cyber-green/25 border border-cyber-green/30 text-cyber-green text-4xs font-mono py-1 rounded transition"
                                    >
                                      Verify
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ==================== MODULE 4: EXPLAINABLE RISK SCORING & DETECTOR ==================== */}
              {activeTab === 'risk' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left panel: selected evidence risk scores */}
                  <div className="lg:col-span-2 cyber-glass border border-cyber-border rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold font-mono tracking-wider text-cyber-text-primary border-b border-cyber-border pb-3 mb-4 flex items-center gap-2">
                        <AlertOctagon size={16} className="text-cyber-accent" />
                        Explainable Risk Assessment Matrix
                      </h3>

                      {selectedEvid ? (
                        <div className="space-y-6">
                          {/* Top row: Radial score + Details header */}
                          <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Radial Chart */}
                            <div className="relative w-36 h-36 flex items-center justify-center bg-cyber-bg/50 border border-cyber-border rounded-xl p-4">
                              <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                  className="text-cyber-border"
                                  strokeWidth="2.2"
                                  stroke="currentColor"
                                  fill="none"
                                  transform="rotate(-90 18 18)"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <motion.path
                                  initial={{ strokeDasharray: "0, 100" }}
                                  animate={{ strokeDasharray: `${selectedEvid.riskScore}, 100` }}
                                  transition={{ duration: 1.2, ease: "easeOut" }}
                                  className="text-cyber-accent"
                                  strokeWidth="2.8"
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="none"
                                  transform="rotate(-90 18 18)"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <text x="18" y="16.5" textAnchor="middle" fill="#F3F4F6" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                                  {selectedEvid.riskScore}
                                </text>
                                <text x="18" y="22" textAnchor="middle" fill="#9CA3AF" fontSize="2.2" fontWeight="bold" letterSpacing="0.2" fontFamily="monospace">
                                  RISK
                                </text>
                                <text x="18" y="24.5" textAnchor="middle" fill="#9CA3AF" fontSize="2.2" fontWeight="bold" letterSpacing="0.2" fontFamily="monospace">
                                  INDEX
                                </text>
                              </svg>
                            </div>


                            {/* Evidence Info Header */}
                            <div className="flex-grow space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-cyber-accent">{selectedEvid.id}</span>
                                <h4 className="font-mono text-xs font-semibold text-gray-200">{selectedEvid.title}</h4>
                              </div>
                              <p className="text-3xs text-gray-400 leading-relaxed font-mono bg-cyber-bg p-2 rounded border border-cyber-border/40">
                                {selectedEvid.snippet}
                              </p>
                              <div className="flex gap-2">
                                <span className="text-4xs font-mono bg-cyber-border/60 text-gray-300 px-2 py-0.5 rounded">
                                  Confidence: {selectedEvid.confidence}%
                                </span>
                                <span className="text-4xs font-mono bg-cyber-accent/15 text-cyber-accent px-2 py-0.5 rounded border border-cyber-accent/30">
                                  Triage: {selectedEvid.triageStatus}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Contributing Factors (Horizontal Bars) */}
                          <div className="space-y-3.5">
                            <span className="text-3xs uppercase font-mono tracking-wider text-gray-400 block border-b border-cyber-border/40 pb-1">
                              Risk Composition Weights
                            </span>
                            {selectedEvid.riskFactors?.map((f, i) => {
                              const isExpanded = expandedFactor === i;
                              return (
                                <div key={i} className="space-y-1">
                                  <button
                                    onClick={() => setExpandedFactor(isExpanded ? null : i)}
                                    className="w-full flex justify-between items-center text-xs font-mono text-left bg-cyber-bg/40 hover:bg-cyber-bg border border-cyber-border/40 hover:border-cyber-accent/30 p-2.5 rounded transition duration-200"
                                  >
                                    <span className="font-semibold text-gray-300">{f.name}</span>
                                    <span className="text-cyber-accent font-bold">+{f.value}</span>
                                  </button>
                                  <div className="w-full bg-cyber-border/30 h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(f.value / 50) * 100}%` }}
                                      transition={{ duration: 0.8, delay: 0.1 }}
                                      className="h-full bg-cyber-accent rounded-full"
                                    />
                                  </div>
                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-cyber-accent/5 border-l-2 border-cyber-accent p-2 rounded-r text-3xs font-mono text-gray-400 mt-1 leading-normal transition-all overflow-hidden"
                                      >
                                        {f.details}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 text-center py-12">No evidence item selected. Select one in the sidebar list.</p>
                      )}
                    </div>

                    <div className="border-t border-cyber-border/60 pt-3 mt-4 text-4xs font-mono text-gray-500 flex justify-between">
                      <span>HUMAN-IN-THE-LOOP VERIFICATION MANDATORY</span>
                      <span>ALGORITHM REF: KAVACH-RISK-v2.6</span>
                    </div>
                  </div>

                  {/* Right panel: list of evidence to select from, & Synthetic detector */}
                  <div className="space-y-6">
                    {/* Selectable Evidence List */}
                    <div className="cyber-glass border border-cyber-border rounded-xl p-4">
                      <h4 className="text-xs font-semibold font-mono tracking-wider text-cyber-text-primary border-b border-cyber-border pb-2 mb-3">
                        Triage Directory
                      </h4>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {filteredEvidence.map(e => (
                          <button
                            key={e.id}
                            onClick={() => {
                              setSelectedEvid(e);
                              setExpandedFactor(null);
                            }}
                            className={`w-full text-left p-2 rounded font-mono text-3xs flex justify-between items-center transition border ${
                              selectedEvid?.id === e.id
                                ? 'bg-cyber-accent/15 border-cyber-accent text-cyber-text-primary'
                                : 'bg-cyber-bg/40 border-cyber-border/40 hover:bg-cyber-border/20 text-gray-400'
                            }`}
                          >
                            <span className="truncate pr-2">{e.id} - {e.title}</span>
                            <span className={`font-bold ${e.riskScore > 75 ? 'text-cyber-red' : 'text-cyber-orange'}`}>
                              {e.riskScore}%
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Synthetic Detector Panel */}
                    <div className="cyber-glass border border-cyber-border rounded-xl p-5 space-y-4">
                      <h4 className="text-xs font-semibold font-mono tracking-wider text-cyber-text-primary border-b border-cyber-border pb-2 flex items-center gap-1.5">
                        <Fingerprint size={14} className="text-cyber-accent" />
                        Synthetic Media Provenance
                      </h4>

                      {selectedEvid ? (
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-3xs text-gray-400 font-mono">Likelihood Signature:</span>
                            <span className={`text-3xs font-mono font-bold px-2 py-0.5 rounded border ${
                              selectedEvid.syntheticBadge === 'High'
                                ? 'bg-cyber-red/15 border-cyber-red/40 text-cyber-red'
                                : selectedEvid.syntheticBadge === 'Medium'
                                ? 'bg-cyber-orange/15 border-cyber-orange/40 text-cyber-orange'
                                : 'bg-cyber-blue/15 border-cyber-blue/40 text-cyber-blue'
                            }`}>
                              {selectedEvid.syntheticBadge} Likelihood
                            </span>
                          </div>

                          <div className="space-y-2 border-t border-cyber-border/40 pt-3">
                            <span className="text-4xs font-mono text-gray-400 block uppercase tracking-wider">Provenance Metrics</span>
                            
                            {[
                              { label: 'Compression Artifacts', val: selectedEvid.provenance?.compression || 0 },
                              { label: 'Metadata Inconsistency', val: selectedEvid.provenance?.metadataInconsistency || 0 },
                              { label: 'Model Fingerprint Markers', val: selectedEvid.provenance?.fingerprint || 0 }
                            ].map((met, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-3xs font-mono text-gray-300">
                                  <span>{met.label}</span>
                                  <span>{met.val}%</span>
                                </div>
                                <div className="w-full bg-cyber-bg border border-cyber-border/40 h-2 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-cyber-accent rounded-full"
                                    style={{ width: `${met.val}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <p className="text-4xs text-gray-400 font-mono border-t border-cyber-border/40 pt-2 leading-relaxed">
                            {selectedEvid.provenance?.summary || 'Standard data export format. Low alteration flags.'}
                          </p>
                        </div>
                      ) : (
                        <p className="text-4xs text-gray-500 font-mono py-6 text-center">No active media node selected.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== MODULE 5: TIMELINE RECONSTRUCTION ==================== */}
              {activeTab === 'timeline' && (
                <div className="space-y-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-bold font-mono text-cyber-text-primary flex items-center gap-2">
                      <Clock size={18} className="text-cyber-accent" />
                      Temporal Reconstruction Timeline
                    </h2>
                    <p className="text-2xs text-gray-400">
                      Chronological ordering of correlated synthetic case uploads. Adjust the slider bounds to filter scope.
                    </p>
                  </div>

                  {/* Range Slider Filter UI */}
                  <div className="cyber-glass border border-cyber-border rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-center text-xs font-mono text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-cyber-accent" />
                        <span>Investigation Time Window</span>
                      </div>
                      <span className="text-cyber-accent font-bold">Scope: {timeRange[0]}% — {timeRange[1]}%</span>
                    </div>

                    <div className="flex gap-4 items-center">
                      <input
                        type="range"
                        min="0"
                        max="90"
                        value={timeRange[0]}
                        onChange={(e) => setTimeRange([parseInt(e.target.value), Math.max(parseInt(e.target.value) + 10, timeRange[1])])}
                        className="w-full accent-cyber-accent"
                      />
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={timeRange[1]}
                        onChange={(e) => setTimeRange([Math.min(parseInt(e.target.value) - 10, timeRange[0]), parseInt(e.target.value)])}
                        className="w-full accent-cyber-accent"
                      />
                    </div>
                  </div>

                  {/* Horizontal Timeline Track */}
                  <div className="cyber-glass border border-cyber-border rounded-xl p-6 relative overflow-x-auto flex-grow flex items-center min-h-[300px]">
                    <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-cyber-border timeline-line" />
                    
                    <div className="flex gap-12 relative z-10 px-6 py-4">
                      {filteredEvidence
                        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                        .map((ev, idx) => {
                          const isHigh = ev.riskScore > 75;
                          return (
                            <motion.div
                              key={ev.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.08 }}
                              onClick={() => {
                                setSelectedEvid(ev);
                                setActiveTab('risk');
                              }}
                              className="flex flex-col items-center text-center cursor-pointer min-w-[140px] group"
                            >
                              {/* Event bubble */}
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-3 bg-cyber-bg transition duration-300 group-hover:scale-110 ${
                                isHigh
                                  ? 'border-cyber-red text-cyber-red shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                                  : 'border-cyber-accent text-cyber-accent'
                              }`}>
                                <span className="font-mono text-3xs font-bold">{ev.id.split('-')[1]}</span>
                              </div>

                              <span className="text-4xs font-mono text-gray-400 block">
                                {new Date(ev.timestamp).toLocaleDateString()}
                              </span>
                              <span className="text-4xs font-mono text-gray-500 block">
                                {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              
                              <div className="mt-2 text-3xs font-mono text-gray-200 group-hover:text-cyber-accent font-semibold transition truncate max-w-[120px]">
                                {ev.title}
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== MODULE 6: INVESTIGATOR COPILOT (AGENTIC CHAT) ==================== */}
              {activeTab === 'copilot' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                  {/* Chat interface */}
                  <div className="lg:col-span-2 cyber-glass border border-cyber-border rounded-xl p-4 flex flex-col justify-between h-full">
                    <div className="border-b border-cyber-border pb-3 mb-3">
                      <h3 className="font-semibold text-cyber-text-primary text-sm flex items-center gap-1.5">
                        <Terminal size={16} className="text-cyber-accent" />
                        KAVACH-AI Intelligent Copilot Chat
                      </h3>
                      <p className="text-4xs text-gray-400 font-mono">Ask questions or order visualization logs. System is human-confirmed.</p>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-grow overflow-y-auto space-y-4 pr-1 mb-4 text-xs font-mono">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={msg.id || idx}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] rounded-xl p-3.5 space-y-2 border ${
                            msg.sender === 'user'
                              ? 'bg-cyber-accent/15 border-cyber-accent/40 text-cyber-text-primary'
                              : 'bg-cyber-card/70 border-cyber-border/70 text-gray-300'
                          }`}>
                            <p className="leading-relaxed text-2xs md:text-xs">{msg.text}</p>
                            
                            {/* Inline Visualizations */}
                            {msg.visualization && (
                              <div className="bg-cyber-bg/90 border border-cyber-border/60 rounded-lg p-2.5 space-y-2.5">
                                {msg.visualization.type === 'graph' && (
                                  <div className="flex flex-wrap gap-2 justify-center items-center py-2 bg-cyber-card/30 rounded border border-cyber-border/20">
                                    {msg.visualization.nodes.map((n, i) => (
                                      <div key={i} className="flex items-center gap-1.5 bg-cyber-bg border border-cyber-border/80 px-2 py-0.5 rounded text-3xs">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: n.color }} />
                                        <span>{n.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {msg.visualization.type === 'timeline' && (
                                  <div className="space-y-1">
                                    <span className="text-4xs text-gray-500">Timeline events detected:</span>
                                    {msg.visualization.events.map((ev, i) => (
                                      <div key={i} className="flex justify-between items-center text-4xs bg-cyber-bg/40 p-1 border border-cyber-border/20 rounded">
                                        <span className="text-cyber-accent">{ev.id}</span>
                                        <span className="truncate max-w-[100px] text-gray-300">{ev.title}</span>
                                        <span className="text-gray-500 font-mono text-4xs">{ev.date}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {msg.sender === 'ai' && (
                              <div className="flex justify-between items-center text-5xs text-gray-500 font-mono pt-1">
                                <span>{msg.timestamp}</span>
                                <span className="bg-cyber-border/60 text-gray-400 px-1 rounded">
                                  AI-generated — verify before use
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input panel */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Enter mock query (e.g. 'show Case 101' or 'query Device-001')..."
                        className="flex-grow bg-cyber-bg border border-cyber-border text-xs text-gray-200 rounded-lg px-3.5 py-2.5 outline-none font-mono focus:border-cyber-accent transition"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-cyber-accent hover:bg-cyber-accent-glow text-white rounded-lg p-2.5 flex items-center justify-center transition"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Sidebar Suggested Queries */}
                  <div className="cyber-glass border border-cyber-border rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-semibold font-mono text-cyber-text-primary border-b border-cyber-border pb-2 flex items-center gap-1.5">
                      <Info size={14} className="text-cyber-accent" />
                      Suggested Queries
                    </h4>
                    <div className="space-y-2 text-xs font-mono">
                      {[
                        "Show me all evidence linked to Device-001",
                        "Summarize timeline for Case #101",
                        "Audit actions taken on high priority leads",
                        "Identify files suspect of synthetic AI tampering"
                      ].map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setChatInput(q)}
                          className="w-full text-left bg-cyber-bg hover:bg-cyber-border/20 border border-cyber-border/40 hover:border-cyber-accent/30 p-2.5 rounded text-3xs text-gray-400 hover:text-gray-200 transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== MODULE 7: AUDIT LOGS & REPORTS ==================== */}
              {activeTab === 'audit' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Chain of Custody & Audit Trails */}
                  <div className="lg:col-span-2 cyber-glass border border-cyber-border rounded-xl p-5 flex flex-col justify-between h-[500px]">
                    <div>
                      <div className="flex justify-between items-center border-b border-cyber-border pb-3 mb-4">
                        <h3 className="font-semibold text-cyber-text-primary text-sm flex items-center gap-1.5">
                          <Terminal size={16} className="text-cyber-accent" />
                          Immutable Chain-of-Custody Log
                        </h3>
                        <span className="text-3xs bg-cyber-green/10 border border-cyber-green/40 text-cyber-green px-2 py-0.5 rounded font-mono font-semibold">
                          SECURE-APPEND ONLY
                        </span>
                      </div>

                      {/* Log output viewport */}
                      <div className="overflow-y-auto max-h-[380px] space-y-2 pr-1 font-mono text-3xs">
                        {auditLogs.map(log => (
                          <div key={log.id} className="bg-cyber-bg/50 border border-cyber-border/30 rounded p-2.5 flex flex-col md:flex-row justify-between hover:border-cyber-accent/30 transition gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-cyber-blue font-semibold">[{log.id}]</span>
                                <span className="text-gray-400">{log.action}</span>
                              </div>
                              {log.target && (
                                <span className="text-4xs text-gray-500 uppercase tracking-widest block">TARGET REF: {log.target}</span>
                              )}
                            </div>
                            <div className="text-right flex flex-col justify-between items-end">
                              <span className="text-4xs text-cyber-accent font-bold">{log.actor}</span>
                              <span className="text-4xs text-gray-500 mt-1">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-cyber-border/40 pt-3 mt-4 text-4xs text-gray-500 font-mono flex justify-between items-center">
                      <span>CRYPTO SIGNATURE: SHA-256 SECURED LOGS</span>
                      <span>LOCAL PROTOTYPE ONLY</span>
                    </div>
                  </div>

                  {/* Right: Automated Report Generator */}
                  <div className="cyber-glass border border-cyber-border rounded-xl p-5 flex flex-col justify-between h-[500px]">
                    <div>
                      <h4 className="text-xs font-semibold font-mono text-cyber-text-primary border-b border-cyber-border pb-2 mb-3">
                        Automated Case Report Generator
                      </h4>
                      <p className="text-3xs text-gray-400 font-mono leading-relaxed mb-4">
                        Compile all verified timeline actions, decisions, and system provenance logs into an exportable document.
                      </p>

                      <div className="bg-cyber-bg/60 border border-cyber-border/60 rounded-lg p-3 space-y-3.5 font-mono text-3xs">
                        <div>
                          <span className="text-gray-500 block uppercase">Compile Parameters:</span>
                          <span className="text-gray-300 block mt-0.5">Active Scope: {selectedCaseFilter}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block uppercase">Target Document:</span>
                          <span className="text-gray-300 block mt-0.5">KAVACH-REPORT-${selectedCaseFilter}-2026.pdf</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block uppercase">Evidence Items Cited:</span>
                          <span className="text-gray-300 block mt-0.5">
                            {evidence.filter(e => selectedCaseFilter === 'ALL' || e.caseId === selectedCaseFilter).length} Files Referenced
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        // Create a mock print trigger or window build
                        const win = window.open("", "_blank");
                        const dateStr = new Date().toLocaleString();
                        const caseName = selectedCaseFilter === 'ALL' ? 'All Case Folders' : selectedCaseFilter;
                        const citedEv = evidence.filter(e => selectedCaseFilter === 'ALL' || e.caseId === selectedCaseFilter);
                        const caseDecisionLogs = auditLogs.filter(l => citedEv.some(e => e.id === l.target) || l.target === 'Copilot Chat');

                        win.document.write(`
                          <html>
                            <head>
                              <title>KAVACH-AI Case Report - ${caseName}</title>
                              <style>
                                body { font-family: monospace; padding: 40px; background-color: #ffffff; color: #000000; line-height: 1.5; }
                                h1, h2, h3 { border-bottom: 2px solid #000; padding-bottom: 8px; margin-top: 30px; }
                                .metadata { margin-bottom: 30px; font-size: 11px; }
                                .item { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; page-break-inside: avoid; }
                                .risk { font-weight: bold; }
                              </style>
                            </head>
                            <body>
                              <h1>KAVACH-AI DEMO INVESTIGATION REPORT</h1>
                              <div class="metadata">
                                <strong>Date Generated:</strong> ${dateStr}<br/>
                                <strong>Scope:</strong> ${caseName}<br/>
                                <strong>Lead Investigator:</strong> Inspector R. Nair (Cyberdome)<br/>
                                <strong>Fictional Disclaimer:</strong> This is a synthetic mock-data investigation report generated for prototype presentation.
                              </div>
                              
                              <h2>1. KEY EVIDENCE CITED</h2>
                              ${citedEv.map(e => `
                                <div class="item">
                                  <strong>[${e.id}]</strong> ${e.title} - Risk Score: ${e.riskScore}% (Conf: ${e.confidence}%)<br/>
                                  <strong>Timestamp:</strong> ${e.timestamp}<br/>
                                  <strong>Device Link:</strong> ${e.deviceId}<br/>
                                  <strong>Snippet:</strong> ${e.snippet}<br/>
                                  <strong>Triage Status:</strong> ${e.triageStatus}<br/>
                                  <strong>Synthetic Likelihood:</strong> ${e.syntheticBadge}
                                </div>
                              `).join('')}

                              <h2>2. RECENT INVESTIGATOR DECISION LOG</h2>
                              ${caseDecisionLogs.map(l => `
                                <div style="margin-bottom:10px; font-size:12px;">
                                  [${l.timestamp}] <strong>${l.actor}</strong>: ${l.action} (${l.target})
                                </div>
                              `).join('')}
                              
                              <p style="margin-top:50px; text-align:center; font-size:10px; color:#555;">
                                AI-Generated Summary Report. Verifiably compiled by KAVACH-AI Core v2.6
                              </p>
                            </body>
                          </html>
                        `);
                        win.document.close();

                        // Add audit log for report generation
                        setAuditLogs(prev => [{
                          id: `LOG-${Date.now()}`,
                          timestamp: new Date().toISOString(),
                          actor: 'Investigator R. Nair (ID: KP-8893)',
                          action: `Exported Case Report for ${caseName}`,
                          target: 'Report Generator'
                        }, ...prev]);
                      }}
                      className="w-full bg-cyber-accent hover:bg-cyber-accent-glow text-white text-xs font-mono font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <Download size={14} />
                      Compile & Generate Case Report
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        </>
      )}

        {/* ==================== MODULE 8: SETTINGS / DISCLAIMERS (FOOTER / ABOUT) ==================== */}
        <footer className="mt-12 border-t border-cyber-border/40 pt-6 pb-4 flex flex-col md:flex-row justify-between items-center text-4xs md:text-3xs text-gray-500 font-mono gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span>© 2026 Kerala Police Cyberdome HAC'KP</span>
            <span>•</span>
            <button 
              onClick={() => {
                alert("KAVACH-AI - Kerala Agentic Vulnerability Analysis & Child Protection Assistant.\nBuilt with React, Tailwind CSS v4, Framer Motion, and D3-Force.\nThis is a hackathon prototype showcasing human-in-the-loop AI triage workflows.");
              }} 
              className="hover:underline hover:text-cyber-accent"
            >
              Technology Stack Area
            </button>
            <span>•</span>
            <span className="text-cyber-orange font-bold">MOCK DATASET PROTOXY</span>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <Info size={12} className="text-cyber-accent" />
            <span>AI-generated — human confirmation mandatory before operations</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
