import React, { useState, useEffect, useCallback } from 'react';
import { 
  Zap, 
  Timer, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Trophy,
  BrainCircuit,
  ChevronRight,
  Flame,
  BookOpen,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  KnowledgeItem, 
  RecallQuiz, 
  RecallSession 
} from '@/types/recall';
import { 
  generateRecallQuiz, 
  calculateNextReview, 
  evaluateRecallPerformance,
  MOCK_KNOWLEDGE 
} from '@/services/recallService';
import { motion, AnimatePresence } from 'framer-motion';

export default function KnowledgeCurator() {
  const [items, setItems] = useState<KnowledgeItem[]>(MOCK_KNOWLEDGE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quiz, setQuiz] = useState<RecallQuiz | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [hintIndex, setHintIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [session, setSession] = useState<RecallSession>({
    streak: 5,
    totalRecalled: 124,
    todayRecalled: 0
  });
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; score: number } | null>(null);

  const currentItem = items[currentIndex];

  const startQuiz = useCallback(() => {
    if (!currentItem) return;
    setQuiz(generateRecallQuiz(currentItem));
    setUserAnswer('');
    setHintIndex(0);
    setTimeLeft(60);
    setFeedback(null);
  }, [currentItem]);

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  // Timer Logic
  useEffect(() => {
    if (isFinished || feedback) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        // 10초마다 자동 힌트 공개 (비즈니스 룰)
        if (prev % 10 === 0 && prev !== 60 && hintIndex < 2) {
          setHintIndex(h => h + 1);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, feedback, hintIndex]);

  const handleSubmit = (answer: string) => {
    if (!quiz || feedback) return;

    const isCorrect = answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim();
    const responseTime = (60 - timeLeft) * 1000;
    const score = evaluateRecallPerformance(responseTime, isCorrect, hintIndex);

    setFeedback({ isCorrect, score });
    
    // 세션 및 아이템 업데이트
    if (isCorrect) {
      setSession(prev => ({
        ...prev,
        streak: prev.streak + 1,
        todayRecalled: prev.todayRecalled + 1,
        totalRecalled: prev.totalRecalled + 1
      }));
    } else {
      setSession(prev => ({ ...prev, streak: 0 }));
    }

    const updatedItem = {
      ...currentItem,
      ...calculateNextReview(currentItem, isCorrect, isCorrect ? 'easy' : 'forgot')
    };

    setItems(prev => prev.map((it, idx) => idx === currentIndex ? updatedItem as KnowledgeItem : it));
  };

  const nextItem = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-12 brutal-border bg-white brutal-shadow space-y-6 text-center animate-in zoom-in duration-500">
        <Trophy size={80} className="text-neon-yellow" />
        <h2 className="text-4xl font-display uppercase">오늘의 지식 소환 완료!</h2>
        <p className="text-lg font-bold text-gray-600">뇌의 망각 회로를 성공적으로 차단했습니다.</p>
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          <div className="p-4 brutal-border bg-neon-blue">
            <div className="text-[10px] font-black uppercase">소환 성공</div>
            <div className="text-2xl font-display">{session.todayRecalled}</div>
          </div>
          <div className="p-4 brutal-border bg-neon-pink">
            <div className="text-[10px] font-black uppercase">현재 스트릭</div>
            <div className="text-2xl font-display">{session.streak}</div>
          </div>
          <div className="p-4 brutal-border bg-neon-green">
            <div className="text-[10px] font-black uppercase">누적 지식</div>
            <div className="text-2xl font-display">{session.totalRecalled}</div>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-brutal-black text-white brutal-border brutal-shadow font-display text-xl uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brutal-black text-white brutal-border">
            <BrainCircuit size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-display uppercase">지식 소환 큐레이터</h2>
            <p className="text-sm font-bold text-gray-500 uppercase">능동적 인출을 통한 장기 기억 강화</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 brutal-border bg-white brutal-shadow-sm flex items-center gap-3">
            <Flame size={20} className="text-neon-pink" />
            <div>
              <div className="text-[10px] font-black uppercase text-gray-400">Streak</div>
              <div className="text-xl font-display">{session.streak} Days</div>
            </div>
          </div>
          <div className="px-4 py-2 brutal-border bg-white brutal-shadow-sm flex items-center gap-3">
            <Timer size={20} className={cn(timeLeft < 10 ? "text-neon-pink animate-pulse" : "text-neon-blue")} />
            <div>
              <div className="text-[10px] font-black uppercase text-gray-400">Time Left</div>
              <div className="text-xl font-display">{timeLeft}s</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Quiz Card */}
          <section className="p-8 brutal-border bg-white brutal-shadow space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-brutal-black text-white text-[10px] font-black uppercase">
                {currentItem.category}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-400">
                <Zap size={14} className="text-neon-yellow" /> Active Recall Challenge
              </div>
              <h3 className="text-2xl font-display leading-tight whitespace-pre-wrap">
                {quiz?.question}
              </h3>
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
              {quiz?.type === 'multiple-choice' || quiz?.options ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quiz?.options?.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleSubmit(opt)}
                      disabled={!!feedback}
                      className={cn(
                        "p-4 text-left font-bold brutal-border transition-all",
                        feedback?.isCorrect && opt === quiz.answer ? "bg-neon-green" :
                        feedback && !feedback.isCorrect && opt === userAnswer ? "bg-neon-pink" :
                        "bg-white hover:bg-gray-50"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(userAnswer)}
                    placeholder="정답을 입력하세요..."
                    className="flex-1 p-4 brutal-border bg-gray-50 font-bold focus:outline-none"
                    disabled={!!feedback}
                  />
                  <button 
                    onClick={() => handleSubmit(userAnswer)}
                    className="px-6 bg-brutal-black text-white brutal-border brutal-shadow font-display uppercase"
                  >
                    확인
                  </button>
                </div>
              )}
            </div>

            {/* Hint Section */}
            <div className="p-4 bg-gray-50 brutal-border border-dashed space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                  <Lightbulb size={14} /> Recall Assistance
                </div>
                <button 
                  onClick={() => setHintIndex(prev => Math.min(prev + 1, (quiz?.hints.length || 1) - 1))}
                  disabled={hintIndex >= (quiz?.hints.length || 1) - 1 || !!feedback}
                  className="text-[10px] font-black uppercase underline disabled:opacity-30"
                >
                  힌트 더 보기
                </button>
              </div>
              <div className="space-y-2">
                {quiz?.hints.slice(0, hintIndex + 1).map((hint, i) => (
                  <motion.p 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-bold text-gray-600 flex items-center gap-2"
                  >
                    <ChevronRight size={12} /> {hint}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10 p-8 text-center space-y-4",
                    feedback.isCorrect ? "border-neon-green" : "border-neon-pink"
                  )}
                >
                  {feedback.isCorrect ? (
                    <CheckCircle2 size={64} className="text-neon-green" />
                  ) : (
                    <XCircle size={64} className="text-neon-pink" />
                  )}
                  <h4 className="text-3xl font-display uppercase">
                    {feedback.isCorrect ? "소환 성공!" : "소환 실패"}
                  </h4>
                  <p className="text-sm font-bold">
                    {feedback.isCorrect 
                      ? `뇌의 뉴런이 강화되었습니다. (+${feedback.score} XP)` 
                      : `망각이 진행되고 있습니다. 정답은 '${quiz?.answer}'입니다.`}
                  </p>
                  <button 
                    onClick={nextItem}
                    className="px-8 py-3 bg-brutal-black text-white brutal-border brutal-shadow font-display uppercase"
                  >
                    다음 지식 소환
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Progress Dashboard */}
          <section className="p-6 brutal-border bg-brutal-black text-white brutal-shadow space-y-6">
            <h3 className="text-xl font-display flex items-center gap-2 text-neon-blue">
              <History size={20} /> 지식 고정 현황
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span>Fixation Level</span>
                  <span>{currentItem.fixationLevel}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 brutal-border">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentItem.fixationLevel}%` }}
                    className="h-full bg-neon-blue"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400">Next Review</div>
                  <div className="text-sm font-bold">In {currentItem.intervalDays} Days</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400">Difficulty</div>
                  <div className="text-sm font-bold">Level {quiz?.difficulty}</div>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 brutal-border bg-white brutal-shadow space-y-4">
            <h3 className="text-xl font-display flex items-center gap-2">
              <BookOpen size={20} /> 오늘의 소환 목록
            </h3>
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div 
                  key={it.id} 
                  className={cn(
                    "p-3 brutal-border flex items-center gap-3 transition-all",
                    idx === currentIndex ? "bg-neon-yellow" : "bg-gray-50 opacity-50"
                  )}
                >
                  <div className="w-6 h-6 bg-brutal-black text-white text-[10px] font-black flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black uppercase truncate">{it.category}</div>
                    <div className="text-xs font-bold truncate">{it.tags[0]}</div>
                  </div>
                  {idx < currentIndex && <CheckCircle2 size={16} className="text-neon-green" />}
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 brutal-border bg-neon-blue brutal-shadow space-y-2">
            <div className="flex items-center gap-2 font-display uppercase">
              <RefreshCcw size={20} /> Spaced Repetition
            </div>
            <p className="text-xs font-bold leading-tight">
              망각이 일어나기 직전의 '황금 시간'에 지식을 소환하여 기억 효율을 극대화합니다. 정답을 맞출수록 복습 주기가 길어집니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
