import { useState, useEffect } from "react";
import { Activity, Zap, Heart, PartyPopper, Ghost } from "lucide-react";
import { ImmersionState } from "@/types/dopamine";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function ImmersionManager() {
  const [state, setState] = useState<ImmersionState>({
    focusLevel: 85,
    lastInteractionTime: Date.now(),
    isBored: false
  });

  const [showTrigger, setShowTrigger] = useState(false);

  // Simulate focus decay and boredom detection
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const timeSinceLast = Date.now() - prev.lastInteractionTime;
        const newFocus = Math.max(0, prev.focusLevel - 1);
        const isBored = timeSinceLast > 10000; // 10 seconds of inactivity
        
        if (isBored && !showTrigger) {
          setShowTrigger(true);
        }

        return {
          ...prev,
          focusLevel: newFocus,
          isBored
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showTrigger]);

  const handleInteraction = () => {
    setState(prev => ({
      ...prev,
      focusLevel: Math.min(100, prev.focusLevel + 10),
      lastInteractionTime: Date.now(),
      isBored: false
    }));
    setShowTrigger(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {showTrigger && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="pointer-events-auto"
          >
            <div className="p-4 brutal-border bg-neon-pink text-white brutal-shadow-lg flex flex-col items-center gap-3 max-w-[200px] text-center">
              <Ghost size={32} className="animate-bounce" />
              <p className="font-black text-sm uppercase">야, 졸리냐? <br/> 도파민 한 사발 할래?</p>
              <button 
                onClick={handleInteraction}
                className="w-full py-2 bg-brutal-black text-neon-green brutal-border font-black text-xs uppercase hover:bg-white hover:text-black transition-colors"
              >
                자극 받기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto p-4 brutal-border bg-white brutal-shadow flex items-center gap-4">
        <div className="flex flex-col items-end">
          <div className="text-[10px] font-black uppercase text-gray-400">Immersion Level</div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-3 bg-brutal-gray brutal-border overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  state.focusLevel > 70 ? "bg-neon-green" : state.focusLevel > 30 ? "bg-yellow-400" : "bg-red-500"
                )}
                style={{ width: `${state.focusLevel}%` }}
              />
            </div>
            <span className="font-display text-lg">{state.focusLevel}%</span>
          </div>
        </div>
        <div className="w-10 h-10 brutal-border bg-brutal-black text-white flex items-center justify-center">
          <Activity size={20} className={cn(state.focusLevel < 30 && "animate-pulse text-red-500")} />
        </div>
      </div>

      {/* Floating Particles on High Focus */}
      {state.focusLevel > 90 && (
        <div className="absolute -top-12 right-0 flex gap-2">
          <PartyPopper className="text-neon-pink animate-bounce" size={24} />
          <Zap className="text-yellow-400 animate-pulse" size={24} />
        </div>
      )}
    </div>
  );
}
