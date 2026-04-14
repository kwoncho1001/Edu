import React, { useState, useMemo } from 'react';
import { 
  Brain, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  TrendingUp,
  MessageSquare,
  ChevronRight,
  History,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DeepQuiz, 
  QuizEvaluation, 
  LearnerKnowledgeVector 
} from '@/types/quiz';
import { 
  evaluateSubjectiveAnswer, 
  calculateOptimalDifficulty,
  MOCK_QUIZZES 
} from '@/services/quizService';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeepQuizEngine() {
  const [learner, setLearner] = useState<LearnerKnowledgeVector>({
    subject: '운영체제',
    mastery: 65,
    recentAccuracy: 70,
    history: []
  });

  const [currentQuiz, setCurrentQuiz] = useState<DeepQuiz>(MOCK_QUIZZES[0]);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<QuizEvaluation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // 1.5초 지연으로 AI 분석 시뮬레이션
    setTimeout(() => {
      const result = evaluateSubjectiveAnswer(answer, currentQuiz);
      setEvaluation(result);
      
      // 학습자 이력 업데이트
      setLearner(prev => ({
        ...prev,
        history: [{ quizId: currentQuiz.id, score: result.score }, ...prev.history].slice(0, 10),
        mastery: Math.floor((prev.mastery + result.score) / 2)
      }));
      
      setIsSubmitting(false);
    }, 1500);
  };

  const nextQuiz = () => {
    const next = calculateOptimalDifficulty(learner, MOCK_QUIZZES);
    setCurrentQuiz(next);
    setAnswer('');
    setEvaluation(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brutal-black text-white brutal-border">
            <Brain size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-display uppercase">심화 주관식 퀴즈 엔진</h2>
            <p className="text-sm font-bold text-gray-500 uppercase">개념 간 연관성 및 논리 구조 평가</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 brutal-border bg-white brutal-shadow-sm">
            <div className="text-[10px] font-black uppercase text-gray-400">Mastery</div>
            <div className="text-2xl font-display text-neon-blue">{learner.mastery}%</div>
          </div>
          <div className="px-4 py-2 brutal-border bg-white brutal-shadow-sm">
            <div className="text-[10px] font-black uppercase text-gray-400">Difficulty</div>
            <div className="text-2xl font-display text-neon-pink">LV.{currentQuiz.complexity}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Quiz Content */}
        <div className="lg:col-span-2 space-y-6">
          <section className="p-8 brutal-border bg-white brutal-shadow space-y-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500">
              <Zap size={14} className="text-neon-yellow" /> Deep Reasoning Challenge
            </div>
            <h3 className="text-2xl font-display leading-tight">{currentQuiz.question}</h3>
            
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase text-gray-400">Your Answer</div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="개념 간의 인과관계를 포함하여 논리적으로 서술하세요..."
                className="w-full h-48 p-4 brutal-border bg-gray-50 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brutal-black transition-all"
                disabled={!!evaluation || isSubmitting}
              />
            </div>

            {!evaluation ? (
              <button
                onClick={handleSubmit}
                disabled={answer.length < 10 || isSubmitting}
                className="w-full py-4 bg-brutal-black text-white brutal-border brutal-shadow font-display text-xl uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>AI 분석 중<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity }}>...</motion.span></>
                ) : (
                  <><Send size={20} /> 답안 제출 및 AI 채점</>
                )}
              </button>
            ) : (
              <button
                onClick={nextQuiz}
                className="w-full py-4 bg-neon-green text-brutal-black brutal-border brutal-shadow font-display text-xl uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-3"
              >
                다음 문제 도전 <ChevronRight size={24} />
              </button>
            )}
          </section>

          {/* Feedback Section */}
          <AnimatePresence>
            {evaluation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className={cn(
                  "p-6 brutal-border brutal-shadow space-y-4",
                  evaluation.isSufficient ? "bg-neon-blue" : "bg-neon-pink"
                )}>
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-display uppercase">평가 결과</h4>
                    <div className="text-4xl font-display">{evaluation.score}점</div>
                  </div>
                  <p className="text-sm font-bold leading-snug">{evaluation.feedback}</p>
                  <div className="pt-4 border-t border-black/20">
                    <div className="text-[10px] font-black uppercase mb-1 opacity-60">논리 구조 분석</div>
                    <p className="text-xs font-medium">{evaluation.logicAnalysis}</p>
                  </div>
                </div>

                <div className="p-6 brutal-border bg-white brutal-shadow space-y-4">
                  <h4 className="text-xl font-display flex items-center gap-2">
                    <MessageSquare size={20} /> 키워드 & 인과관계
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] font-black uppercase text-gray-400 mb-1">누락된 핵심 키워드</div>
                      <div className="flex flex-wrap gap-2">
                        {evaluation.missingKeywords.length > 0 ? (
                          evaluation.missingKeywords.map(k => (
                            <span key={k} className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-black brutal-border">{k}</span>
                          ))
                        ) : (
                          <span className="text-xs font-bold text-neon-green">모든 키워드 포함!</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gray-400 mb-1">인과관계 점수</div>
                      <div className="w-full bg-gray-100 h-4 brutal-border overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${evaluation.causalityScore}%` }}
                          className="h-full bg-brutal-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Dashboard & History */}
        <div className="lg:col-span-1 space-y-6">
          <section className="p-6 brutal-border bg-brutal-black text-white brutal-shadow space-y-4">
            <h3 className="text-xl font-display flex items-center gap-2 text-neon-green">
              <TrendingUp size={20} /> 학습 성취도 대시보드
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">최근 평균 점수</span>
                <span className="text-lg font-display">{learner.recentAccuracy}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">누적 퀴즈 도전</span>
                <span className="text-lg font-display">{learner.history.length}회</span>
              </div>
            </div>
          </section>

          <section className="p-6 brutal-border bg-white brutal-shadow space-y-4">
            <h3 className="text-xl font-display flex items-center gap-2">
              <History size={20} /> 최근 도전 이력
            </h3>
            <div className="space-y-2">
              {learner.history.length > 0 ? (
                learner.history.map((h, i) => (
                  <div key={i} className="flex justify-between items-center p-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-500">Quiz #{h.quizId.split('-')[1] || i+1}</span>
                    <span className={cn(
                      "text-sm font-display",
                      h.score >= 80 ? "text-neon-blue" : h.score >= 60 ? "text-neon-yellow" : "text-neon-pink"
                    )}>{h.score}점</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">도전 이력이 없습니다.</p>
              )}
            </div>
          </section>

          <section className="p-6 brutal-border bg-neon-yellow brutal-shadow space-y-4">
            <h3 className="text-xl font-display flex items-center gap-2">
              <BookOpen size={20} /> 대조 학습 가이드
            </h3>
            <p className="text-xs font-bold leading-relaxed">
              서술형 답안은 단순히 지식을 나열하는 것이 아니라, 개념 간의 '왜(Why)'와 '어떻게(How)'를 연결하는 과정입니다. AI 피드백을 통해 논리적 빈틈을 메워보세요.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
