import { Target, Link as LinkIcon, FileText, ArrowRight, Brain } from "lucide-react";
import { ExamQuestion, Concept, Mapping } from "@/types/exam";
import { cn } from "@/lib/utils";

interface Props {
  questions: ExamQuestion[];
  concepts: Concept[];
  mappings: Mapping[];
  onSelectMapping: (m: Mapping) => void;
}

export default function MappingEngine({ questions, concepts, mappings, onSelectMapping }: Props) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-display flex items-center gap-2">
          <Target className="text-purple-500" /> 개념-기출 1:1 매핑 엔진
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 brutal-border text-xs font-bold">
          <Brain size={14} /> 역방향 학습 알고리즘 가동 중
        </div>
      </div>

      <div className="space-y-6">
        {mappings.map((mapping) => {
          const concept = concepts.find(c => c.id === mapping.conceptId);
          const question = questions.find(q => q.id === mapping.questionId);

          if (!concept || !question) return null;

          return (
            <div 
              key={mapping.id} 
              className="brutal-border bg-white p-6 md:p-8 relative group cursor-pointer hover:bg-purple-50 transition-colors"
              onClick={() => onSelectMapping(mapping)}
            >
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-2 font-display text-2xl brutal-border border-t-0 border-r-0">
                매핑 강도 {mapping.weight}%
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                {/* Concept Side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brutal-black text-white flex items-center justify-center font-display text-sm">
                      C
                    </div>
                    <h4 className="text-xl font-bold">{concept.name}</h4>
                  </div>
                  <div className="p-4 bg-brutal-gray brutal-border text-sm font-medium leading-relaxed">
                    {concept.summary}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {concept.keyPoints.slice(0, 2).map(kp => (
                      <span key={kp} className="px-2 py-0.5 bg-white brutal-border text-[10px] font-bold">
                        #{kp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Connection Icon */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full brutal-border group-hover:scale-110 transition-transform">
                  <LinkIcon size={24} className="text-purple-500" />
                </div>

                {/* Question Side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-display text-sm">
                      Q
                    </div>
                    <h4 className="text-xl font-bold">기출 문항 적용</h4>
                  </div>
                  <div className="p-4 border-4 border-purple-500 bg-purple-50 text-sm font-bold italic">
                    {question.text.slice(0, 100)}...
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-purple-600">출제 빈도: {mapping.frequency}회</span>
                    <div className="flex items-center gap-1 text-xs font-black uppercase text-purple-500">
                      View Full Mapping <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 brutal-border bg-brutal-black text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <h4 className="text-2xl font-display text-neon-green">학습 효율 최적화 완료</h4>
            <p className="text-sm font-medium text-gray-400">
              현재 갤러리의 모든 개념이 최소 3개 이상의 기출 문항과 1:1 매핑되었습니다.
            </p>
          </div>
          <button className="px-8 py-4 bg-neon-green text-brutal-black font-display text-xl brutal-border brutal-shadow hover:translate-y-1 transition-transform">
            실전 학살 모드 진입
          </button>
        </div>
      </div>
    </div>
  );
}
