import React, { useState, useEffect, useCallback } from 'react';
import { Smile, Frown, Zap, Coffee, Trophy, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserEmotionProfile, AchievementFeedback, Intervention, GrowthData } from '@/types/emotion';
import { calculateAchievementFeedback, checkSelfDoubtIntervention, calculateGrowthIndex } from '@/services/emotionService';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  userId: string;
  onPointsUpdate: (points: number) => void;
}

export default function EmotionManager({ userId, onPointsUpdate }: Props) {
  const [profile, setProfile] = useState<UserEmotionProfile>({
    userId,
    currentEmotion: 'Interest',
    goalType: 'Challenge',
    streakDays: 5,
    totalPoints: 1250
  });

  const [feedback, setFeedback] = useState<AchievementFeedback | null>(null);
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [sessionStartTime] = useState(Date.now());
  const [errorCount, setErrorCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // 시뮬레이션: 학습 완료 시 피드백 트리거
  const triggerSuccess = useCallback((difficulty: any) => {
    const result = calculateAchievementFeedback(difficulty, profile.streakDays, profile);
    setFeedback(result);
    onPointsUpdate(result.points);
    setTimeout(() => setFeedback(null), 5000);
  }, [profile, onPointsUpdate]);

  // 실시간 모니터링: 자괴감 방지
  useEffect(() => {
    const interval = setInterval(() => {
      const sessionMinutes = (Date.now() - sessionStartTime) / 60000;
      const errorRate = totalAttempts > 0 ? errorCount / totalAttempts : 0;
      
      const result = checkSelfDoubtIntervention(sessionMinutes, errorRate, profile.lastInterventionTime);
      if (result) {
        setIntervention(result);
        setProfile(prev => ({ ...prev, lastInterventionTime: new Date().toISOString() }));
      }
    }, 30000); // 30초마다 체크

    return () => clearInterval(interval);
  }, [sessionStartTime, errorCount, totalAttempts, profile.lastInterventionTime]);

  // 성장 데이터 계산
  const growth = useMemo(() => calculateGrowthIndex(15, 1.2, profile.streakDays), [profile.streakDays]);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="pointer-events-auto p-6 brutal-border bg-neon-green brutal-shadow max-w-xs"
          >
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="text-brutal-black" />
              <span className="font-black text-xl">+{feedback.points} PTS</span>
            </div>
            <p className="font-bold text-sm leading-tight">{feedback.message}</p>
            {feedback.animationType === 'firework' && (
              <div className="absolute -top-4 -right-4 animate-bounce">
                <Sparkles className="text-neon-pink" size={32} />
              </div>
            )}
          </motion.div>
        )}

        {intervention && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="pointer-events-auto p-6 brutal-border bg-white brutal-shadow border-neon-pink max-w-xs"
          >
            <div className="flex items-center gap-3 mb-2 text-neon-pink">
              {intervention.type === 'Rest' ? <Coffee /> : <AlertCircle />}
              <span className="font-black uppercase text-xs">{intervention.type} ALERT</span>
            </div>
            <p className="font-bold text-sm mb-4">{intervention.message}</p>
            <button 
              onClick={() => setIntervention(null)}
              className="w-full py-2 bg-brutal-black text-white font-black text-xs uppercase brutal-border hover:bg-neon-pink transition-colors"
            >
              {intervention.actionLabel || "확인"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Dashboard Trigger */}
      <div className="pointer-events-auto group relative">
        <button className="p-4 brutal-border bg-brutal-black text-white brutal-shadow hover:bg-neon-pink transition-colors">
          <TrendingUp size={24} />
        </button>
        
        <div className="absolute bottom-full right-0 mb-4 w-64 p-6 brutal-border bg-white brutal-shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          <h4 className="text-xl font-display mb-4 flex items-center gap-2">
            <Zap className="text-neon-pink" /> 성장 가시화
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[10px] font-black uppercase text-gray-400">Current Level</div>
                <div className="text-3xl font-display">LV.{growth.level}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase text-gray-400">Passion</div>
                <div className={cn(
                  "px-2 py-0.5 brutal-border text-[10px] font-black",
                  growth.passionLevel === 'Burning' ? "bg-neon-pink text-white" : "bg-neon-green"
                )}>
                  {growth.passionLevel}
                </div>
              </div>
            </div>
            
            <div className="h-4 brutal-border bg-brutal-gray overflow-hidden">
              <div 
                className="h-full bg-brutal-black transition-all duration-1000" 
                style={{ width: `${(growth.growthIndex % 100)}%` }}
              ></div>
            </div>
            
            <p className="text-[10px] font-bold text-gray-500 leading-tight">
              {growth.weeklySummary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useMemo } from 'react';
