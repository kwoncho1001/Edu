import React, { useState } from 'react';
import { Zap, Sliders, MessageSquare, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DopamineConfig, AchievementStats, ToneTransformationResult } from '@/types/tone';
import { transformToDopamineTone } from '@/services/toneService';
import { motion } from 'framer-motion';

interface Props {
  sourceText: string;
  keywords: string[];
  onComplete: (result: ToneTransformationResult) => void;
}

export default function DopamineToneGenerator({ sourceText, keywords, onComplete }: Props) {
  const [config, setConfig] = useState<DopamineConfig>({
    intensity: 50,
    concept: 'Stimulating',
    useColloquial: true,
    memePreference: ['Gaming', 'Community']
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ToneTransformationResult | null>(null);

  const handleTransform = () => {
    setIsGenerating(true);
    
    // Mock Stats
    const stats: AchievementStats = {
      difficulty: '중급',
      streakDays: 5,
      errorRate: 0.1,
      sessionTimeSeconds: 450
    };

    // 시뮬레이션 지연
    setTimeout(() => {
      const transformed = transformToDopamineTone(sourceText, config, stats, keywords);
      setResult(transformed);
      setIsGenerating(false);
      onComplete(transformed);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="p-8 brutal-border bg-white brutal-shadow space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neon-pink text-white brutal-border">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-display">도파민 어조 설정</h3>
              <p className="text-xs font-bold text-gray-500 uppercase">Dopamine Tone Configuration</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black uppercase">어조 강도 (Intensity)</label>
                <span className="text-xl font-display text-neon-pink">{config.intensity}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={config.intensity}
                onChange={(e) => setConfig({ ...config, intensity: parseInt(e.target.value) })}
                className="w-full h-4 brutal-border appearance-none bg-brutal-gray cursor-pointer accent-neon-pink"
              />
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase">
                <span>Friendly</span>
                <span>Normal</span>
                <span>Extreme</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Friendly', 'Stimulating', 'Humorous'] as const).map(concept => (
                <button
                  key={concept}
                  onClick={() => setConfig({ ...config, concept })}
                  className={cn(
                    "py-2 brutal-border text-[10px] font-black uppercase transition-all",
                    config.concept === concept ? "bg-brutal-black text-white" : "bg-white hover:bg-brutal-gray"
                  )}
                >
                  {concept}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 bg-brutal-gray brutal-border">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-neon-pink" />
                <span className="text-xs font-bold">반말 모드 활성화</span>
              </div>
              <button 
                onClick={() => setConfig({ ...config, useColloquial: !config.useColloquial })}
                className={cn(
                  "w-12 h-6 brutal-border transition-all relative",
                  config.useColloquial ? "bg-neon-green" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 w-4 h-4 brutal-border bg-white transition-all",
                  config.useColloquial ? "right-0.5" : "left-0.5"
                )} />
              </button>
            </div>
          </div>

          <button 
            onClick={handleTransform}
            disabled={isGenerating}
            className="w-full py-4 bg-brutal-black text-white brutal-border brutal-shadow font-display text-2xl hover:bg-neon-pink transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent animate-spin" />
            ) : (
              <>변환하기 <Sparkles size={24} /></>
            )}
          </button>

          <div className="flex items-center gap-2 p-3 bg-blue-50 brutal-border border-blue-200">
            <ShieldCheck className="text-blue-500" size={16} />
            <p className="text-[10px] font-bold text-blue-600">
              어조 필터링 시스템 작동 중: 비속어 및 부적절한 표현은 자동으로 정제됩니다.
            </p>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col gap-6">
          <div className="p-6 brutal-border bg-brutal-gray flex-1 space-y-4">
            <h4 className="text-xs font-black uppercase text-gray-400">Original Text</h4>
            <div className="p-4 bg-white brutal-border min-h-[150px] text-sm font-medium leading-relaxed">
              {sourceText}
            </div>
          </div>

          <div className="p-6 brutal-border bg-brutal-black text-white flex-1 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Zap size={120} />
            </div>
            <h4 className="text-xs font-black uppercase text-neon-pink">Dopamine Output</h4>
            <div className="p-4 bg-white/10 brutal-border border-white/20 min-h-[150px] text-sm font-bold leading-relaxed whitespace-pre-wrap">
              {result ? result.transformedText : "변환 버튼을 눌러 도파민을 주입하세요..."}
            </div>
            
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-neon-pink text-white brutal-border border-white"
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-black uppercase">Achievement Reward</span>
                </div>
                <p className="text-xs font-black">{result.achievementMessage}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
