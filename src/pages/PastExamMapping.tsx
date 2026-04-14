import { useState } from "react";
import { Target, Database, TrendingUp, Brain, X, CheckCircle2, FileText, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExamQuestion, Concept, Mapping, VariantPattern } from "@/types/exam";
import ExamDatabase from "@/components/exam/ExamDatabase";
import VariantAnalyzer from "@/components/exam/VariantAnalyzer";
import MappingEngine from "@/components/exam/MappingEngine";

const MOCK_CONCEPTS: Concept[] = [
  {
    id: "c1",
    name: "TCP 3-Way Handshake",
    summary: "클라이언트와 서버 간의 신뢰성 있는 연결을 수립하기 위한 3단계 과정.",
    keyPoints: ["SYN", "SYN+ACK", "ACK", "Sequence Number"],
    category: "Network",
    mastery: 75
  },
  {
    id: "c2",
    name: "가상 메모리 (Virtual Memory)",
    summary: "물리적 메모리보다 큰 프로그램을 실행하기 위해 보조 기억 장치를 활용하는 기법.",
    keyPoints: ["Paging", "Segmentation", "Page Fault", "MMU"],
    category: "OS",
    mastery: 45
  }
];

const MOCK_QUESTIONS: ExamQuestion[] = [
  {
    id: "q1",
    text: "TCP 연결 수립 과정에서 서버가 클라이언트의 연결 요청(SYN)을 받고 응답할 때 보내는 플래그는?",
    options: ["ACK", "SYN + ACK", "FIN", "RST"],
    answer: 1,
    explanation: "서버는 클라이언트의 SYN에 대해 자신의 SYN과 클라이언트의 SYN에 대한 ACK를 합쳐서 보낸다.",
    difficulty: "중",
    conceptId: "c1",
    tags: ["TCP", "Handshake", "Network"],
    hitRate: 98,
    failRate: 15
  },
  {
    id: "q2",
    text: "가상 메모리 시스템에서 페이지 부재(Page Fault)가 발생했을 때의 처리 과정으로 옳지 않은 것은?",
    options: [
      "운영체제에 트랩을 발생시킨다.",
      "디스크에서 해당 페이지를 찾는다.",
      "물리 메모리의 빈 프레임을 찾는다.",
      "CPU 캐시를 즉시 초기화한다."
    ],
    answer: 3,
    explanation: "페이지 부재 시 CPU 캐시를 초기화할 필요는 없다. 메모리 적재와 페이지 테이블 업데이트가 핵심이다.",
    difficulty: "상",
    conceptId: "c2",
    tags: ["OS", "Virtual Memory", "Page Fault"],
    hitRate: 85,
    failRate: 45
  }
];

const MOCK_MAPPINGS: Mapping[] = [
  { id: "m1", conceptId: "c1", questionId: "q1", weight: 95, frequency: 12 },
  { id: "m2", conceptId: "c2", questionId: "q2", weight: 88, frequency: 8 }
];

const MOCK_PATTERNS: VariantPattern[] = [
  {
    id: "v1",
    conceptId: "c1",
    title: "4-Way Handshake 융합형",
    description: "연결 수립(3-Way)과 해제(4-Way) 과정을 비교하거나, 중간에 패킷이 유실된 상황을 가정하여 응답 플래그를 묻는 변형.",
    logic: "개념 융합 및 예외 상황 설정",
    predictedQuestion: "클라이언트가 FIN을 보냈으나 서버의 ACK가 유실된 경우, 재전송 타이머 만료 후 클라이언트의 동작은?",
    masteryLevel: 30
  },
  {
    id: "v2",
    conceptId: "c2",
    title: "페이지 교체 알고리즘 조건 변형",
    description: "단순히 알고리즘의 정의를 묻는 것이 아니라, 특정 참조 스트링을 주고 LRU와 FIFO의 페이지 부재 횟수 차이를 계산하게 함.",
    logic: "수치 계산 및 조건 변경",
    predictedQuestion: "프레임이 3개인 시스템에서 참조 스트링 [1, 2, 3, 4, 1, 2, 5] 적용 시 LRU의 페이지 부재 횟수는?",
    masteryLevel: 65
  }
];

type ViewMode = 'database' | 'mapping' | 'variant';

