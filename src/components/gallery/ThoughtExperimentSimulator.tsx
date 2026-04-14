import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Settings2, 
  GitBranch, 
  Play, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ThoughtScenario, 
  ThoughtVariable, 
  ThoughtOutcome, 
  ThoughtExperimentLog,
  MasteryProfile
} from '@/types/thoughtExperiment';
import { 
  calculateOutcome, 
  findCounterExample, 
  evaluateMastery,
  MOCK_SCENARIOS 
} from '@/services/thoughtExperimentService';
import { motion, AnimatePresence } from 'framer-motion';
import VulnerabilityRadar from './VulnerabilityRadar';

export default function ThoughtExperimentSimulator() {
  const [scenario] = useState<ThoughtScenario>(MOCK_SCENARIOS[0]);
  const [variables, setVariables] = useState<ThoughtVariable[]>(scenario.initialVariables);
  const [hypothesis, setHypothesis] = useState<string>('');
  const [logs, setLogs] = useState<ThoughtExperimentLog[]>([]);
  const [currentOutcome, setCurrentOutcome] = useState<ThoughtOutcome | null>(null);
  const [counterExample, setCounterExample] = useState<{ counterVariables: ThoughtVariable[], reason: string } | null>(null);
  const [showMastery, setShowMastery] = useState(false);

  const mastery = useMemo(() => evaluateMastery(logs), [logs]);

  const handleVariableChange = (id: string, value: number) => {
    setVariables(prev => prev.map(v => v.id === id ? { ...v, value } : v));
    setCurrentOutcome(null);
    setCounterExample(null);
  };

  const runSimulation = () => {
    const outcome = calculateOutcome(scenario, variables);
    setCurrentOutcome(outcome);

    const newLog: ThoughtExperimentLog = {
      id: Math.random().toString(36).substr(2, 9),
      scenarioId: scenario.id,
      timestamp: new Date().toISOString(),
      variableSettings: variables.reduce((acc, v) => ({ ...acc, [v.id]: v.value }), {}),
      predictedOutcomeId: hypothesis,
      actualOutcomeId: outcome.id,
      isCounterExample: false
    };

    setLogs(prev => [newLog, ...prev]);

    // 반례 탐색
    if (hypothesis && hypothesis === outcome.id) {
      const ce = findCounterExample(scenario, variables, hypothesis);
      if (ce) {
        setCounterExample(ce);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brutal-black text-white brutal-border">
            <FlaskConical size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-display uppercase">사고실험 시뮬레이터</h2>
            <p className="text-sm font-bold text-gray-500 uppercase">{scenario.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowMastery(!showMastery)}
            className="px-4 py-2 brutal-border bg-white brutal-shadow-sm font-black text-xs uppercase flex items-center gap-2"
          >
            <BarChart3 size={16} /> {showMastery ? "실험실로 복귀" : "숙달도 리포트"}
          </button>
        </div>
      </div>

      {showMastery ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 brutal-border bg-brutal-black text-white brutal-shadow">
              <h3 className="text-xl font-display text-neon-green mb-4">종합 숙달도</h3>
              <div className="text-6xl font-display text-center mb-2">{mastery.score}</div>
              <div className="text-center text-xs font-bold text-gray-400 uppercase">Mastery Index</div>
            </div>
            <VulnerabilityRadar data={mastery.radarData} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <section className="p-6 brutal-border bg-white brutal-shadow space-y-4">
              <h3 className="text-xl font-display flex items-center gap-2">
                <History size={20} /> 실험 이력 (최근 5건)
              </h3>
              <div className="space-y-2">
                {logs.slice(0, 5).map(log => (
                  <div key={log.id} className="p-3 border border-black flex justify-between items-center bg-gray-50">
                    <div className="text-xs font-bold">
                      {new Date(log.timestamp).toLocaleTimeString()} - {scenario.possibleOutcomes.find(o => o.id === log.actualOutcomeId)?.title}
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 text-[8px] font-black uppercase brutal-border",
                      log.predictedOutcomeId === log.actualOutcomeId ? "bg-neon-green" : "bg-neon-pink text-white"
                    )}>
                      {log.predictedOutcomeId === log.actualOutcomeId ? "Prediction Success" : "Prediction Fail"}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="p-6 brutal-border bg-neon-yellow brutal-shadow space-y-4">
              <h3 className="text-xl font-display flex items-center gap-2">
                <ChevronRight size={20} /> 추천 학습 경로
              </h3>
              <ul className="space-y-2">
                {mastery.recommendedPath.map((path, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    {path}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Variable Controls */}
          <div className="lg:col-span-1 space-y-6">
            <section className="p-6 brutal-border bg-white brutal-shadow space-y-6">
              <h3 className="text-xl font-display flex items-center gap-2">
                <Settings2 size={20} /> 변수 동적 조작
              </h3>
              <div className="space-y-6">
                {variables.map(v => (
                  <div key={v.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-black uppercase">{v.name}</label>
                      <span className="text-sm font-display">{v.value}{v.unit}</span>
                    </div>
                    <input 
                      type="range" 
                      min={v.min} 
                      max={v.max} 
                      value={v.value}
                      onChange={(e) => handleVariableChange(v.id, Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brutal-black"
                    />
                    <p className="text-[10px] text-gray-500 font-bold">{v.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-6 brutal-border bg-brutal-gray space-y-4">
              <h3 className="text-xl font-display flex items-center gap-2">
                <GitBranch size={20} /> 가설 설정
              </h3>
              <div className="space-y-2">
                {scenario.possibleOutcomes.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setHypothesis(o.id)}
                    className={cn(
                      "w-full p-3 text-left text-xs font-bold brutal-border transition-all",
                      hypothesis === o.id ? "bg-brutal-black text-white" : "bg-white hover:bg-gray-100"
                    )}
                  >
                    {o.title}
                  </button>
                ))}
              </div>
            </section>

            <button 
              onClick={runSimulation}
              disabled={!hypothesis}
              className="w-full py-4 bg-neon-green text-brutal-black brutal-border brutal-shadow font-display text-xl uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={24} /> 시뮬레이션 실행
            </button>
          </div>

          {/* Right: Visualization & Feedback */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {currentOutcome ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Outcome Card */}
                  <div className={cn(
                    "p-8 brutal-border brutal-shadow space-y-4",
                    hypothesis === currentOutcome.id ? "bg-neon-blue" : "bg-neon-pink"
                  )}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-3xl font-display uppercase">{currentOutcome.title}</h3>
                      {hypothesis === currentOutcome.id ? (
                        <CheckCircle2 size={40} className="text-white" />
                      ) : (
                        <AlertTriangle size={40} className="text-white" />
                      )}
                    </div>
                    <p className="text-lg font-bold leading-tight">{currentOutcome.description}</p>
                    <div className="pt-4 border-t border-black/20">
                      <div className="text-[10px] font-black uppercase mb-1 opacity-60">논리적 근거</div>
                      <p className="text-sm font-medium">{currentOutcome.logicBasis}</p>
                    </div>
                  </div>

                  {/* Counter Example Alert */}
                  {counterExample && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-6 brutal-border bg-white brutal-shadow-sm border-l-[12px] border-l-red-600 space-y-3"
                    >
                      <div className="flex items-center gap-2 text-red-600 font-black uppercase text-sm">
                        <AlertTriangle size={18} /> 반례 자동 생성 분석 결과
                      </div>
                      <p className="text-sm font-bold">{counterExample.reason}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            counterExample.counterVariables.forEach(v => handleVariableChange(v.id, v.value));
                            setCounterExample(null);
                          }}
                          className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase brutal-border"
                        >
                          반례 상황 로드하기
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Causal Tree (Simplified) */}
                  <div className="p-6 brutal-border bg-white brutal-shadow space-y-4">
                    <h3 className="text-xl font-display flex items-center gap-2">
                      <GitBranch size={20} /> 인과관계 추론 트리
                    </h3>
                    <div className="flex items-center gap-4">
                      {currentOutcome.causalPath.map((varId, i) => (
                        <React.Fragment key={varId}>
                          <div className="p-3 brutal-border bg-brutal-gray text-[10px] font-black uppercase">
                            {variables.find(v => v.id === varId)?.name}
                          </div>
                          {i < currentOutcome.causalPath.length - 1 && <ChevronRight size={16} />}
                        </React.Fragment>
                      ))}
                      <ChevronRight size={16} />
                      <div className="p-3 brutal-border bg-brutal-black text-white text-[10px] font-black uppercase">
                        {currentOutcome.title}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 brutal-border bg-brutal-gray border-dashed border-4">
                  <FlaskConical size={64} className="text-gray-400 mb-4 animate-pulse" />
                  <p className="text-2xl font-display text-gray-400 text-center">
                    변수를 조절하고 가설을 세운 뒤<br/>시뮬레이션을 실행하세요.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
