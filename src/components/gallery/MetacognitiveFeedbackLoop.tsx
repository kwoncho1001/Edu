import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Target, 
  AlertCircle, 
  Zap, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2,
  Timer,
  Ghost,
  Sword,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  LearningLog, 
  LearningPlan, 
  MetacognitiveReport, 
  MetacognitiveFeedback 
} from '@/types/metacognition';
import { 
  analyzeMetacognitiveGap, 
  detectVillains, 
  analyzePlanExecution 
} from '@/services/metacognitionService';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  logs: LearningLog[];
  currentPlan: LearningPlan;
}

export default function MetacognitiveFeedbackLoop({ logs, currentPlan }: Props) {
  const [report, setReport] = useState<MetacognitiveReport | null>(null);
  const [villains, setVillains] = useState<MetacognitiveFeedback[]>([]);
  const [planAnalysis, setPlanAnalysis] = useState<any>(null);

  useEffect(() => {
    if (logs.length > 0) {
      const metacogReport = analyzeMetacognitiveGap(logs);
      const detectedVillains = detectVillains(logs);
      const planResult = analyzePlanExecution(currentPlan);

      setReport(metacogReport);
      setVillains(detectedVillains);
      setPlanAnalysis(planResult);
    }
  }, [logs, currentPlan]);

  if (!report) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Metacognitive Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 brutal-border bg-white brutal-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-gray-400">메타인지 불일치 지수 (MCI)</h4>
            <Brain className="text-neon-pink" size={20} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-display">{(report.mci * 100).toFixed(0)}</span>
            <span className="text-xl font-display text-gray-400">/ 100</span>
          </div>
          <div className="w-full h-2 bg-brutal-gray brutal-border">
            <div 
              className={cn(
                "h-full transition-all duration-1000",
                report.mci > 0.5 ? "bg-neon-pink" : "bg-neon-green"
              )} 
              style={{ width: `${report.mci * 100}%` }} 
            />
          </div>
        </div>

        <div className="p-6 brutal-border bg-brutal-black text-white brutal-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-gray-500">계획 이행률</h4>
            <Target className="text-neon-green" size={20} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-display">{planAnalysis?.executionRate.toFixed(0)}%</span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 leading-tight">
            {planAnalysis?.feedback}
          </p>
        </div>

        <div className="p-6 brutal-border bg-white brutal-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-gray-400">추천 난이도 조정</h4>
            <Zap className="text-yellow-400" size={20} />
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              "px-4 py-2 brutal-border font-display text-xl",
              report.suggestedDifficulty === 'Higher' ? "bg-neon-green" : 
              report.suggestedDifficulty === 'Lower' ? "bg-neon-pink text-white" : "bg-brutal-gray"
            )}>
              {report.suggestedDifficulty === 'Higher' ? 'UP' : 
               report.suggestedDifficulty === 'Lower' ? 'DOWN' : 'STAY'}
            </div>
            <span className="text-xs font-bold leading-tight">
              {report.suggestedDifficulty === 'Higher' ? '실력이 넘칩니다! 더 높은 곳으로.' : 
               report.suggestedDifficulty === 'Lower' ? '잠시 멈추고 기초를 다질 시간입니다.' : '현재 페이스가 아주 좋습니다.'}
            </span>
          </div>
        </div>
      </div>

      {/* Villain Alerts & Correction Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="text-neon-pink" />
            <h3 className="text-2xl font-display uppercase">빌런 소탕 피드백</h3>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {[...report.feedback, ...villains].map((fb, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-6 brutal-border brutal-shadow-sm flex gap-6 items-start transition-all",
                    fb.type === 'VillainAlert' ? "bg-red-50 border-neon-pink" : "bg-white"
                  )}
                >
                  <div className={cn(
                    "p-4 brutal-border shrink-0",
                    fb.type === 'VillainAlert' ? "bg-neon-pink text-white" : "bg-brutal-black text-white"
                  )}>
                    {fb.type === 'VillainAlert' ? <Ghost size={32} /> : <Sword size={32} />}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-display">{fb.title}</h4>
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 brutal-border",
                        fb.severity === 'High' ? "bg-neon-pink text-white" : "bg-yellow-400"
                      )}>
                        {fb.severity}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-600">{fb.message}</p>
                    <div className="pt-2 flex items-center gap-2 text-neon-pink font-black text-xs uppercase">
                      <Zap size={14} /> 교정 가이드: {fb.actionGuide}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {report.feedback.length === 0 && villains.length === 0 && (
              <div className="p-12 brutal-border border-dashed bg-brutal-gray flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 size={48} className="text-neon-green" />
                <p className="font-display text-xl text-gray-400">현재 감지된 학습 빌런이 없습니다.<br/>클린한 학습 상태입니다!</p>
              </div>
            )}
          </div>
        </div>

        {/* Learning Pattern Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 brutal-border bg-white brutal-shadow space-y-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-brutal-black" />
              <h3 className="text-xl font-display uppercase">실시간 행동 패턴 분석</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase">
                  <span>평균 응답 속도</span>
                  <span>{(logs.reduce((acc, l) => acc + l.responseTime, 0) / logs.length / 1000).toFixed(1)}s</span>
                </div>
                <div className="w-full h-4 bg-brutal-gray brutal-border relative">
                  <div className="absolute inset-y-0 left-0 bg-brutal-black w-[40%]" />
                  <div className="absolute inset-y-0 left-[40%] w-0.5 bg-neon-pink z-10" /> {/* Target line */}
                </div>
                <p className="text-[10px] font-bold text-gray-400">목표 속도 대비 15% 빠름 (주의)</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase">
                  <span>힌트 사용 빈도</span>
                  <span>{(logs.filter(l => l.hintUsed).length / logs.length * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-4 bg-brutal-gray brutal-border">
                  <div 
                    className="h-full bg-yellow-400" 
                    style={{ width: `${(logs.filter(l => l.hintUsed).length / logs.length * 100)}%` }} 
                  />
                </div>
              </div>

              <div className="pt-4 border-t-2 border-brutal-gray">
                <div className="flex items-start gap-3">
                  <Timer className="text-gray-400 shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-black uppercase">집중도 골든 타임</p>
                    <p className="text-sm font-bold">오후 2시 - 4시 (현재 가장 효율적)</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full py-3 bg-brutal-black text-white brutal-border brutal-shadow font-black text-xs uppercase hover:bg-neon-pink transition-all">
              상세 분석 리포트 다운로드
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
