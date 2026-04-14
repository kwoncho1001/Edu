import { useState, useEffect } from "react";
import { Skull, Target, ShieldAlert, Zap, Brain, History, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Villain, MetacognitionStats, LearningLog } from "@/types/villain";
import VillainIdentifier from "@/components/villain/VillainIdentifier";
import MissionRunner from "@/components/villain/MissionRunner";

const INITIAL_VILLAINS: Villain[] = [
  {
    id: "v1",
    name: "착각의 늪 (Overconfidence)",
    type: "OVERCONFIDENCE",
    description: "눈으로 훑고 '안다'고 착각하게 만드는 빌런. 실제 정답률보다 본인의 확신이 훨씬 높을 때 출현함.",
    hp: 100,
    maxHp: 100,
    riskLevel: "CRITICAL",
    weaknessTags: ["백지복습", "역설명", "실전테스트"]
  },
  {
    id: "v2",
    name: "대충 읽기 (Lazy Reading)",
    type: "LAZY_READING",
    description: "문제의 핵심 조건을 무시하고 본인이 보고 싶은 것만 보게 함. '옳지 않은 것'을 '옳은 것'으로 보게 만드는 주범.",
    hp: 75,
    maxHp: 100,
    riskLevel: "HIGH",
    weaknessTags: ["조건밑줄", "키워드추출", "슬로우독해"]
  }
];

const INITIAL_STATS: MetacognitionStats = {
  accuracyIndex: 68,
  confidenceBias: 35, // Overconfident
  vulnerabilityRadar: {
    "개념 이해": 40,
    "문제 분석": 85,
    "시간 관리": 60,
    "실수 방지": 90,
    "응용력": 30
  }
};

export default function VillainEradication() {
  const [villains, setVillains] = useState<Villain[]>(INITIAL_VILLAINS);
  const [stats, setStats] = useState<MetacognitionStats>(INITIAL_STATS);
  const [activeMissionVillainId, setActiveMissionVillainId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Simulate real-time feedback loop
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedback(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartMission = (id: string) => {
    setActiveMissionVillainId(id);
  };

  const handleMissionComplete = (damage: number) => {
    if (!activeMissionVillainId) return;

    setVillains(prev => prev.map(v => 
      v.id === activeMissionVillainId 
        ? { ...v, hp: Math.max(0, v.hp - damage) } 
        : v
    ));
    
    // Update stats based on mission success
    setStats(prev => ({
      ...prev,
      accuracyIndex: Math.min(100, prev.accuracyIndex + 5),
      confidenceBias: Math.max(0, prev.confidenceBias - 10)
    }));

    setActiveMissionVillainId(null);
  };

  const activeVillain = villains.find(v => v.id === activeMissionVillainId);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 brutal-border bg-red-600 text-white">
            <Skull size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-brutal-black">빌런 소탕</h1>
        </div>
        <p className="text-xl font-medium max-w-2xl leading-relaxed">
          너의 잘못된 학습 습관을 '빌런'으로 규정한다. <br/>
          <span className="text-red-600 font-black uppercase">데이터로 저격하고 메타인지를 교정하라.</span>
        </p>
      </header>

      {showFeedback && (
        <div className="p-6 brutal-border bg-yellow-400 brutal-shadow animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-4">
            <ShieldAlert size={32} className="shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-display mb-1">실시간 메타인지 오류 감지!</h3>
              <p className="font-bold text-sm">
                방금 푼 3문제의 평균 응답 시간이 5초 미만입니다. <br/>
                <span className="underline italic">'대충 읽기' 빌런</span>이 당신의 뇌를 장악하고 있습니다. 즉시 교정 미션을 수행하십시오.
              </p>
            </div>
            <button 
              onClick={() => setShowFeedback(false)}
              className="px-4 py-2 bg-brutal-black text-white brutal-border text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors"
            >
              알겠음 (교정 시작)
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <VillainIdentifier 
            villains={villains} 
            stats={stats} 
            onStartMission={handleStartMission} 
          />
        </div>

        <aside className="space-y-8">
          <section className="brutal-border bg-white p-6 brutal-shadow">
            <h3 className="text-xl font-display mb-6 flex items-center gap-2">
              <History size={20} /> 소탕 기록
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-brutal-gray brutal-border">
                <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Yesterday</div>
                <div className="font-bold text-sm">시간 낭비 빌런 소탕 완료</div>
                <div className="mt-2 text-[10px] font-bold text-neon-green uppercase">Accuracy +12%</div>
              </div>
              <div className="p-4 bg-brutal-gray brutal-border opacity-50">
                <div className="text-[10px] font-black uppercase text-gray-400 mb-1">2 days ago</div>
                <div className="font-bold text-sm">개념 착각 빌런 도주</div>
                <div className="mt-2 text-[10px] font-bold text-red-500 uppercase">Penalty Applied</div>
              </div>
            </div>
          </section>

          <section className="brutal-border bg-brutal-black text-white p-6 brutal-shadow">
            <h3 className="text-xl font-display mb-4 flex items-center gap-2 text-neon-green">
              <Zap size={20} /> 메타인지 교정 가이드
            </h3>
            <div className="space-y-4 text-sm font-medium">
              <div className="p-3 border border-gray-700 bg-gray-900">
                <div className="text-neon-pink font-black text-[10px] uppercase mb-1">Tip 01</div>
                <p>문제를 풀기 전, 예상 점수를 먼저 기록해라. 실제 점수와의 오차가 너의 메타인지 오류다.</p>
              </div>
              <div className="p-3 border border-gray-700 bg-gray-900">
                <div className="text-neon-pink font-black text-[10px] uppercase mb-1">Tip 02</div>
                <p>'실수'라고 말하지 마라. 실수는 반복되는 패턴이며, 그 자체가 제거해야 할 빌런이다.</p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {activeMissionVillainId && activeVillain && (
        <MissionRunner 
          villain={activeVillain} 
          onComplete={handleMissionComplete} 
          onCancel={() => setActiveMissionVillainId(null)} 
        />
      )}
    </div>
  );
}
