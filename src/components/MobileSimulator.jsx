import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Smartphone, 
  MapPin, 
  Camera, 
  UploadCloud, 
  CheckCircle, 
  FileText, 
  Send, 
  Activity, 
  User, 
  Compass, 
  Bell, 
  Star, 
  Power, 
  Navigation,
  MessageSquare,
  AlertTriangle,
  RotateCw,
  Search,
  Lock,
  ChevronRight,
  Map
} from 'lucide-react';

export default function MobileSimulator() {
  const [currentScreen, setCurrentScreen] = useState('splash'); // splash, login, home, map, report, chatbot, officer
  const [userRole, setUserRole] = useState('citizen'); // citizen, officer

  // Splash Screen State
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('login');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Login Fingerprint scanning states
  const [scanState, setScanState] = useState('idle'); // idle, scanning, success
  const handleFingerprintScan = () => {
    if (scanState !== 'idle') return;
    setScanState('scanning');
    setTimeout(() => {
      setScanState('success');
      setTimeout(() => {
        setCurrentScreen(userRole === 'citizen' ? 'home' : 'officer');
        setScanState('idle');
      }, 1000);
    }, 2500);
  };

  // SOS button states
  const [sosActive, setSosActive] = useState(false);
  const [sosPhase, setSosPhase] = useState('idle'); // idle, loading, connected
  const handleSOSPress = () => {
    if (sosActive) {
      setSosActive(false);
      setSosPhase('idle');
      return;
    }
    setSosActive(true);
    setSosPhase('loading');
    setTimeout(() => {
      setSosPhase('connected');
    }, 3000);
  };

  // Multi-step report flow state
  const [reportStep, setReportStep] = useState(1); // 1: Details, 2: Location, 3: Evidence, 4: Success
  const [reportType, setReportType] = useState('Suspicious Activity');
  const [reportDetails, setReportDetails] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);

  const startUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setEvidenceUploaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Chatbot state
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'KAVACH-AI Assistant active. How can I help you?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendBotMessage = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = "Scanning emergency network locator... Nearest patrol unit has been alerted.";
      if (userText.toLowerCase().includes('help') || userText.toLowerCase().includes('sos')) {
        reply = "Initiating secondary geolocation scan. Please stand by or press the red SOS button for priority response.";
      } else if (userText.toLowerCase().includes('station')) {
        reply = "Nearest station is Cyberdome HQ (1.2 km away). Live route is active under stations map.";
      }
      
      // Simulate word-by-word build
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1500);
  };

  // Officer States
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [caseAssigned, setCaseAssigned] = useState(false);
  const [caseAccepted, setCaseAccepted] = useState(false);

  useEffect(() => {
    if (isOnDuty && !caseAssigned && !caseAccepted) {
      const timer = setTimeout(() => {
        setCaseAssigned(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnDuty, caseAssigned, caseAccepted]);

  // Map Animation simulation
  const [policeCarPosition, setPoliceCarPosition] = useState({ x: 40, y: 190 });
  const [distanceCounter, setDistanceCounter] = useState(1.4);
  useEffect(() => {
    if (currentScreen === 'map') {
      const interval = setInterval(() => {
        setPoliceCarPosition(prev => {
          if (prev.x >= 140) {
            clearInterval(interval);
            return { x: 140, y: 110 };
          }
          return { x: prev.x + 10, y: prev.y - 8 };
        });
        setDistanceCounter(prev => {
          if (prev <= 0.1) return 0;
          return parseFloat((prev - 0.1).toFixed(1));
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setPoliceCarPosition({ x: 40, y: 190 });
      setDistanceCounter(1.4);
    }
  }, [currentScreen]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Simulation Controller */}
      <div className="flex gap-4 mb-6 bg-cyber-card/60 p-3 rounded-xl border border-cyber-border/40 z-20">
        <button
          onClick={() => {
            setUserRole('citizen');
            setCurrentScreen('splash');
            setSosActive(false);
            setSosPhase('idle');
          }}
          className={`px-4 py-1.5 text-xs font-mono rounded-lg transition duration-200 ${
            userRole === 'citizen' 
              ? 'bg-cyber-accent text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Citizen App Mode
        </button>
        <button
          onClick={() => {
            setUserRole('officer');
            setCurrentScreen('splash');
            setIsOnDuty(false);
            setCaseAssigned(false);
            setCaseAccepted(false);
          }}
          className={`px-4 py-1.5 text-xs font-mono rounded-lg transition duration-200 ${
            userRole === 'officer' 
              ? 'bg-cyber-accent text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Police Officer Mode
        </button>
      </div>

      {/* Phone Case Frame */}
      <div className={`relative w-[340px] h-[680px] bg-black/90 rounded-[45px] p-3.5 border-[6px] border-gray-800 shadow-[0_25px_50px_-12px_rgba(168,85,247,0.2)] overflow-hidden transition-all duration-300 ${
        sosActive && sosPhase === 'loading' ? 'animate-[shake_0.2s_infinite]' : ''
      }`}>
        {/* Dynamic Siren Light Reflection overlay on the entire phone */}
        <div className="absolute inset-0 siren-bg-reflect pointer-events-none z-30" />

        {/* Screen Bezel Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[26px] bg-black rounded-b-[20px] z-50 flex items-center justify-center gap-1.5">
          <div className="w-12 h-1 bg-gray-800 rounded-full" />
          <div className="w-2.5 h-2.5 bg-gray-900 rounded-full border border-gray-800" />
        </div>

        {/* Inner Phone Screen */}
        <div className="w-full h-full bg-[#05020E] rounded-[34px] relative overflow-hidden flex flex-col pt-6 select-none">
          {/* Status Bar */}
          <div className="flex justify-between px-6 py-1 text-4xs font-mono text-gray-400 tracking-wider z-40">
            <span>17:28 PM</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-gray-600 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-cyber-green rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Emergency Alert Slide-down */}
          <AnimatePresence>
            {sosActive && sosPhase === 'connected' && (
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="absolute top-10 left-3 right-3 bg-cyber-red border border-red-500 rounded-xl p-3.5 z-40 flex items-center gap-2.5 shadow-[0_5px_15px_rgba(239,68,68,0.4)]"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center animate-ping absolute left-3" />
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center z-10">
                  <AlertTriangle className="text-white" size={18} />
                </div>
                <div>
                  <h5 className="font-bold text-white text-3xs tracking-wider">CRITICAL ALERT DISPATCHED</h5>
                  <p className="text-4xs text-white/80">Location pinned. Officer Meera assigned.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Screen Routing Content */}
          <div className="flex-grow relative flex flex-col z-10">
            <AnimatePresence mode="wait">
              {/* SCREEN 1: SPLASH SCREEN */}
              {currentScreen === 'splash' && (
                <motion.div
                  key="splash"
                  className="absolute inset-0 flex flex-col justify-between items-center py-16 px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div />
                  {/* Badge logo with metallic sweep */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#1E1145] to-[#431B7F] border border-cyber-accent/30 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)] shine-sweep-effect"
                  >
                    <Shield size={56} className="text-white" />
                  </motion.div>

                  <div className="text-center space-y-2">
                    <h2 className="text-sm font-bold font-mono tracking-widest text-cyber-text-primary uppercase">POLICE CONNECT</h2>
                    <p className="text-4xs font-mono text-cyber-accent tracking-widest uppercase">Serving & Protecting</p>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 2: BIOMETRIC LOGIN */}
              {currentScreen === 'login' && (
                <motion.div
                  key="login"
                  className="absolute inset-0 flex flex-col justify-between items-center py-12 px-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center space-y-2">
                    <Lock className="mx-auto text-cyber-accent" size={32} />
                    <h3 className="text-xs font-bold font-mono tracking-wider">SECURE AUTHORIZATION</h3>
                    <p className="text-4xs text-gray-400">Verifying security clearances via fingerprint portal</p>
                  </div>

                  {/* Fingerprint Pad with scan waves */}
                  <button
                    onClick={handleFingerprintScan}
                    className={`relative w-24 h-24 rounded-full border border-cyber-accent/40 flex items-center justify-center bg-cyber-card/60 cursor-pointer overflow-hidden ${
                      scanState === 'scanning' ? 'border-cyber-green/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''
                    }`}
                  >
                    {scanState === 'scanning' && <div className="laser-scanner-line" />}
                    {scanState === 'success' ? (
                      <CheckCircle className="text-cyber-green" size={44} />
                    ) : (
                      <div className="w-14 h-14 bg-cyber-accent/10 border border-cyber-accent/30 rounded-full flex items-center justify-center relative">
                        {scanState === 'scanning' && (
                          <div className="absolute inset-0 rounded-full border border-cyber-green animate-ping" />
                        )}
                        <Smartphone className={scanState === 'scanning' ? 'text-cyber-green' : 'text-cyber-accent'} size={26} />
                      </div>
                    )}
                  </button>

                  <p className="text-4xs font-mono text-gray-500 uppercase tracking-widest">
                    {scanState === 'idle' && 'Tap fingerprint to authenticate'}
                    {scanState === 'scanning' && 'Reading secure credentials...'}
                    {scanState === 'success' && 'Secure access approved'}
                  </p>
                </motion.div>
              )}

              {/* SCREEN 3: HOME DASHBOARD */}
              {currentScreen === 'home' && (
                <motion.div
                  key="home"
                  className="absolute inset-0 flex flex-col justify-between p-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* TopCitizen bar */}
                  <div className="flex justify-between items-center border-b border-cyber-border pb-3 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-cyber-accent/20 border border-cyber-accent/40 flex items-center justify-center">
                        <User size={12} className="text-cyber-accent" />
                      </div>
                      <span className="text-4xs font-mono font-bold text-gray-300">Citizen #8839</span>
                    </div>
                    <span className="text-5xs bg-cyber-green/10 border border-cyber-green/45 text-cyber-green px-1.5 py-0.5 rounded font-mono font-semibold">
                      GPS SECURED
                    </span>
                  </div>

                  {/* Pulsing SOS buttons */}
                  <div className="flex-grow flex flex-col items-center justify-center relative">
                    <div className="absolute w-40 h-40 rounded-full bg-cyber-red/10 animate-ping pointer-events-none" />
                    <button
                      onClick={handleSOSPress}
                      className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 font-mono font-extrabold cursor-pointer transition-all duration-300 ${
                        sosActive 
                          ? 'bg-cyber-red border-white text-white shadow-[0_0_35px_rgba(239,68,68,0.7)]' 
                          : 'bg-black border-cyber-red text-cyber-red shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-105'
                      }`}
                    >
                      {/* Pulse rings */}
                      {!sosActive && <div className="absolute inset-0 rounded-full border border-cyber-red sos-pulse-ring" />}
                      <span className="text-2xl tracking-widest">SOS</span>
                      <span className="text-5xs uppercase tracking-widest mt-1 opacity-80">
                        {sosActive ? 'Press to Cancel' : 'Tap in Emergency'}
                      </span>
                    </button>

                    {sosActive && (
                      <p className="text-4xs font-mono text-cyber-red text-center font-semibold animate-pulse mt-4">
                        {sosPhase === 'loading' && 'TRANSMITTING COORDS PING...'}
                        {sosPhase === 'connected' && 'POLICE SQUAD CAR DISPATCHED'}
                      </p>
                    )}
                  </div>

                  {/* Main Grid navigation */}
                  <div className="grid grid-cols-3 gap-2 border-t border-cyber-border/40 pt-4">
                    {[
                      { id: 'map', label: 'Live Map', icon: Navigation },
                      { id: 'report', label: 'Report', icon: FileText },
                      { id: 'chatbot', label: 'AI Chat', icon: MessageSquare }
                    ].map(btn => {
                      const Icon = btn.icon;
                      return (
                        <button
                          key={btn.id}
                          onClick={() => setCurrentScreen(btn.id)}
                          className="flex flex-col items-center justify-center bg-cyber-card/60 hover:bg-cyber-card border border-cyber-border/40 rounded-lg p-2 text-5xs font-mono text-gray-400 hover:text-white transition duration-200"
                        >
                          <Icon size={16} className="text-cyber-accent mb-1.5" />
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* SCREEN 4: LIVE POLICE MAP TRACKING */}
              {currentScreen === 'map' && (
                <motion.div
                  key="map"
                  className="absolute inset-0 flex flex-col justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Map Header */}
                  <div className="p-3 bg-cyber-card/80 border-b border-cyber-border flex justify-between items-center z-20">
                    <span className="text-4xs font-mono text-gray-300">Live Tracker Grid</span>
                    <button onClick={() => setCurrentScreen('home')} className="text-5xs font-mono text-cyber-accent hover:underline">Home</button>
                  </div>

                  {/* Simulated Vector Map with scanning radar */}
                  <div className="flex-grow relative bg-[#090518] overflow-hidden flex items-center justify-center">
                    {/* Sonar sweep */}
                    <div className="absolute w-[200px] h-[200px] border border-cyber-accent/5 rounded-full z-0 flex items-center justify-center">
                      <div className="absolute w-full h-full rounded-full radar-sweep-line" />
                      <div className="absolute w-full h-[1px] bg-cyber-accent/5" />
                      <div className="absolute h-full w-[1px] bg-cyber-accent/5" />
                    </div>

                    {/* Fictional route path */}
                    <svg className="absolute w-full h-full" viewBox="0 0 200 200">
                      <path
                        d="M 40,190 L 90,150 L 140,110 L 140,70"
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="opacity-40"
                      />
                      {/* Drawn path line animation */}
                      <path
                        d="M 40,190 L 90,150 L 140,110"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Geolocation ripple ping */}
                    <div className="absolute top-[110px] left-[140px] w-6 h-6 z-10 flex items-center justify-center">
                      <div className="absolute inset-0 border border-cyber-green rounded-full animate-ping" />
                      <MapPin className="text-cyber-green" size={14} />
                    </div>

                    {/* Animated moving Police Patrol Vehicle */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        left: policeCarPosition.x - 7,
                        top: policeCarPosition.y - 7,
                        zIndex: 10
                      }}
                      className="w-4.5 h-4.5 rounded-full bg-cyber-red border border-white flex items-center justify-center shadow-[0_0_10px_#EF4444] animate-bounce"
                    >
                      <Navigation size={8} className="text-white transform rotate-45" />
                    </motion.div>
                  </div>

                  {/* Tracking Metrics panel */}
                  <div className="p-3 bg-cyber-card border-t border-cyber-border z-20 space-y-2">
                    <div className="flex justify-between items-center text-4xs font-mono">
                      <span>Assigned Squad:</span>
                      <span className="text-cyber-accent font-semibold">UNIT-MEERA #102</span>
                    </div>
                    <div className="flex justify-between items-center text-4xs font-mono">
                      <span>Estimated Arrival:</span>
                      <span className="text-cyber-red font-bold">{distanceCounter > 0 ? `${distanceCounter} km` : 'ARRIVED'}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 5: COMPLAINT REGISTRATION FLOW */}
              {currentScreen === 'report' && (
                <motion.div
                  key="report"
                  className="absolute inset-0 flex flex-col justify-between p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Progress Header */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-4xs font-mono text-gray-400">Step {reportStep} of 4</span>
                      <button onClick={() => setCurrentScreen('home')} className="text-5xs font-mono text-cyber-accent hover:underline">Exit</button>
                    </div>
                    <div className="w-full bg-cyber-border/40 h-1.5 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-cyber-accent transition-all duration-300" style={{ width: `${(reportStep / 4) * 100}%` }} />
                    </div>
                  </div>

                  {/* Active Step Panel */}
                  <div className="flex-grow flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {reportStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                          <label className="text-4xs font-mono text-gray-400 uppercase">Complaint Category</label>
                          <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full bg-cyber-bg border border-cyber-border text-xs rounded p-2 outline-none font-mono text-gray-200"
                          >
                            <option>Suspicious Activity</option>
                            <option>Cyber Abuse / Harassment</option>
                            <option>Child Protection Concern</option>
                          </select>

                          <label className="text-4xs font-mono text-gray-400 uppercase block">Factual Details</label>
                          <textarea
                            value={reportDetails}
                            onChange={(e) => setReportDetails(e.target.value)}
                            placeholder="Provide factual details..."
                            className="w-full h-24 bg-cyber-bg border border-cyber-border text-xs rounded p-2 outline-none font-mono text-gray-200 resize-none"
                          />
                        </motion.div>
                      )}

                      {reportStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3 text-center">
                          <div className="w-14 h-14 bg-cyber-accent/15 border border-cyber-accent/40 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                            <MapPin className="text-cyber-accent" size={24} />
                          </div>
                          <h4 className="text-xs font-mono font-bold">GPS Coordinates Lock</h4>
                          <p className="text-4xs text-gray-400 font-mono">Trivandrum Cyberdome sectors coordinates logged: 8.5241 N, 76.9366 E</p>
                        </motion.div>
                      )}

                      {reportStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 text-center">
                          <div className="w-16 h-16 border-2 border-dashed border-cyber-border rounded-xl flex flex-col items-center justify-center mx-auto relative overflow-hidden bg-cyber-bg">
                            {isUploading ? (
                              <div className="flex flex-col items-center justify-center p-2">
                                <RotateCw className="text-cyber-accent animate-spin mb-1" size={18} />
                                <span className="text-5xs font-mono text-gray-400">{uploadProgress}%</span>
                              </div>
                            ) : evidenceUploaded ? (
                              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                                <CheckCircle className="text-cyber-green mb-1" size={20} />
                                <span className="text-5xs font-mono text-cyber-green uppercase">Uploaded</span>
                              </motion.div>
                            ) : (
                              <button onClick={startUpload} className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-gray-300 transition">
                                <Camera size={20} className="text-cyber-accent" />
                                <span className="text-5xs font-mono uppercase">Upload File</span>
                              </button>
                            )}
                          </div>
                          <p className="text-4xs text-gray-400 font-mono">Attach screenshot image logs or metadata files to corroborate complaint</p>
                        </motion.div>
                      )}

                      {reportStep === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-3">
                          <div className="w-14 h-14 bg-cyber-green/10 border border-cyber-green/45 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="text-cyber-green" size={32} />
                          </div>
                          <h4 className="text-xs font-mono font-bold text-cyber-green">COMPLAINT SUBMITTED</h4>
                          <p className="text-4xs text-gray-400 font-mono leading-normal">
                            Filing code logged: <span className="text-cyber-accent">KP-REPT-7703</span>. Timestamps appended to custody trails.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Flow Action footer buttons */}
                  <div className="flex justify-between items-center border-t border-cyber-border/40 pt-3">
                    {reportStep > 1 && reportStep < 4 ? (
                      <button
                        onClick={() => setReportStep(prev => prev - 1)}
                        className="bg-cyber-border/40 text-gray-300 text-5xs font-mono uppercase py-2 px-4 rounded transition"
                      >
                        Back
                      </button>
                    ) : <div />}

                    {reportStep < 4 ? (
                      <button
                        onClick={() => {
                          if (reportStep === 3 && !evidenceUploaded) {
                            alert("Please upload evidence first");
                            return;
                          }
                          setReportStep(prev => prev + 1);
                        }}
                        className="bg-cyber-accent text-white text-5xs font-mono uppercase py-2 px-4 rounded shadow-[0_0_10px_rgba(168,85,247,0.4)] transition"
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setReportStep(1);
                          setEvidenceUploaded(false);
                          setReportDetails('');
                          setCurrentScreen('home');
                        }}
                        className="w-full bg-cyber-accent text-white text-5xs font-mono uppercase py-2.5 rounded shadow-[0_0_10px_rgba(168,85,247,0.4)] text-center transition"
                      >
                        Return to Console
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* SCREEN 6: AI POLICE ASSISTANT CHATBOT */}
              {currentScreen === 'chatbot' && (
                <motion.div
                  key="chatbot"
                  className="absolute inset-0 flex flex-col justify-between p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Chat header */}
                  <div className="flex justify-between items-center border-b border-cyber-border pb-2.5 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className="text-cyber-accent" />
                      <span className="text-4xs font-mono font-bold text-gray-300">KAVACH-AI Assistant</span>
                    </div>
                    <button onClick={() => setCurrentScreen('home')} className="text-5xs font-mono text-cyber-accent hover:underline">Close</button>
                  </div>

                  {/* Messages container */}
                  <div className="flex-grow overflow-y-auto space-y-3 pr-1 text-5xs font-mono">
                    {messages.map((m, idx) => (
                      <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-lg max-w-[80%] leading-relaxed border ${
                          m.sender === 'user'
                            ? 'bg-cyber-accent/15 border-cyber-accent/40 text-cyber-text-primary'
                            : 'bg-cyber-border/30 border-cyber-border/60 text-gray-300'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-cyber-border/30 border border-cyber-border/60 p-2 rounded-lg text-gray-400 flex gap-1">
                          <span className="w-1 h-1 bg-cyber-accent rounded-full animate-bounce" />
                          <span className="w-1 h-1 bg-cyber-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1 h-1 bg-cyber-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <div className="flex gap-1.5 border-t border-cyber-border/40 pt-3.5">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendBotMessage()}
                      placeholder="Ask AI bot..."
                      className="flex-grow bg-cyber-bg border border-cyber-border text-5xs text-gray-200 rounded px-2.5 py-1.5 outline-none font-mono focus:border-cyber-accent"
                    />
                    <button onClick={handleSendBotMessage} className="bg-cyber-accent text-white p-1.5 rounded flex items-center justify-center">
                      <Send size={12} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 7: OFFICER MODE DASHBOARD */}
              {currentScreen === 'officer' && (
                <motion.div
                  key="officer"
                  className="absolute inset-0 flex flex-col justify-between p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Officer Header with Profile Card badge */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-cyber-border pb-2.5">
                      <div className="flex items-center gap-1.5">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
                          <Shield size={14} className="text-cyber-accent" />
                        </motion.div>
                        <span className="text-4xs font-mono font-bold text-gray-300">S.I. Meera K. (KP-8894)</span>
                      </div>
                      
                      {/* Availability Switch */}
                      <button
                        onClick={() => {
                          setIsOnDuty(!isOnDuty);
                          setCaseAssigned(false);
                          setCaseAccepted(false);
                        }}
                        className={`w-12 h-6 rounded-full p-0.5 border flex items-center cursor-pointer transition-colors duration-300 ${
                          isOnDuty ? 'bg-cyber-green border-cyber-green' : 'bg-gray-800 border-gray-700'
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-4 h-4 bg-white rounded-full shadow"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          style={{ marginLeft: isOnDuty ? 'auto' : '0' }}
                        />
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-5xs font-mono">
                      <span>DUTY CODE STATE:</span>
                      <span className={`font-bold ${isOnDuty ? 'text-cyber-green animate-pulse' : 'text-gray-400'}`}>
                        {isOnDuty ? 'AVAILABLE' : 'OFF DUTY'}
                      </span>
                    </div>
                  </div>

                  {/* Main Work Area */}
                  <div className="flex-grow flex flex-col justify-center relative">
                    <AnimatePresence>
                      {/* Sparkle ranks when off duty */}
                      {!isOnDuty && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
                          <div className="flex justify-center gap-1 text-cyber-orange">
                            <Star size={12} className="animate-bounce" />
                            <Star size={12} className="animate-bounce [animation-delay:0.1s]" />
                            <Star size={12} className="animate-bounce [animation-delay:0.2s]" />
                          </div>
                          <span className="text-5xs font-mono uppercase text-gray-400">Rank: Cyberdome Inspector Grade 3</span>
                        </motion.div>
                      )}

                      {/* Dynamic Alert assignment flips */}
                      {isOnDuty && caseAssigned && !caseAccepted && (
                        <motion.div
                          key="case-assignment"
                          initial={{ scale: 0.6, rotateY: 90, opacity: 0 }}
                          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                          transition={{ type: 'spring', damping: 12 }}
                          className="bg-cyber-red/10 border border-cyber-red p-4 rounded-xl text-center space-y-3 z-30 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                        >
                          <AlertTriangle className="mx-auto text-cyber-red animate-pulse" size={24} />
                          <h4 className="text-xs font-mono font-bold text-cyber-red animate-pulse">EMERGENCY ASSIGNMENT</h4>
                          <p className="text-5xs font-mono text-gray-300 leading-normal">
                            SOS ping triggered at Cyberdome Sect-A (0.9km away). User ID: CIT-8839.
                          </p>

                          <button
                            onClick={() => {
                              setCaseAccepted(true);
                              // log officer availability
                            }}
                            className="w-full bg-cyber-red hover:bg-red-500 text-white font-mono text-4xs font-bold py-2 rounded transition"
                          >
                            Accept Dispatch
                          </button>
                        </motion.div>
                      )}

                      {isOnDuty && caseAccepted && (
                        <motion.div key="tracking-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
                          <div className="w-12 h-12 bg-cyber-green/10 border border-cyber-green rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <Navigation className="text-cyber-green animate-spin" style={{ animationDuration: '6s' }} size={20} />
                          </div>
                          <h4 className="text-xs font-mono font-bold text-cyber-green">GPS TARGET LOCKED</h4>
                          <p className="text-5xs text-gray-400 font-mono">Routing patrol squad car... Live dispatch feeds synced.</p>
                        </motion.div>
                      )}

                      {isOnDuty && !caseAssigned && !caseAccepted && (
                        <motion.div key="idle-duty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2 text-gray-500">
                          <Activity className="mx-auto text-cyber-accent animate-pulse" size={22} />
                          <span className="text-5xs font-mono uppercase tracking-widest block">Awaiting Dispatch...</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-cyber-border/40 pt-2 flex justify-between items-center text-5xs font-mono text-gray-400">
                    <span>SECTOR PING ID: Trivandrum-3</span>
                    <button onClick={() => setCurrentScreen('login')} className="text-cyber-accent hover:underline">Log Out</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom hardware home button */}
          <div className="h-6 flex items-center justify-center pb-2">
            <button
              onClick={() => {
                if (currentScreen !== 'splash' && currentScreen !== 'login') {
                  setCurrentScreen(userRole === 'citizen' ? 'home' : 'officer');
                }
              }}
              className="w-24 h-1.5 bg-gray-700 rounded-full hover:bg-gray-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
