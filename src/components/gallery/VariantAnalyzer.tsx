import React, { useState } from 'react';
import { Dna, Play, AlertTriangle, CheckCircle2, ArrowRight, BarChart, Zap, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExamQuestion } from '@/services/mappingService';
import { ProblemDNA, VariantProblem, VulnerabilityReport } from '@/types/variant';
import { extractProblemDNA, simulateVariant, mapVulnerability } from '@/services/variantService';

interface Props {
  selectedQuestion: ExamQuestion | null;
}

export default function VariantAnalyzer({ selectedQuestion }: Props) {
  const [dna, setDna] = useState<ProblemDNA | null>(null);
  const [variant, setVariant] = useState<VariantProblem | null>(null);
  const [report, setReport] = useState<VulnerabilityReport | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleExtractDNA = () => {
    if (!selectedQuestion) return;
    const extracted = extractProblemDNA(selectedQuestion);
    setDna(extracted);
    setVariant(null);
    setReport(null);
  };

  const handleSimulate = () => {
    if (!dna) return;
    setIsSimulating(true);
    setTimeout(() => {
      const newVariant = simulateVariant(dna, 1.3);
      setVariant(newVariant);
      setIsSimulating(false);
      
      // Mock report generation
      const mockReport = mapVulnerability([
        { problemId: dna.originalProblemId, userId: 'u1', selectedOption: 'A', isCorrect: false, timeSpent: 45, timestamp: '' },
        { problemId: dna.originalProblemId, userId: 'u1', selectedOption: 'C', isCorrect: false, timeSpent: 60, timestamp: '' },
        { problemId: dna.originalProblemId, userId: 'u1', selectedOption: 'A', isCorrect: false, timeSpent: 55, timestamp: '' }
      ], dna);
      setReport(mockReport);
    }, 1500);
  };

  if (!selectedQuestion) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 brutal-border bg-white brutal-shadow opacity-50">
        <Dna size={64} className="mb-4 text-gray-300" />
        <p className="font-display text-xl">기출 문제를 선택하여 DNA를 추출하세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DNA Extraction Section */}
        <div className="space-y-6">
          <div className="p-6 brutal-border bg-white brutal-shadow space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-display flex items-center gap-2">
                <Dna className="text-neon-pink" /> 기출 DNA 추출
              </h3>
              <button 
                onClick={handleExtractDNA}
                className="px-4 py-2 bg-brutal-black text-white font-bold text-sm brutal-border hover:bg-neon-pink transition-colors"
              >
                DNA 분석 실행
              </button>
            </div>

            {dna ? (
              <div className="space-y-4 animate-in slide-in-from-left-4">
                <div className="p-4 bg-brutal-gray brutal-border">
                  <div className="text-[10px] font-black uppercase text-gray-500 mb-1">핵심 논리 구조 (Logic Steps)</div>
                  <div className="space-y-2">
                    {dna.logicSteps.map(step => (
                      <div key={step.id} className="flex items-center gap-3 text-sm font-bold">
                        <span className="w-6 h-6 rounded-full bg-brutal-black text-white flex items-center justify-center text-[10px]">
                          {step.order}
                        </span>
                        {step.description}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 brutal-border bg-neon-green/10">
                    <div className="text-[10px] font-black uppercase">난이도 계수</div>
                    <div className="text-2xl font-display">{dna.difficultyCoefficient}x</div>
                  </div>
                  <div className="p-3 brutal-border bg-blue-100">
                    <div className="text-[10px] font-black uppercase">파라미터화</div>
                    <div className="text-sm font-bold">{Object.keys(dna.parameters).length}개 변수 식별</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 font-bold border-2 border-dashed border-gray-200">
                분석 대기 중...
              </div>
            )}
          </div>

          {dna && (
            <div className="p-6 brutal-border bg-brutal-black text-white brutal-shadow space-y-4">
              <h3 className="text-xl font-display flex items-center gap-2">
                <Zap className="text-yellow-400" /> 신유형 예측 시뮬레이션
              </h3>
              <p className="text-sm text-gray-400 font-medium">
                추출된 DNA를 기반으로 출제 가능한 변형 패턴을 생성합니다.
              </p>
              <button 
                onClick={handleSimulate}
                disabled={isSimulating}
                className={cn(
                  "w-full py-3 font-display text-xl brutal-border transition-all flex items-center justify-center gap-2",
                  isSimulating ? "bg-gray-700 cursor-not-allowed" : "bg-yellow-400 text-brutal-black hover:bg-white"
                )}
              >
                {isSimulating ? "시뮬레이션 중..." : <><Play size={20} /> 변형 문제 생성</>}
              </button>
            </div>
          )}
        </div>

        {/* Simulation Result & Report */}
        <div className="space-y-6">
          {variant ? (
            <div className="p-6 brutal-border bg-white brutal-shadow space-y-6 animate-in zoom-in-95">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-neon-pink text-white text-xs font-black uppercase">Predicted Variant</span>
                <span className="text-xs font-bold text-gray-400">ID: {variant.id}</span>
              </div>
              <div className="p-6 bg-brutal-gray brutal-border font-bold text-lg leading-relaxed">
                {variant.content}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {variant.options.map((opt, i) => (
                  <div key={i} className="p-3 brutal-border bg-white text-sm font-bold hover:bg-brutal-gray cursor-pointer transition-colors">
                    {i + 1}. {opt}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t-2 border-brutal-black bg-neon-green/5">
                <div className="flex items-center gap-2 text-neon-green font-black text-xs uppercase mb-2">
                  <CheckCircle2 size={14} /> 논리적 정합성 검증 완료
                </div>
                <p className="text-xs font-medium text-gray-600">{variant.explanation}</p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-12 brutal-border bg-white brutal-shadow opacity-50 border-dashed">
              <Play size={48} className="mb-4 text-gray-200" />
              <p className="font-bold text-gray-400">시뮬레이션을 실행하세요.</p>
            </div>
          )}

          {report && (
            <div className="p-6 brutal-border bg-red-50 border-red-500 brutal-shadow space-y-4 animate-in slide-in-from-right-4">
              <h3 className="text-xl font-display flex items-center gap-2 text-red-600">
                <ShieldAlert /> 취약점 진단 리포트
              </h3>
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase">
                  Error Type: {report.errorType}
                </div>
                <div className="text-xs font-bold text-red-600">집중 보완 대상 지정됨</div>
              </div>
              <p className="text-sm font-bold text-gray-800 leading-relaxed">
                {report.feedback}
              </p>
              <div className="pt-4 border-t border-red-200">
                <button className="w-full py-2 bg-white brutal-border border-red-500 text-red-600 font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all">
                  맞춤형 보충 문제 세트 받기 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
