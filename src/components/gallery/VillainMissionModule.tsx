import React, { useState, useEffect } from 'react';
import { 
  Sword, 
  Shield, 
  Target, 
  Zap, 
  Trophy, 
  Timer, 
  AlertTriangle,
  Flame,
  Skull,
  Heart,
  ChevronRight,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Villain, 
  Mission, 
  MissionResult, 
  VulnerabilityDiagnosis 
} from '@/types/villain';
import { 
  diagnoseVulnerabilities, 
  createVillainMission, 
  processMissionResult 
} from '@/services/villainService';
import { LearningLog } from '@/types/metacognition';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  logs: LearningLog[];
  onMissionComplete: (result: MissionResult) => void;
}

export default function VillainMissionModule({ logs, onMissionComplete }: Props) {
  const [diagnosis, setDiagnosis] = useState<VulnerabilityDiagnosis[]>([]);
  const [activeVillain, setActiveVillain] = useState<Villain | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [isMissionMode, setIsMissionMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(0);
  const [showResult, setShowResult] = useState<MissionResult | null>(null);

  useEffect(() => {
    const d = diagnoseVulnerabilities(logs);
    setDiagnosis(d);
  }, [logs]);

  useEffect(() => {
    let timer: any;
    if (isMissionMode && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isMissionMode) {
      handleCompleteMission();
    }
    return () => clearInterval(timer);
  }, [isMissionMode, timeLeft]);

  const handleStartMission = (d: VulnerabilityDiagnosis) => {
    const { villain, mission } = createVillainMission(d);
    setActiveVillain(villain);
    setActiveMission(mission);
    setTimeLeft(mission.timeLimit);
    setIsMissionMode(true);
    setShowResult(null);
  };

  const handleCompleteMission = () => {
    if (!activeVillain) return;
    
    // 시뮬레이션: 실제로는 문제 풀이 결과가 들어옴
    const mockAccuracy = Math.random() * 0.4 + 0.6; // 60% ~ 100%
    const result = processMissionResult(activeVillain, mockAccuracy);
    
    setShowResult(result);
    setIsMissionMode(false);
    onMissionComplete(result);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {!isMissionMode && !showResult && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skull className="text-neon-pink" />
            <h3 className="text-2xl font-display uppercase">오늘의 소탕 대상 (취약점 빌런)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagnosis.map((d, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="p-6 brutal-border bg-white brutal-shadow space-y-4 relative overflow-hidden group"
              >
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Target size={120} />
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="px-2 py-1 bg-brutal-black text-white text-[10px] font-black uppercase">
                    Priority {d.priority}
                  </div>
                  <div className="text-neon-pink font-black text-xs">
                    정답률 {d.accuracy}%
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-display mb-1">{d.area}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    {d.errorType === 'Concept' ? '개념 이해 부족' : '계산/실수 잦음'}
                  </p>
                </div>

                <button
                  onClick={() => handleStartMission(d)}
                  className="w-full py-3 bg-neon-green text-brutal-black brutal-border brutal-shadow-sm font-black text-xs uppercase hover:bg-neon-pink hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  소탕 미션 시작 <Sword size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {isMissionMode && activeVillain && (
        <div className="fixed inset-0 z-50 bg-brutal-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-white brutal-border brutal-shadow p-8 space-y-8 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              {/* Villain Visual */}
              <div className="md:w-1/3 space-y-6">
                <div className="aspect-square brutal-border bg-brutal-gray flex items-center justify-center text-8xl relative">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {activeVillain.appearance}
                  </motion.div>
                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span>Villain HP</span>
                      <span>{activeVillain.hp} / {activeVillain.maxHp}</span>
                    </div>
                    <div className="w-full h-3 bg-white brutal-border overflow-hidden">
                      <div 
                        className="h-full bg-neon-pink" 
                        style={{ width: `${(activeVillain.hp / activeVillain.maxHp) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-brutal-black text-white brutal-border space-y-2">
                  <h4 className="font-display text-lg">{activeVillain.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 leading-tight">
                    {activeVillain.description}
                  </p>
                </div>
              </div>

              {/* Mission Content */}
              <div className="md:w-2/3 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-neon-pink">
                    <Timer size={24} />
                    <span className="font-display text-3xl">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-yellow-400 brutal-border font-black text-xs uppercase">
                    강제 집중 모드 활성화
                  </div>
                </div>

                <div className="p-8 brutal-border bg-brutal-gray min-h-[300px] flex flex-col items-center justify-center text-center space-y-6">
                  <div className="p-4 bg-white brutal-border">
                    <Target size={48} className="text-brutal-black" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display uppercase">{activeMission?.title}</h3>
                    <p className="text-sm font-bold text-gray-500">
                      취약점 보완을 위한 10개의 커스텀 문제가 생성되었습니다.<br/>
                      80% 이상의 정답률을 기록해야 빌런을 완전히 소탕할 수 있습니다.
                    </p>
                  </div>
                  <button
                    onClick={handleCompleteMission}
                    className="px-8 py-4 bg-brutal-black text-white brutal-border brutal-shadow font-display text-2xl hover:bg-neon-green hover:text-brutal-black transition-all"
                  >
                    문제 풀이 완료
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 brutal-border bg-white brutal-shadow text-center space-y-8 relative overflow-hidden"
        >
          {showResult.isSuccess ? (
            <>
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <Zap size={400} className="text-neon-green" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="inline-flex p-6 bg-neon-green brutal-border rounded-full">
                  <Trophy size={64} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-5xl font-display uppercase">빌런 소탕 성공!</h2>
                  <p className="text-xl font-bold text-gray-500">
                    정답률 {Math.floor(showResult.accuracy * 100)}% | 데미지 {showResult.damageDealt} HP
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="p-4 bg-brutal-black text-white brutal-border">
                    <div className="text-[10px] font-black uppercase text-gray-500">EXP 획득</div>
                    <div className="text-2xl font-display text-neon-green">+{showResult.rewards?.exp}</div>
                  </div>
                  <div className="p-4 bg-brutal-black text-white brutal-border">
                    <div className="text-[10px] font-black uppercase text-gray-500">가상 재화</div>
                    <div className="text-2xl font-display text-yellow-400">+{showResult.rewards?.currency}</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowResult(null)}
                  className="px-12 py-4 bg-brutal-black text-white brutal-border brutal-shadow font-display text-xl hover:bg-neon-pink transition-all"
                >
                  다음 미션 준비
                </button>
              </div>
            </>
          ) : (
            <div className="relative z-10 space-y-6">
              <div className="inline-flex p-6 bg-neon-pink text-white brutal-border rounded-full">
                <AlertTriangle size={64} />
              </div>
              <div className="space-y-2">
                <h2 className="text-5xl font-display uppercase">소탕 실패...</h2>
                <p className="text-xl font-bold text-gray-500">
                  빌런의 체력이 {showResult.remainingHp} 남았습니다. 더 정교한 타격이 필요합니다.
                </p>
              </div>
              <button
                onClick={() => setShowResult(null)}
                className="px-12 py-4 bg-brutal-black text-white brutal-border brutal-shadow font-display text-xl hover:bg-neon-pink transition-all"
              >
                재정비 후 다시 도전
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
