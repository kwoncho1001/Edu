import React, { useState, useMemo } from 'react';
import { Database, Filter, Search, Target, Network, ArrowRight, BookOpen, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExamQuestion, ConceptNode, deriveCustomizedProblems, autoTagConcept } from '@/services/mappingService';

interface Props {
  questions: ExamQuestion[];
  concepts: ConceptNode[];
  onSelectQuestion: (q: ExamQuestion) => void;
}

export default function ExamDatabaseManager({ questions, concepts, onSelectQuestion }: Props) {
  const [filterTag, setFilterTag] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'recommend' | 'graph'>('list');

  // Mock User Logs
  const studyLogs = [
    { userId: 'u1', problemId: 'q1', isCorrect: false, timestamp: '', timeSpent: 30 },
    { userId: 'u1', problemId: 'q1', isCorrect: false, timestamp: '', timeSpent: 45 },
    { userId: 'u1', problemId: 'q2', isCorrect: true, timestamp: '', timeSpent: 20 },
  ];

  const recommendations = useMemo(() => {
    return deriveCustomizedProblems('u1', questions, studyLogs, ['OS', 'Process']);
  }, [questions]);

  const filteredQuestions = questions.filter(q => {
    const matchesTag = filterTag === 'All' || q.tags.includes(filterTag);
    const matchesSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const allTags = Array.from(new Set(questions.flatMap(q => q.tags)));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-display uppercase tracking-tighter">지능형 기출 DB 매니저</h2>
          <p className="text-sm font-medium text-gray-500">방대한 기출 데이터를 개념과 연결하여 체계적으로 관리합니다.</p>
        </div>
        
        <div className="flex bg-white brutal-border p-1">
          {[
            { id: 'list', icon: Database, label: '기출 목록' },
            { id: 'recommend', icon: Target, label: '맞춤 추천' },
            { id: 'graph', icon: Network, label: '지식 그래프' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 font-bold text-sm transition-all",
                viewMode === tab.id ? "bg-brutal-black text-white" : "hover:bg-brutal-gray"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-[600px]">
        {viewMode === 'list' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between p-4 brutal-border bg-white">
              <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="문제 내용 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 brutal-border font-bold"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-gray-400" />
                  <select 
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="p-2 brutal-border font-bold text-sm"
                  >
                    <option value="All">전체 태그</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="text-xs font-black uppercase text-gray-400">
                Total: {filteredQuestions.length} Questions
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredQuestions.map(q => (
                <div 
                  key={q.id} 
                  onClick={() => onSelectQuestion(q)}
                  className="p-6 brutal-border bg-white brutal-shadow hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      {q.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-brutal-gray brutal-border text-[10px] font-black uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-black text-neon-pink">{q.difficulty}</span>
                  </div>
                  <p className="font-bold text-sm line-clamp-3 mb-4 group-hover:text-neon-pink transition-colors">
                    {q.content}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400">
                      <BookOpen size={12} />
                      {concepts.find(c => c.id === q.conceptId)?.title || '미분류 개념'}
                    </div>
                    <div className="text-[10px] font-black text-gray-400">
                      {q.year}년 출제
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'recommend' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-display flex items-center gap-2">
                <Target className="text-neon-pink" /> 취약점 기반 맞춤 추천
              </h3>
              <div className="space-y-4">
                {recommendations.recommendedIds.map((id, idx) => {
                  const q = questions.find(question => question.id === id);
                  if (!q) return null;
                  return (
                    <div key={id} className="p-6 brutal-border bg-white brutal-shadow space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="px-3 py-1 bg-neon-pink text-white text-[10px] font-black uppercase">
                          Recommendation #{idx + 1}
                        </div>
                        <span className="text-xs font-bold text-neon-pink">{q.difficulty}</span>
                      </div>
                      <p className="font-bold text-sm">{q.content}</p>
                      <div className="p-3 bg-red-50 brutal-border border-red-200 flex items-start gap-3">
                        <AlertCircle className="text-red-500 mt-0.5" size={16} />
                        <p className="text-xs font-bold text-red-600">{recommendations.reasons[idx]}</p>
                      </div>
                      <button 
                        onClick={() => onSelectQuestion(q)}
                        className="w-full py-2 bg-brutal-black text-white brutal-border font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-neon-pink transition-colors"
                      >
                        문제 풀러 가기 <ArrowRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-8 brutal-border bg-brutal-black text-white space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-neon-green brutal-border">
                    <Target className="text-brutal-black" size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-display text-neon-green">학습 분석 리포트</h4>
                    <p className="text-sm text-gray-400">귀하의 최근 7일간 학습 데이터를 분석했습니다.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 brutal-border border-white/20 bg-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase">OS 스케줄링 숙련도</span>
                      <span className="text-xs font-black text-neon-pink">32%</span>
                    </div>
                    <div className="h-2 bg-white/10 brutal-border border-white/20 overflow-hidden">
                      <div className="h-full bg-neon-pink" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 brutal-border border-white/20 bg-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase">데드락 방지 숙련도</span>
                      <span className="text-xs font-black text-neon-green">88%</span>
                    </div>
                    <div className="h-2 bg-white/10 brutal-border border-white/20 overflow-hidden">
                      <div className="h-full bg-neon-green" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-400 text-brutal-black brutal-border font-bold text-sm">
                  <p>⚠️ 주의: 최근 '메모리 관리' 영역의 학습이 부족합니다. 학습 편향을 방지하기 위해 해당 영역 문제를 20% 비중으로 추천 리스트에 포함했습니다.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'graph' && (
          <div className="p-8 brutal-border bg-white brutal-shadow space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-display flex items-center gap-2">
                <Network className="text-neon-pink" /> 지식 그래프 구조화
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-neon-pink brutal-border"></div>
                  <span className="text-[10px] font-black uppercase">개념 노드</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brutal-black brutal-border"></div>
                  <span className="text-[10px] font-black uppercase">기출 노드</span>
                </div>
              </div>
            </div>

            <div className="h-[500px] brutal-border bg-brutal-gray relative overflow-hidden">
              {/* Simplified Knowledge Graph Visualization */}
              <div className="absolute inset-0 p-10">
                {/* Concept Nodes */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-neon-pink brutal-border flex items-center justify-center text-white font-display text-center p-4 z-10">
                  운영체제 핵심
                </div>
                
                {/* Sub Concepts */}
                <div className="absolute top-20 left-1/4 w-32 h-32 bg-neon-pink/80 brutal-border flex items-center justify-center text-white font-bold text-xs text-center p-2">
                  프로세스 관리
                </div>
                <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-neon-pink/80 brutal-border flex items-center justify-center text-white font-bold text-xs text-center p-2">
                  메모리 관리
                </div>

                {/* Question Nodes */}
                {questions.slice(0, 4).map((q, i) => (
                  <div 
                    key={q.id}
                    className={cn(
                      "absolute w-20 h-20 bg-white brutal-border flex flex-col items-center justify-center p-2 text-[10px] font-black",
                      i === 0 && "top-10 right-10",
                      i === 1 && "bottom-10 left-10",
                      i === 2 && "top-40 right-20",
                      i === 3 && "bottom-40 left-20"
                    )}
                  >
                    <div className="text-neon-pink mb-1">Q{i+1}</div>
                    <div className="truncate w-full text-center">{q.id}</div>
                  </div>
                ))}

                {/* Connection Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="black" strokeWidth="2" strokeDasharray="4" />
                  <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="black" strokeWidth="2" strokeDasharray="4" />
                  <line x1="25%" y1="25%" x2="10%" y2="10%" stroke="gray" strokeWidth="1" strokeDasharray="2" />
                  <line x1="75%" y1="75%" x2="90%" y2="90%" stroke="gray" strokeWidth="1" strokeDasharray="2" />
                </svg>
              </div>
            </div>

            <div className="p-4 bg-brutal-gray brutal-border flex items-center gap-4">
              <Layers className="text-neon-pink" size={24} />
              <p className="text-sm font-bold">
                지식 그래프 분석 결과: <span className="text-neon-pink">'프로세스 관리'</span>와 <span className="text-neon-pink">'메모리 관리'</span> 사이의 연계 문항이 부족합니다. 
                복합 개념 문항을 추가하여 지식의 연결성을 강화하는 것을 추천합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
