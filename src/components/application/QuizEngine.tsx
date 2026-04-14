import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, AlertCircle, Sparkles, Brain } from "lucide-react";
import { AdvancedQuiz } from "@/types/application";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const MOCK_QUIZ: AdvancedQuiz = {
  id: "q1",
  question: "데이터베이스 트랜잭션의 격리 수준(Isolation Level) 중 'Read Committed'와 'Repeatable Read'의 결정적인 차이점을 'Phantom Read' 현상과 관련지어 서술하시오.",
  expectedKeywords: ["Phantom Read", "Next-key Lock", "일관성", "범위"],
  rubric: "두 수준의 차이를 명확히 하고, Repeatable Read에서 Phantom Read가 발생하는 이유(또는 방지 방법)를 포함해야 함.",
  difficulty: "ADVANCED",
  conceptId: "db-1"
};

export default function QuizEngine() {
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    comment: string;
    missingKeywords: string[];
  } | null>(null);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setIsEvaluating(true);
    
    // Simulate AI Evaluation
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60; // 60-100
      const missing = MOCK_QUIZ.expectedKeywords.filter(k => !answer.includes(k));
      
      setFeedback({
        score,
        comment: score > 80 
          ? "훌륭한 논리 전개입니다. 개념 간의 인과관계를 정확히 파악하고 있습니다." 
          : "핵심 키워드 일부가 누락되었습니다. 격리 수준에 따른 락(Lock)의 범위를 다시 생각해보세요.",
        missingKeywords: missing
      });
      setIsEvaluating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="p-8 brutal-border bg-white brutal-shadow-lg space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brutal-black text-white brutal-border">
              <Brain size={24} />
            </div>
            <h3 className="text-2xl font-display">심화 주관식 퀴즈</h3>
          </div>
          <span className={cn(
            "px-3 py-1 brutal-border text-xs font-black uppercase",
            MOCK_QUIZ.difficulty === 'KILLER' ? "bg-red-500 text-white" : "bg-yellow-400"
          )}>
            {MOCK_QUIZ.difficulty}
          </span>
        </div>

        <div className="space-y-4">
          <div className="text-xs font-black uppercase text-gray-400">Question</div>
          <p className="text-2xl font-bold leading-relaxed text-brutal-black">
            {MOCK_QUIZ.question}
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-xs font-black uppercase text-gray-400">Your Answer</div>
          <textarea 
            className="w-full h-48 p-6 brutal-border bg-brutal-gray font-bold text-lg focus:bg-white focus:ring-4 focus:ring-neon-pink outline-none resize-none transition-all"
            placeholder="논리적인 인과관계를 바탕으로 서술하라..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isEvaluating || !!feedback}
          />
        </div>

        {!feedback ? (
          <button 
            onClick={handleSubmit}
            disabled={isEvaluating || !answer.trim()}
            className="w-full py-6 bg-brutal-black text-white brutal-border brutal-shadow font-display text-2xl flex items-center justify-center gap-3 hover:bg-neon-pink transition-all disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <Sparkles className="animate-spin" /> AI 정밀 채점 중...
              </>
            ) : (
              <>
                <Send size={24} /> 답안 제출 (Submit)
              </>
            )}
          </button>
        ) : (
          <button 
            onClick={() => { setAnswer(""); setFeedback(null); }}
            className="w-full py-6 bg-neon-green brutal-border brutal-shadow font-display text-2xl"
          >
            다음 퀴즈 도전
          </button>
        )}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="p-6 brutal-border bg-brutal-black text-white brutal-shadow flex flex-col items-center justify-center text-center">
              <div className="text-xs font-black uppercase text-neon-green mb-2">Evaluation Score</div>
              <div className="text-6xl font-display text-neon-pink">{feedback.score}</div>
              <div className="mt-4 text-[10px] font-bold opacity-60 uppercase">AI Logic Analysis</div>
            </div>

            <div className="md:col-span-2 p-6 brutal-border bg-white brutal-shadow space-y-4">
              <h4 className="text-xl font-display flex items-center gap-2">
                <MessageSquare className="text-neon-pink" /> AI 피드백
              </h4>
              <p className="font-bold text-gray-700 leading-relaxed italic">
                "{feedback.comment}"
              </p>
              
              {feedback.missingKeywords.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase text-red-500">Missing Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {feedback.missingKeywords.map(k => (
                      <span key={k} className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold brutal-border border-red-500">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
