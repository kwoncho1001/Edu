import { useState, useEffect } from "react";
import { Play, RotateCcw, GitBranch, Info, Zap, ChevronRight } from "lucide-react";
import { Scenario, SimulationLog } from "@/types/application";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const MOCK_SCENARIO: Scenario = {
  id: "s1",
  title: "분산 시스템의 가용성 사고실험",
  description: "네트워크 파티션이 발생했을 때, 일관성(Consistency)과 가용성(Availability) 중 무엇을 선택할 것인가?",
  initialVariables: {
    nodes: 5,
    latency: 20,
    partition: 0 // 0: No, 1: Yes
  },
  logic: (vars) => {
    if (vars.partition === 1) {
      return "네트워크 파티션 발생! 일관성을 유지하려면 모든 노드의 응답을 기다려야 하므로 가용성이 0%로 떨어집니다. 반면 가용성을 선택하면 데이터 불일치가 발생할 수 있습니다.";
    }
    if (vars.latency > 100) {
      return "지연 시간이 너무 깁니다. 시스템 응답 속도가 현저히 느려져 사용자 이탈이 예상됩니다.";
    }
    return "시스템이 정상적으로 작동 중입니다. 모든 노드가 동기화되어 있으며 가용성이 높습니다.";
  }
};

export default function ThoughtSimulator() {
  const [variables, setVariables] = useState(MOCK_SCENARIO.initialVariables);
  const [outcome, setOutcome] = useState("");
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRun = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = MOCK_SCENARIO.logic(variables);
      setOutcome(result);
      setLogs(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        scenarioId: MOCK_SCENARIO.id,
        timestamp: Date.now(),
        variables: { ...variables },
        hypothesis: "변수 변화에 따른 시스템 안정성 테스트",
        outcome: result
      }, ...prev]);
      setIsSimulating(false);
    }, 800);
  };

  const reset = () => {
    setVariables(MOCK_SCENARIO.initialVariables);
    setOutcome("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Control Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-6 brutal-border bg-white brutal-shadow">
          <h3 className="text-xl font-display mb-4 flex items-center gap-2">
            <Zap className="text-neon-pink" /> 변수 설정 (Variables)
          </h3>
          <div className="space-y-6">
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase">
                  <span>{key}</span>
                  <span className="text-neon-pink">{value}</span>
                </div>
                {key === 'partition' ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setVariables(v => ({ ...v, [key]: 0 }))}
                      className={cn("flex-1 py-2 brutal-border text-xs font-bold", value === 0 ? "bg-brutal-black text-white" : "bg-white")}
                    >
                      OFF
                    </button>
                    <button 
                      onClick={() => setVariables(v => ({ ...v, [key]: 1 }))}
                      className={cn("flex-1 py-2 brutal-border text-xs font-bold", value === 1 ? "bg-red-500 text-white" : "bg-white")}
                    >
                      ON
                    </button>
                  </div>
                ) : (
                  <input 
                    type="range" 
                    min={key === 'nodes' ? 1 : 0} 
                    max={key === 'nodes' ? 20 : 500}
                    value={value}
                    onChange={(e) => setVariables(v => ({ ...v, [key]: parseInt(e.target.value) }))}
                    className="w-full accent-brutal-black"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button 
              onClick={handleRun}
              disabled={isSimulating}
              className="flex-1 py-4 bg-neon-green brutal-border brutal-shadow font-display text-xl flex items-center justify-center gap-2 hover:bg-brutal-black hover:text-neon-green transition-all"
            >
              <Play size={20} /> {isSimulating ? "시뮬레이션 중..." : "실행 (Run)"}
            </button>
            <button 
              onClick={reset}
              className="p-4 brutal-border bg-white hover:bg-brutal-gray transition-colors"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 brutal-border bg-brutal-black text-white brutal-shadow">
          <h4 className="text-sm font-black uppercase text-neon-green mb-2 flex items-center gap-2">
            <Info size={16} /> 사고실험 가이드
          </h4>
          <p className="text-xs leading-relaxed opacity-80">
            단순히 결과를 확인하는 것이 아니라, "왜 이런 결과가 나왔는가?"에 집중하십시오. 
            인과관계 트리를 통해 지식의 계보를 파악하는 것이 체화의 핵심입니다.
          </p>
        </div>
      </div>

      {/* Visualization & Outcome */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-8 brutal-border bg-white brutal-shadow-lg min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display flex items-center gap-2">
              <GitBranch className="text-neon-pink" /> 인과관계 시뮬레이션
            </h3>
            <div className="px-3 py-1 bg-brutal-black text-neon-green text-[10px] font-black uppercase">
              Real-time Logic Engine
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            <AnimatePresence mode="wait">
              {outcome ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-lg p-8 brutal-border bg-brutal-gray relative"
                >
                  <div className="absolute -top-4 -left-4 p-2 bg-brutal-black text-white brutal-border">
                    <Zap size={20} />
                  </div>
                  <p className="text-xl font-bold leading-relaxed italic">
                    "{outcome}"
                  </p>
                </motion.div>
              ) : (
                <div className="text-center space-y-4 opacity-30">
                  <GitBranch size={64} className="mx-auto" />
                  <p className="font-display text-2xl uppercase">변수를 조절하고 실행하라</p>
                </div>
              )}
            </AnimatePresence>

            {/* Decorative Causal Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
              <svg width="100%" height="100%">
                <path d="M 0 50 Q 250 100 500 50" stroke="black" strokeWidth="2" fill="none" />
                <path d="M 0 350 Q 250 300 500 350" stroke="black" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {/* Simulation History */}
        <div className="p-6 brutal-border bg-white brutal-shadow">
          <h3 className="text-xl font-display mb-4">시뮬레이션 로그 (History)</h3>
          <div className="space-y-3">
            {logs.length === 0 && <p className="text-sm text-gray-400 italic">아직 기록된 로그가 없습니다.</p>}
            {logs.map(log => (
              <div key={log.id} className="p-4 bg-brutal-gray brutal-border flex items-center justify-between group hover:bg-white transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-[10px] font-black text-gray-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-sm font-bold truncate max-w-[300px]">
                    {log.outcome}
                  </div>
                </div>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
