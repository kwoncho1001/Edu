import { BarChart3, Target, Award, ArrowUpRight, Brain, Zap } from "lucide-react";
import { EvaluationSession } from "@/types/application";
import { cn } from "@/lib/utils";

const MOCK_SESSION: EvaluationSession = {
  id: "e1",
  startTime: Date.now() - 3600000,
  score: 82,
  competencyMap: {
    "논리적 추론": 85,
    "개념 통합": 70,
    "신유형 대응": 90,
    "원리 체화": 75,
    "문제 해결": 88
  },
  feedback: "전반적으로 우수한 응용력을 보여주고 있습니다. 특히 처음 보는 유형에 대한 논리 구조 해체 능력이 탁월합니다. 다만, 복합적인 개념 간의 유기적 연결 고리를 찾는 연습이 조금 더 필요합니다."
};

export default function EvaluationCenter() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Score Card */}
        <div className="lg:col-span-1 p-8 brutal-border bg-brutal-black text-white brutal-shadow flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-neon-pink text-white text-[10px] font-black uppercase rotate-12 translate-x-4 -translate-y-2">
            Top 5%
          </div>
          <div className="text-xs font-black uppercase text-neon-green mb-4">Overall Mastery</div>
          <div className="text-8xl font-display text-white mb-4">{MOCK_SESSION.score}</div>
          <div className="flex items-center gap-2 text-neon-green font-bold">
            <ArrowUpRight size={20} /> +12% from last week
          </div>
        </div>

        {/* Competency Radar/Bar Chart */}
        <div className="lg:col-span-3 p-8 brutal-border bg-white brutal-shadow space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display flex items-center gap-2">
              <BarChart3 className="text-neon-pink" /> 원리 중심 역량 분석
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-neon-green brutal-border" />
                <span className="text-[10px] font-black uppercase">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-brutal-gray brutal-border" />
                <span className="text-[10px] font-black uppercase">Target</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(MOCK_SESSION.competencyMap).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase">
                  <span>{key}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-6 brutal-border bg-brutal-gray relative overflow-hidden">
                  <div 
                    className="h-full bg-neon-green transition-all duration-1000" 
                    style={{ width: `${value}%` }} 
                  />
                  <div className="absolute top-0 left-0 h-full w-full flex items-center justify-end px-2 pointer-events-none">
                    <div className="w-1 h-full bg-brutal-black opacity-20" style={{ marginRight: '10%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feedback Section */}
        <div className="p-8 brutal-border bg-white brutal-shadow space-y-6">
          <h3 className="text-2xl font-display flex items-center gap-2">
            <Target className="text-neon-pink" /> 실전 피드백 (AI Analysis)
          </h3>
          <div className="p-6 bg-brutal-gray brutal-border italic font-bold text-lg leading-relaxed">
            "{MOCK_SESSION.feedback}"
          </div>
          <div className="flex gap-4">
            <div className="flex-1 p-4 brutal-border bg-neon-green/10 border-neon-green/30">
              <div className="text-[10px] font-black uppercase text-neon-green mb-1">Strength</div>
              <p className="text-xs font-bold">신유형 문제 해체 능력</p>
            </div>
            <div className="flex-1 p-4 brutal-border bg-neon-pink/10 border-neon-pink/30">
              <div className="text-[10px] font-black uppercase text-neon-pink mb-1">Weakness</div>
              <p className="text-xs font-bold">개념 간 유기적 연결</p>
            </div>
          </div>
        </div>

        {/* Achievement & Next Steps */}
        <div className="p-8 brutal-border bg-brutal-black text-white brutal-shadow space-y-6">
          <h3 className="text-2xl font-display flex items-center gap-2 text-neon-green">
            <Award /> 획득 배지 및 다음 단계
          </h3>
          <div className="flex gap-4">
            <div className="w-16 h-16 brutal-border bg-white text-brutal-black flex items-center justify-center text-3xl">
              🧠
            </div>
            <div className="w-16 h-16 brutal-border bg-neon-pink text-white flex items-center justify-center text-3xl">
              ⚡️
            </div>
            <div className="w-16 h-16 brutal-border bg-neon-green text-brutal-black flex items-center justify-center text-3xl opacity-30">
              ?
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-400">
              다음 단계: <span className="text-white">'분산 시스템의 가용성'</span> 사고실험 2단계 진입 권장
            </p>
            <button className="w-full py-4 bg-neon-green text-brutal-black brutal-border brutal-shadow font-display text-xl hover:bg-white transition-all">
              보충 학습 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
