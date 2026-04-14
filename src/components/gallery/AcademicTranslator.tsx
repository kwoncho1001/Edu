import React, { useState } from 'react';
import { 
  BookOpen, 
  Languages, 
  Zap, 
  ArrowRight, 
  BrainCircuit, 
  Sparkles, 
  History, 
  Settings2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  TransformationRule, 
  TranslationResult, 
  AnalogyCategory 
} from '@/types/translation';
import { translateAcademicText } from '@/services/translationService';
import { motion, AnimatePresence } from 'framer-motion';

export default function AcademicTranslator() {
  const [sourceText, setSourceText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [rule, setRule] = useState<TransformationRule>({
    intensity: 70,
    style: 'Humorous',
    preferredCategory: 'Gaming'
  });

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    // 시뮬레이션 지연
    const res = await translateAcademicText(sourceText, rule);
    setTimeout(() => {
      setResult(res);
      setIsTranslating(false);
    }, 1500);
  };

  const categories: { id: AnalogyCategory; label: string; icon: string }[] = [
    { id: 'Gaming', label: '게임/롤', icon: '🎮' },
    { id: 'Cooking', label: '요리/백종원', icon: '🍳' },
    { id: 'Sports', label: '스포츠/축구', icon: '⚽' },
    { id: 'DailyLife', label: '일상/야생', icon: '🌿' },
    { id: 'Work', label: '직장/사회생활', icon: '💼' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Input & Config (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="p-8 brutal-border bg-white brutal-shadow space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brutal-black text-white brutal-border">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display uppercase">학술 텍스트 입력</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase">Academic Source Input</p>
              </div>
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="번역이 필요한 딱딱한 전공 지식이나 논문 문단을 입력하세요..."
              className="w-full h-64 p-4 brutal-border bg-brutal-gray text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neon-pink transition-all resize-none"
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase">비유 카테고리</label>
                <span className="text-[10px] font-bold text-neon-pink">선호도 학습 적용 중</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setRule({ ...rule, preferredCategory: cat.id })}
                    className={cn(
                      "p-2 brutal-border text-[10px] font-black uppercase flex flex-col items-center gap-1 transition-all",
                      rule.preferredCategory === cat.id 
                        ? "bg-brutal-black text-white brutal-shadow-sm" 
                        : "bg-white hover:bg-brutal-gray"
                    )}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceText}
              className="w-full py-4 bg-neon-green text-brutal-black brutal-border brutal-shadow font-display text-2xl hover:bg-neon-pink hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isTranslating ? (
                <div className="w-6 h-6 border-4 border-brutal-black border-t-transparent animate-spin" />
              ) : (
                <>야생의 언어로 번역 <Languages size={24} /></>
              )}
            </button>
          </div>

          <div className="p-4 bg-blue-50 brutal-border border-blue-200 flex items-start gap-3">
            <AlertTriangle className="text-blue-500 shrink-0" size={20} />
            <p className="text-[10px] font-bold text-blue-700 leading-relaxed">
              학술적 엄밀함은 유지하되, 인지 부하를 80% 이상 낮추는 비유 모델이 자동 선택됩니다. 
              비유가 부적절할 경우 시스템이 자동으로 재탐색을 수행합니다.
            </p>
          </div>
        </div>

        {/* Right: Output & Analysis (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Translation Result Card */}
                <div className="p-8 brutal-border bg-brutal-black text-white brutal-shadow space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={120} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="text-neon-green" />
                      <h3 className="text-2xl font-display">도파민 1차 번역본</h3>
                    </div>
                    <div className="px-3 py-1 bg-neon-pink text-white text-[10px] font-black uppercase brutal-border border-white">
                      Cognitive Load -{result.cognitiveLoadReduction}%
                    </div>
                  </div>

                  <div className="p-6 bg-white/10 brutal-border border-white/20 min-h-[300px] text-lg font-bold leading-relaxed whitespace-pre-wrap">
                    {result.translatedText}
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 py-3 brutal-border border-white hover:bg-white hover:text-brutal-black text-xs font-black uppercase transition-all">
                      어조 제너레이터로 전달
                    </button>
                    <button className="px-6 py-3 brutal-border border-white hover:bg-neon-pink text-xs font-black uppercase transition-all">
                      복사하기
                    </button>
                  </div>
                </div>

                {/* Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 brutal-border bg-white space-y-4">
                    <div className="flex items-center gap-2 text-neon-pink">
                      <BrainCircuit size={18} />
                      <h4 className="text-xs font-black uppercase">추출된 핵심 개념</h4>
                    </div>
                    <div className="space-y-2">
                      {result.extractedTerms.map(term => (
                        <div key={term.id} className="p-3 bg-brutal-gray brutal-border text-[10px] font-bold">
                          <div className="flex justify-between mb-1">
                            <span className="text-brutal-black">{term.term}</span>
                            <span className="text-gray-400">{term.importance}</span>
                          </div>
                          <p className="text-gray-500 leading-tight">{term.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 brutal-border bg-white space-y-4">
                    <div className="flex items-center gap-2 text-neon-green">
                      <CheckCircle2 size={18} />
                      <h4 className="text-xs font-black uppercase">인지 부하 검증 결과</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black">
                        <span>비유 적합도</span>
                        <span className="text-neon-green">EXCELLENT</span>
                      </div>
                      <div className="w-full h-2 bg-brutal-gray brutal-border overflow-hidden">
                        <div className="w-[92%] h-full bg-neon-green" />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black">
                        <span>문체 친숙도</span>
                        <span className="text-neon-pink">HIGH</span>
                      </div>
                      <div className="w-full h-2 bg-brutal-gray brutal-border overflow-hidden">
                        <div className="w-[85%] h-full bg-neon-pink" />
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 pt-2">
                        * 원문의 학술적 무결성이 98% 유지되었습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] brutal-border bg-brutal-gray border-dashed flex flex-col items-center justify-center text-center p-12 space-y-6">
                <div className="p-6 bg-white brutal-border opacity-50">
                  <Languages size={64} className="text-gray-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-display text-gray-400 uppercase">번역 대기 중</h3>
                  <p className="text-sm font-bold text-gray-400 max-w-xs mx-auto">
                    왼쪽에 학술 텍스트를 입력하고 번역 버튼을 누르면 도파민 터지는 비유가 생성됩니다.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
