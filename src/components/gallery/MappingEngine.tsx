import React, { useState, useMemo } from 'react';
import { ConceptPost } from '@/types/gallery';
import { ExamQuestion, calculateStudyPriority, generateKnowledgeGraph } from '@/services/mappingService';
import { Search, Target, Network, ArrowRight, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  concepts: ConceptPost[];
  questions: ExamQuestion[];
  onRedirectToConcept: (conceptId: string) => void;
}

export default function MappingEngine({ concepts, questions, onRedirectToConcept }: Props) {
  const [activeTab, setActiveTab] = useState<'priority' | 'graph' | 'practice'>('priority');
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(concepts[0]?.id || null);

  // Mock User Data
  const userData = {
    userId: 'user-1',
    conceptMastery: { 'p1': 0.4, 'p2': 0.9 },
    wrongHistory: ['q1', 'q3']
  };

  const priorities = useMemo(() => calculateStudyPriority(concepts, questions, userData), [concepts, questions]);
  
  const graphData = useMemo(() => {
    if (!selectedConceptId) return null;
    return generateKnowledgeGraph(selectedConceptId, concepts, []); // Mappings would come from DB
  }, [selectedConceptId, concepts]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-display uppercase tracking-tighter">개념-기출 매핑 엔진</h2>
          <p className="text-sm font-medium text-gray-500">개념의 원리가 문제에서 어떻게 발현되는지 추적합니다.</p>
        </div>
        
        <div className="flex bg-white brutal-border p-1">
          {[
            { id: 'priority', icon: Target, label: '학습 우선순위' },
            { id: 'graph', icon: Network, label: '지식 그래프' },
            { id: 'practice', icon: BookOpen, label: '실전 매핑' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 font-bold text-sm transition-all",
                activeTab === tab.id ? "bg-brutal-black text-white" : "hover:bg-brutal-gray"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-[500px]">
        {activeTab === 'priority' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-display flex items-center gap-2">
                <Target className="text-neon-pink" /> TOP 5 핵심 공략 지점
              </h3>
              <div className="space-y-3">
                {priorities.map((p, idx) => (
                  <div key={p.id} className="p-4 brutal-border bg-white brutal-shadow hover:-translate-y-1 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-black text-neon-pink uppercase">Rank #{idx + 1}</span>
                      <span className="text-[10px] font-bold bg-brutal-gray px-2 py-0.5 brutal-border">{p.difficulty}</span>
                    </div>
                    <h4 className="text-lg font-bold mb-1">{p.title}</h4>
                    <p className="text-xs text-gray-500 font-medium mb-4">{p.reason}</p>
                    <button 
                      onClick={() => onRedirectToConcept(p.id)}
                      className="w-full py-2 bg-neon-green brutal-border font-black text-xs uppercase flex items-center justify-center gap-2 group-hover:bg-brutal-black group-hover:text-white transition-colors"
                    >
                      개념 재학습 가기 <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 brutal-border bg-brutal-black text-white flex flex-col justify-center items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full border-4 border-neon-green flex items-center justify-center animate-pulse">
                <span className="text-3xl font-display">82%</span>
              </div>
              <div>
                <p className="text-xl font-display text-neon-green">분석 완료</p>
                <p className="text-sm text-gray-400 mt-2">
                  최근 5개년 기출 데이터와 귀하의 오답 패턴을 분석한 결과,<br/> 
                  <span className="text-white font-bold">운영체제 스케줄링</span> 파트의 매핑 강도가 가장 낮습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="p-8 brutal-border bg-white brutal-shadow space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display">개념 확장 경로 시각화</h3>
              <select 
                value={selectedConceptId || ''} 
                onChange={(e) => setSelectedConceptId(e.target.value)}
                className="p-2 brutal-border font-bold text-sm"
              >
                {concepts.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            
            <div className="h-[400px] brutal-border bg-brutal-gray relative overflow-hidden flex items-center justify-center">
              {/* Simplified Graph Visualization */}
              <div className="relative w-full h-full p-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-neon-pink brutal-border flex items-center justify-center text-white font-bold text-center p-2 z-10">
                  {concepts.find(c => c.id === selectedConceptId)?.title}
                </div>
                
                {/* Mock Nodes */}
                {[1, 2, 3, 4].map(i => (
                  <div 
                    key={i}
                    className={cn(
                      "absolute w-24 h-24 bg-white brutal-border flex flex-col items-center justify-center p-2 text-[10px] font-black",
                      i === 1 && "top-10 left-10",
                      i === 2 && "top-10 right-10",
                      i === 3 && "bottom-10 left-10",
                      i === 4 && "bottom-10 right-10"
                    )}
                  >
                    <div className="text-neon-pink mb-1">Q{i}</div>
                    <div className="truncate w-full text-center">기출 문항 {i}</div>
                    <div className="mt-1 text-[8px] text-gray-400">유사도 0.88</div>
                  </div>
                ))}

                {/* SVG Lines for connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="black" strokeWidth="2" strokeDasharray="4" />
                  <line x1="50%" y1="50%" x2="85%" y2="15%" stroke="black" strokeWidth="2" strokeDasharray="4" />
                  <line x1="50%" y1="50%" x2="15%" y2="85%" stroke="black" strokeWidth="2" strokeDasharray="4" />
                  <line x1="50%" y1="50%" x2="85%" y2="85%" stroke="black" strokeWidth="2" strokeDasharray="4" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {questions.slice(0, 3).map(q => (
                <div key={q.id} className="p-6 brutal-border bg-white brutal-shadow space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 bg-brutal-black text-white text-[10px] font-black uppercase">Question</span>
                    {userData.wrongHistory.includes(q.id) ? (
                      <AlertCircle className="text-neon-pink" size={20} />
                    ) : (
                      <CheckCircle2 className="text-neon-green" size={20} />
                    )}
                  </div>
                  <p className="font-bold text-sm line-clamp-3">{q.content}</p>
                  <div className="pt-4 border-t-2 border-brutal-black space-y-2">
                    <div className="text-[10px] font-black text-gray-400 uppercase">매핑된 핵심 개념</div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{concepts.find(c => c.id === q.conceptId)?.title}</span>
                      <button 
                        onClick={() => onRedirectToConcept(q.conceptId)}
                        className="text-[10px] font-black text-neon-pink hover:underline"
                      >
                        개념보기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
