import { useState, useEffect } from "react";
import { Timer, Zap, ShieldAlert, Sword, CheckCircle2, XCircle } from "lucide-react";
import { Villain } from "@/types/villain";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  villain: Villain;
  onComplete: (damage: number) => void;
  onCancel: () => void;
}

export default function MissionRunner({ villain, onComplete, onCancel }: Props) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const questions = [
    { q: "이 개념을 10초 안에 남에게 설명할 수 있는가?", type: "METAC" },
    { q: "방금 푼 문제의 정답 근거를 책 안 보고 말할 수 있는가?", type: "METAC" },
    { q: "이 유형의 오답 원인이 '실수'가 아닌 '개념 부재'임을 인정하는가?", type: "METAC" }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleFinish();
    }
  }, [timeLeft, isFinished]);

  const handleAnswer = (correct: boolean) => {
    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = (finalAnswers = answers) => {
    setIsFinished(true);
    const correctCount = finalAnswers.filter(a => a).length;
    const damage = correctCount * 25;
    setTimeout(() => onComplete(damage), 2000);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-brutal-black flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white brutal-border brutal-shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-red-600 text-white border-b-4 border-brutal-black flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ShieldAlert size={32} className="animate-pulse" />
            <div>
              <h2 className="text-3xl font-display uppercase tracking-tighter">Mission: Eradicate {villain.name}</h2>
              <p className="text-xs font-black opacity-80 uppercase">강제 학습 모드 활성화됨</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-brutal-black brutal-border font-display text-2xl">
            <Timer size={24} className="text-neon-pink" /> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto space-y-8">
          {!isFinished ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase text-gray-400">Question {currentStep + 1} of {questions.length}</div>
                  <h3 className="text-3xl font-bold leading-tight">{questions[currentStep].q}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={() => handleAnswer(true)}
                    className="p-8 brutal-border bg-neon-green brutal-shadow hover:translate-y-1 transition-all flex flex-col items-center gap-4 group"
                  >
                    <CheckCircle2 size={48} className="group-hover:scale-110 transition-transform" />
                    <span className="font-display text-2xl uppercase">YES / CLEAR</span>
                  </button>
                  <button 
                    onClick={() => handleAnswer(false)}
                    className="p-8 brutal-border bg-red-500 text-white brutal-shadow hover:translate-y-1 transition-all flex flex-col items-center gap-4 group"
                  >
                    <XCircle size={48} className="group-hover:scale-110 transition-transform" />
                    <span className="font-display text-2xl uppercase">NO / FAILED</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
              <Sword size={64} className="text-red-600 animate-bounce" />
              <h3 className="text-5xl font-display uppercase">Attack Successful!</h3>
              <p className="text-xl font-bold">빌런에게 <span className="text-red-600 text-3xl">{answers.filter(a => a).length * 25}</span> 데미지를 입혔습니다.</p>
              <div className="w-full max-w-md h-4 brutal-border bg-brutal-gray overflow-hidden">
                <div className="h-full bg-red-600 animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-brutal-gray border-t-4 border-brutal-black flex justify-between items-center">
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-3 h-3 brutal-border",
                  i < currentStep ? "bg-brutal-black" : i === currentStep ? "bg-neon-pink animate-pulse" : "bg-white"
                )} 
              />
            ))}
          </div>
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-xs font-black uppercase hover:underline"
          >
            미션 포기 (패널티 발생)
          </button>
        </div>
      </div>
    </div>
  );
}
