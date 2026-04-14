import { TrendingUp, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { VariantPattern, Concept } from "@/types/exam";
import { cn } from "@/lib/utils";

interface Props {
  patterns: VariantPattern[];
  concepts: Concept[];
}

export default function VariantAnalyzer({ patterns, concepts }: Props) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-display flex items-center gap-2">
          <TrendingUp className="text-neon-pink" /> 신유형 및 변형 예측 리포트
        </h3>
        <div className="px-3 py-1 bg-brutal-black text-neon-green brutal-border text-xs font-bold uppercase tracking-widest animate-pulse">
          AI Analysis Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {patterns.map((pattern) => {
          const concept = concepts.find(c => c.id === pattern.conceptId);
          return (
            <div key={pattern.id} className="brutal-border bg-white overflow-hidden brutal-shadow">
              <div className="p-4 bg-brutal-gray border-b-3 border-brutal-black flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap className="text-yellow-500" size={18} />
                  <span className="font-display text-lg">{pattern.title}</span>
                </div>
                <div className="px-2 py-0.5 bg-neon-pink text-white text-[10px] font-bold brutal-border">
                  변형 로직: {pattern.logic}
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase text-gray-400">연관 개념</div>
                  <div className="font-bold text-lg">{concept?.name}</div>
                </div>

                <div className="p-4 bg-yellow-50 brutal-border border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-700 font-bold text-sm mb-2">
                    <AlertTriangle size={16} /> 변형 가이드라인
                  </div>
                  <p className="text-sm leading-relaxed">{pattern.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-black uppercase text-purple-500">예측 변형 문항</div>
                  <div className="p-4 bg-brutal-black text-white brutal-border font-medium text-sm italic">
                    "{pattern.predictedQuestion}"
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-bold">숙지 진척도</div>
                    <div className="w-24 h-2 bg-brutal-gray brutal-border overflow-hidden">
                      <div 
                        className="h-full bg-neon-green" 
                        style={{ width: `${pattern.masteryLevel}%` }}
                      />
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-neon-green brutal-border brutal-shadow text-xs font-bold hover:translate-x-1 transition-all">
                    변형 문제 풀기
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 brutal-border bg-purple-50 flex items-center gap-6">
        <div className="flex-1 space-y-2">
          <h4 className="text-xl font-display flex items-center gap-2">
            <CheckCircle2 className="text-purple-600" /> 적중률 리포트 요약
          </h4>
          <p className="text-sm font-medium text-gray-600">
            최근 3개년 기출 변형 패턴 분석 결과, 현재 학습 중인 '운영체제' 단원의 신유형 적중 예상 지수는 <span className="text-purple-600 font-bold">88.5%</span>입니다. 특히 '가상 메모리' 영역의 조건 변형 패턴에 주의하세요.
          </p>
        </div>
        <div className="text-5xl font-display text-purple-600">88.5%</div>
      </div>
    </div>
  );
}
