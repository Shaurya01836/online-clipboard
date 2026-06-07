import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Power, Activity, Terminal, CheckCircle2, X } from "lucide-react";

export default function ServerWakingUp({ isReady }) {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState("Ping received...");
  const [showWidget, setShowWidget] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const logs = [
    "Waking up backend...",
    "Spinning up dyno...",
    "Allocating memory...",
    "Starting JVM...",
    " connecting to DB...",
    "Securing endpoints...",
    "System Online."
  ];

  // Visibility Logic
  useEffect(() => {
    if (isReady) {
      if (showWidget) {
        const timer = setTimeout(() => {
          setShowWidget(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
      return;
    }

    if (!showWidget) {
      const timer = setTimeout(() => {
        setShowWidget(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isReady, showWidget]);

  // Progress Animation Logic
  useEffect(() => {
    if (isReady) {
      setProgress(100);
      return;
    }

    setProgress(0);

    const totalTime = 45000; 
    const intervalTime = 500;
    const steps = totalTime / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 95);
      setProgress(newProgress);
      
      const logIndex = Math.floor((newProgress / 100) * (logs.length - 1));
      setCurrentLog(logs[logIndex] || "Initializing...");
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isReady]);

  if (!showWidget) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 right-6 z-50 font-sans"
      >
        {isMinimized ? (
         
          <div 
            onClick={() => setIsMinimized(false)}
            className="bg-[#111] border border-gray-800 rounded-full px-4 py-2 flex items-center gap-3 cursor-pointer hover:border-gray-600 transition shadow-xl"
          >
            <div className={`w-2 h-2 rounded-full ${isReady ? "bg-green-500" : "bg-orange-500 animate-pulse"}`} />
            <span className="text-xs font-mono font-bold text-gray-300">
              {isReady ? "System Online" : "Server Waking Up..."}
            </span>
          </div>
        ) : (
         
          <div className="w-80 bg-[#0A0A0A] border border-[#1f1f1f] rounded-xl shadow-2xl overflow-hidden relative group">
             {/* Header */}
            <div className={`p-3 border-b border-[#1f1f1f] flex justify-between items-center ${isReady ? "bg-green-900/10" : "bg-orange-900/10"}`}>
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${isReady ? "text-green-500" : "text-orange-500"}`} />
                <span className={`text-xs font-bold uppercase tracking-wide ${isReady ? "text-green-500" : "text-orange-500"}`}>
                  {isReady ? "System Ready" : "Initializing Server"}
                </span>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setIsMinimized(true)} className="text-gray-500 hover:text-white p-1 rounded hover:bg-white/10">
                    <span className="sr-only">Minimize</span>
                    <div className="w-2 h-0.5 bg-current"></div>
                 </button>
                 {isReady && (
                   <button onClick={() => setShowWidget(false)} className="text-gray-500 hover:text-white p-1 rounded hover:bg-white/10">
                      <X className="w-3 h-3" />
                   </button>
                 )}
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                   <Server className="w-3 h-3" /> Backend Status
                </span>
                <span className="font-mono">{isReady ? "100%" : `${Math.round(progress)}%`}</span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${isReady ? "bg-green-500" : "bg-gradient-to-r from-orange-500 to-red-500"}`}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.5 }}
                />
              </div>

              {/* Log Output */}
              <div className="bg-black/50 border border-[#1f1f1f] rounded p-2 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-gray-600 shrink-0" />
                <span className="text-[10px] font-mono text-gray-400 truncate w-full">
                  {isReady ? "Connection established." : currentLog}
                </span>
              </div>

              {!isReady && (
                 <p className="text-[10px] text-gray-600 text-center leading-tight">
                   Free servers sleep when inactive.<br/>First request may take 40-50s.
                 </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}