import { useState } from "react";
import { Brain, CheckCircle2, XCircle, HelpCircle, Sparkles, ArrowRight } from "lucide-react";
import { KnowledgeCard } from "@/types/bankrun";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  cards: KnowledgeCard[];
  onReviewComplete: (cardId: string, isSuccess: boolean) => void;
}

export default function RecallCurator({ cards, onReviewComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const dueCards = cards.filter(c => c.nextReviewAt <= Date.now());
  const currentCard = dueCards[currentIndex];

  const handleResult = (isSuccess: boolean) => {
    onReviewComplete(currentCard.id, isSuccess);
    setShowAnswer(false);
    setShowHint(false);
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (dueCards.length === 0) {
    return (
      <div className="p-12 brutal-border bg-white brutal-shadow text-center space-y-6">
        <div className="w-20 h-20 brutal-border bg-neon-green mx-auto flex items-center justify-center">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-display uppercase">지식 방어 완료!</h3>
          <p className="font-bold text-gray-500">현재 모든 지식이 안전하게 앵커링되어 있습니다.</p>
        </div>
        <div className="pt-4">
          <div className="text-[10px] font-black uppercase text-gray-400 mb-2">Next Bank Run Defense</div>
          <div className="font-display text-xl">Tomorrow 09:00 AM</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-display flex items-center gap-2">
          <Brain className="text-neon-pink" /> 지식 강제 소환 (Active Recall)
        </h3>
        <div className="px-4 py-2 brutal-border bg-brutal-black text-white font-display text-lg">
          {currentIndex + 1} / {dueCards.length}
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute inset-0"
          >
            <div className="h-full p-12 brutal-border bg-white brutal-shadow-lg flex flex-col items-center justify-center text-center space-y-8">
              <div className="space-y-4">
                <div className="text-xs font-black uppercase text-neon-pink tracking-widest">Question</div>
                <h2 className="text-4xl font-display text-brutal-black leading-tight">
                  {currentCard.title}
                </h2>
              </div>

              {!showAnswer ? (
                <div className="w-full space-y-6">
                  <button 
                    onClick={() => setShowAnswer(true)}
                    className="w-full py-6 bg-brutal-black text-white brutal-border brutal-shadow font-display text-2xl hover:bg-neon-pink transition-all"
                  >
                    정답 확인 (Reveal Answer)
                  </button>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowHint(true)}
                      className="flex-1 py-3 brutal-border bg-white hover:bg-brutal-gray transition-colors flex items-center justify-center gap-2 font-bold text-sm"
                    >
                      <HelpCircle size={18} /> 힌트 보기
                    </button>
                  </div>
                  {showHint && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-bold text-gray-400 italic"
                    >
                      힌트: {currentCard.tags.join(", ")} 관련 개념입니다.
                    </motion.p>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full space-y-8"
                >
                  <div className="p-6 bg-brutal-gray brutal-border text-xl font-bold leading-relaxed">
                    {currentCard.content}
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-black uppercase text-gray-400">솔직하게 평가하라: 머릿속에서 인출되었는가?</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleResult(true)}
                        className="py-4 brutal-border bg-neon-green brutal-shadow font-display text-xl flex items-center justify-center gap-2 hover:translate-y-1 transition-all"
                      >
                        <CheckCircle2 size={24} /> 완벽함 (Easy)
                      </button>
                      <button 
                        onClick={() => handleResult(false)}
                        className="py-4 brutal-border bg-red-500 text-white brutal-shadow font-display text-xl flex items-center justify-center gap-2 hover:translate-y-1 transition-all"
                      >
                        <XCircle size={24} /> 기억 안 남 (Hard)
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 brutal-border bg-white brutal-shadow flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-neon-pink text-white brutal-border">
            <Sparkles size={20} />
          </div>
          <div className="text-sm font-bold">
            소환 성공 시 <span className="text-neon-pink">지식 고정 레벨</span>이 향상됩니다.
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-400">
          Streak: <span className="text-brutal-black">12 Days</span>
        </div>
      </div>
    </div>
  );
}