export default function PastExamMapping() {
  const [viewMode, setViewMode] = useState<ViewMode>('mapping');
  const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestion | null>(null);
  const [selectedMapping, setSelectedMapping] = useState<Mapping | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-display mb-4 text-purple-500">기출 학살</h1>
          <p className="text-xl font-medium max-w-3xl">
            강의 자료와 기출을 1:1로 강제 매핑한다. 출제자의 의도를 꿰뚫어라.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('mapping')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'mapping' ? "bg-purple-500 text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Target size={18} /> 1:1 매핑 엔진
          </button>
          <button 
            onClick={() => setViewMode('database')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'database' ? "bg-brutal-black text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Database size={18} /> 기출 DB
          </button>
          <button 
            onClick={() => setViewMode('variant')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'variant' ? "bg-neon-pink text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <TrendingUp size={18} /> 신유형 분석
          </button>
        </div>
      </header>

      <div className="min-h-[600px]">
        {viewMode === 'mapping' && (
          <MappingEngine 
            questions={MOCK_QUESTIONS} 
            concepts={MOCK_CONCEPTS} 
            mappings={MOCK_MAPPINGS}
            onSelectMapping={(m) => setSelectedMapping(m)}
          />
        )}
        
        {viewMode === 'database' && (
          <ExamDatabase 
            questions={MOCK_QUESTIONS} 
            concepts={MOCK_CONCEPTS}
            onSelectQuestion={(q) => setSelectedQuestion(q)}
          />
        )}

        {viewMode === 'variant' && (
          <VariantAnalyzer 
            patterns={MOCK_PATTERNS} 
            concepts={MOCK_CONCEPTS}
          />
        )}
      </div>

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brutal-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white brutal-border brutal-shadow max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 p-4 bg-brutal-gray border-b-3 border-brutal-black flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-purple-500 text-white brutal-border text-xs font-bold uppercase">
                  난이도 {selectedQuestion.difficulty}
                </span>
                <h2 className="text-2xl font-display">기출 문항 상세</h2>
              </div>
              <button onClick={() => setSelectedQuestion(null)} className="p-2 hover:bg-white brutal-border">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <p className="text-xl font-bold leading-relaxed">{selectedQuestion.text}</p>
                <div className="space-y-2">
                  {selectedQuestion.options.map((opt, i) => (
                    <div key={i} className={cn(
                      "p-3 brutal-border font-medium",
                      i === selectedQuestion.answer ? "bg-neon-green" : "bg-white"
                    )}>
                      {i + 1}. {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-purple-50 brutal-border border-purple-200">
                <h4 className="font-bold mb-2 flex items-center gap-2 text-purple-700">
                  <CheckCircle2 size={18} /> 정답 해설
                </h4>
                <p className="text-sm">{selectedQuestion.explanation}</p>
              </div>

              <div className="pt-6 border-t-3 border-brutal-black flex justify-end">
                <button 
                  onClick={() => setSelectedQuestion(null)}
                  className="px-8 py-3 bg-brutal-black text-white font-display text-xl brutal-border brutal-shadow"
                >
                  확인 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mapping Detail Modal */}
      {selectedMapping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brutal-black/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-white brutal-border brutal-shadow">
            <div className="p-4 bg-purple-500 text-white border-b-3 border-brutal-black flex justify-between items-center">
              <h2 className="text-2xl font-display">1:1 매핑 상세 분석</h2>
              <button onClick={() => setSelectedMapping(null)} className="p-2 hover:bg-white/20 brutal-border border-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="flex-1 p-6 brutal-border bg-brutal-gray text-center">
                  <div className="text-xs font-black uppercase text-gray-500 mb-2">핵심 개념</div>
                  <div className="text-2xl font-bold">{MOCK_CONCEPTS.find(c => c.id === selectedMapping.conceptId)?.name}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LinkIcon size={48} className="text-purple-500 animate-pulse" />
                  <div className="text-sm font-black uppercase">매핑 강도 {selectedMapping.weight}%</div>
                </div>
                <div className="flex-1 p-6 brutal-border bg-purple-50 text-center border-purple-500">
                  <div className="text-xs font-black uppercase text-purple-500 mb-2">기출 문항</div>
                  <div className="text-lg font-bold line-clamp-2">{MOCK_QUESTIONS.find(q => q.id === selectedMapping.questionId)?.text}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-display">학살 포인트</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 brutal-border bg-white">
                    <div className="font-bold mb-2">출제자의 의도</div>
                    <p className="text-sm text-gray-600">이 개념의 핵심인 '동기화 과정'을 정확히 이해하고 있는지 묻는 전형적인 메커니즘 확인 문제입니다.</p>
                  </div>
                  <div className="p-4 brutal-border bg-white">
                    <div className="font-bold mb-2">오답 방지 팁</div>
                    <p className="text-sm text-gray-600">SYN과 ACK가 동시에 전송되는 2단계(SYN+ACK)를 단일 플래그와 혼동하지 마세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => setSelectedMapping(null)}
                  className="px-12 py-4 bg-purple-500 text-white font-display text-2xl brutal-border brutal-shadow hover:translate-y-1 transition-transform"
                >
                  분석 완료 및 학살 시작
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
