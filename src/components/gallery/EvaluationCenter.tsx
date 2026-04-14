import React, { useState, useEffect } from 'react';
import { 
  Target, 
  ClipboardCheck, 
  Activity, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Timer,
  Network,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ComplexQuestion, 
  EvaluationSession, 
  CompetencyReport,
  ReasoningStep
} from '@/types/evaluation';
import { 
  generateComplexQuestion, 
  generateAchievementReport,
  analyzeReasoningPath 
} from '@/services/evaluationService';
import { motion, AnimatePresence } from 'framer-motion';
import VulnerabilityRadar from './VulnerabilityRadar';

export default function EvaluationCenter() {
  const [mode, setMode] = useState<'intro' | 'testing' | 'report'>('intro');
  const [question, setQuestion] = useState<ComplexQuestion | null>(null);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [stepStartTime, setStepStartTime] = useState<number>(0);
  const [timePerStep, setTimePerStep] = useState<Record<string, number>>({});
  const [session, setSession] = useState<EvaluationSession | null>(null);
  const [report, setReport] = useState<CompetencyReport | null>(null);

  const startEvaluation = () => {
    const q = generateComplexQuestion(['OS'], 7);
    setQuestion(q);
    setMode('testing');
    setStepStartTime(Date.now());
    setSession({
      id: Math.random().toString(36).substr(2, 9),
      startTime: new Date().toISOString(),
      responses: []
    });
  };

  const handleStepSelect = (stepId: string) => {
    if (selectedPath.includes(stepId)) return;
    
    const now = Date.now();
    const duration = now - stepStartTime;
    
    setTimePerStep(prev => ({ ...prev, [stepId]: duration }));
    setSelectedPath(prev => [...prev, stepId]);
    setStepStartTime(now);
  };

  const submitEvaluation = () => {
    if (!question || !session) return;

    const finalSession: EvaluationSession = {
      ...session,
      endTime: new Date().toISOString(),
      responses: [{
        questionId: question.id,
        selectedPath,
        timePerStep
      }]
    };

    const resultReport = generateAchievementReport(finalSession, [question]);
    setReport(resultReport);
    setMode('report');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brutal-black text-white brutal-border">
            <Target size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-display uppercase">원리 기반 응용 평가 센터</h2>
            <p className="text-sm font-bold text-gray-500 uppercase">시스템 통합 원리 및 실전 응용력 검증</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'intro' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="p-8 brutal-border bg-white brutal-shadow space-y-6">
              <h3 className="text-2xl font-display uppercase">평가 안내</h3>
              <p className="text-sm font-bold leading-relaxed text-gray-600">
                단순 암기형 문제를 넘어, 여러 개념이 복합적으로 얽힌 실전 시나리오를 해결해야 합니다. 
                정답 도출 과정의 **논리적 일관성**과 **추론 경로**가 정밀하게 분석됩니다.
              </p>
              <ul className="space-y-3">
                {[
                  "다중 개념 결합 신유형 문항",
                  "단계별 논리 추론 경로 분석",
                  "원리 중심 역량 리포트 발행",
                  "사고실험 이력 연동 분석"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-black uppercase">
                    <CheckCircle2 size={16} className="text-neon-green" /> {text}
                  </li>
                ))}
              </ul>
              <button 
                onClick={startEvaluation}
                className="w-full py-4 bg-brutal-black text-white brutal-border brutal-shadow font-display text-xl uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                평가 시작하기
              </button>
            </div>
            <div className="p-8 brutal-border bg-neon-yellow brutal-shadow flex flex-col justify-center items-center text-center space-y-4">
              <Activity size={64} />
              <h3 className="text-2xl font-display uppercase">현재 준비 상태</h3>
              <p className="text-sm font-bold">최근 사고실험 및 퀴즈 데이터를 바탕으로<br/>당신에게 최적화된 평가 세트가 준비되었습니다.</p>
            </div>
          </motion.div>
        )}

        {mode === 'testing' && question && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <section className="p-8 brutal-border bg-white brutal-shadow space-y-6">
                <div className="flex justify-between items-center">
                  <div className="px-3 py-1 bg-brutal-black text-white text-[10px] font-black uppercase">Complex Scenario</div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <Timer size={14} /> {Math.floor((Date.now() - stepStartTime) / 1000)}s
                  </div>
                </div>
                <h3 className="text-2xl font-display leading-tight">{question.title}</h3>
                <p className="p-4 bg-gray-50 border-l-4 border-brutal-black text-sm font-medium leading-relaxed italic">
                  "{question.scenario}"
                </p>

                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase text-gray-400">추론 경로 구성 (순서대로 선택하세요)</div>
                  <div className="grid grid-cols-1 gap-2">
                    {question.options.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleStepSelect(option.id)}
                        disabled={selectedPath.includes(option.id)}
                        className={cn(
                          "p-4 text-left text-sm font-bold brutal-border transition-all flex justify-between items-center",
                          selectedPath.includes(option.id) 
                            ? "bg-gray-100 text-gray-400 border-dashed" 
                            : "bg-white hover:bg-neon-blue/10"
                        )}
                      >
                        {option.description}
                        {selectedPath.includes(option.id) && (
                          <span className="text-[10px] font-black bg-brutal-black text-white px-2 py-0.5">
                            STEP {selectedPath.indexOf(option.id) + 1}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={submitEvaluation}
                  disabled={selectedPath.length < 2}
                  className="w-full py-4 bg-neon-green text-brutal-black brutal-border brutal-shadow font-display text-xl uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                >
                  최종 답안 제출
                </button>
              </section>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <section className="p-6 brutal-border bg-brutal-black text-white brutal-shadow space-y-4">
                <h4 className="text-xl font-display flex items-center gap-2 text-neon-blue">
                  <Network size={20} /> 결합된 핵심 원리
                </h4>
                <div className="flex flex-wrap gap-2">
                  {question.combinedConcepts.map(c => (
                    <span key={c} className="px-2 py-1 border border-white/20 text-[10px] font-black uppercase">{c}</span>
                  ))}
                </div>
              </section>
              <section className="p-6 brutal-border bg-white brutal-shadow space-y-4">
                <h4 className="text-xl font-display flex items-center gap-2">
                  <ClipboardCheck size={20} /> 현재 추론 경로
                </h4>
                <div className="space-y-3">
                  {selectedPath.map((id, i) => (
                    <div key={id} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brutal-black text-white text-[10px] font-black flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-xs font-bold leading-tight">
                        {question.options.find(o => o.id === id)?.description}
                      </p>
                    </div>
                  ))}
                  {selectedPath.length === 0 && (
                    <p className="text-xs text-gray-400 font-bold text-center py-4 italic">
                      논리 단계를 선택하여 경로를 구성하세요.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </motion.div>
        )}

        {mode === 'report' && report && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 brutal-border bg-brutal-black text-white brutal-shadow text-center">
                <div className="text-[10px] font-black uppercase text-neon-blue mb-2">Overall Achievement</div>
                <div className="text-7xl font-display mb-2">{report.overallScore}</div>
                <div className="text-xs font-bold text-gray-400 uppercase">Principle Mastery Index</div>
              </div>
              <VulnerabilityRadar 
                data={report.areaScores.map(a => ({ subject: a.area, value: a.score }))} 
              />
              <div className="p-6 brutal-border bg-white brutal-shadow space-y-4">
                <h4 className="text-xl font-display flex items-center gap-2">
                  <Network size={20} /> 지식 연결성 지수
                </h4>
                <div className="flex items-end gap-2">
                  <div className="text-4xl font-display">{(report.connectivityIndex * 100).toFixed(0)}%</div>
                  <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Connectivity</div>
                </div>
                <div className="w-full bg-gray-100 h-2 brutal-border">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${report.connectivityIndex * 100}%` }}
                    className="h-full bg-neon-blue"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <section className="p-8 brutal-border bg-white brutal-shadow space-y-6">
                <h3 className="text-2xl font-display flex items-center gap-2">
                  <BarChart3 size={24} /> 논리적 추론 경로 분석
                </h3>
                <div className="space-y-4">
                  {report.bottlenecks.map((b, i) => (
                    <div key={i} className="p-4 bg-neon-pink/10 border-l-4 border-neon-pink flex items-start gap-3">
                      <AlertCircle size={20} className="text-neon-pink shrink-0" />
                      <div>
                        <div className="text-xs font-black uppercase text-neon-pink">Bottleneck Detected</div>
                        <p className="text-sm font-bold">{b}</p>
                      </div>
                    </div>
                  ))}
                  {report.bottlenecks.length === 0 && (
                    <div className="p-4 bg-neon-green/10 border-l-4 border-neon-green flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-neon-green shrink-0" />
                      <p className="text-sm font-bold">모든 추론 단계가 논리적으로 완벽하게 연결되었습니다.</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.feedback.map((f, i) => (
                    <div key={i} className="p-4 brutal-border bg-gray-50 space-y-2">
                      <div className="text-[10px] font-black uppercase text-gray-400">{f.type} Feedback</div>
                      <p className="text-sm font-bold leading-tight">{f.message}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-black flex justify-end">
                  <button 
                    onClick={() => setMode('intro')}
                    className="flex items-center gap-2 px-6 py-3 bg-brutal-black text-white brutal-border brutal-shadow font-display uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    평가 종료 및 복귀 <ArrowRight size={20} />
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
