import { Shield, AlertTriangle, Skull, Target, ChevronRight } from "lucide-react";
import { Villain, MetacognitionStats } from "@/types/villain";
import { cn } from "@/lib/utils";

interface Props {
  villains: Villain[];
  stats: MetacognitionStats;
  onStartMission: (villainId: string) => void;
}

export default function VillainIdentifier({ villains, stats, onStartMission }: Props) {
  return (
    <div className="space-y-8">
      {/* Metacognition Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 brutal-border bg-white brutal-shadow">
          <div className="text-xs font-black uppercase text-gray-400 mb-2">Metacognition Accuracy</div>
          <div className="text-5xl font-display text-brutal-black">{stats.accuracyIndex}%</div>
          <div className="mt-4 h-2 bg-brutal-gray brutal-border overflow-hidden">
            <div className="h-full bg-neon-green" style={{ width: `${stats.accuracyIndex}%` }} />
          </div>
        </div>
        
        <div className="p-6 brutal-border bg-white brutal-shadow">
          <div className="text-xs font-black uppercase text-gray-400 mb-2">Confidence Bias</div>
          <div className="text-5xl font-display text-neon-pink">
            {stats.confidenceBias > 0 ? `+${stats.confidenceBias}` : stats.confidenceBias}
          </div>
          <p className="mt-2 text-xs font-bold text-gray-500">
            {stats.confidenceBias > 20 ? "⚠️ 과도한 자신감 (착각의 늪)" : 
             stats.confidenceBias < -20 ? "📉 과도한 불안 (실력 저평가)" : "✅ 객관적 인지 상태"}
          </p>
        </div>

        <div className="p-6 brutal-border bg-brutal-black text-white brutal-shadow">
          <div className="text-xs font-black uppercase text-neon-green mb-4">Vulnerability Radar</div>
          <div className="space-y-2">
            {Object.entries(stats.vulnerabilityRadar).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-[10px] font-bold">
                <span className="uppercase">{key}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={cn("w-2 h-2 brutal-border", i <= (value as number) / 20 ? "bg-neon-pink" : "bg-gray-700")} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Villain List */}
      <div className="space-y-4">
        <h3 className="text-2xl font-display flex items-center gap-2">
          <Skull className="text-red-500" /> 현재 식별된 학습 빌런
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {villains.map((v) => (
            <div key={v.id} className="brutal-border bg-white overflow-hidden brutal-shadow group">
              <div className="p-4 bg-brutal-gray border-b-3 border-brutal-black flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-black uppercase brutal-border",
                    v.riskLevel === 'CRITICAL' ? "bg-red-600 text-white" : "bg-yellow-400"
                  )}>
                    Risk: {v.riskLevel}
                  </span>
                  <span className="font-display text-lg">{v.name}</span>
                </div>
                <AlertTriangle className="text-red-500 animate-pulse" size={18} />
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-sm font-bold text-gray-600 leading-relaxed">
                  {v.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Villain HP</span>
                    <span>{v.hp}/{v.maxHp}</span>
                  </div>
                  <div className="h-4 brutal-border bg-brutal-gray overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-1000" 
                      style={{ width: `${(v.hp / v.maxHp) * 100}%` }} 
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {v.weaknessTags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-brutal-black text-white text-[10px] font-bold brutal-border">
                      #{tag}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => onStartMission(v.id)}
                  className="w-full py-4 bg-neon-green brutal-border brutal-shadow font-display text-xl flex items-center justify-center gap-2 group-hover:bg-brutal-black group-hover:text-neon-green transition-all"
                >
                  <Target size={20} /> 소탕 미션 시작 <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
