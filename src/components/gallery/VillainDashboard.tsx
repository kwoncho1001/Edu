import React, { useMemo } from 'react';
import { 
  Skull, 
  Brain, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  ChevronRight,
  BookOpen,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LearningLog, MetacognitiveReport } from '@/types/metacognition';
import { Villain, KnowledgeGraphData } from '@/types/villain';
import { 
  identifyVillainsFromLogs, 
  mapToKnowledgeGraph, 
  generateMetacognitionReport 
} from '@/services/villainAnalysisService';
import VulnerabilityRadar from './VulnerabilityRadar';
import KnowledgeGraph from './KnowledgeGraph';
import { motion } from 'framer-motion';

interface Props {
  logs: LearningLog[];
  onStartMission: (villainId: string) => void;
}

export default function VillainDashboard({ logs, onStartMission }: Props) {
  const villains = useMemo(() => identifyVillainsFromLogs(logs), [logs]);
  const graphData = useMemo(() => mapToKnowledgeGraph(logs, villains), [logs, villains]);
  const report = useMemo(() => generateMetacognitionReport(logs), [logs]);

  const radarData = useMemo(() => {
    const subjects = Array.from(new Set(logs.map(l => l.subject)));
    return subjects.map(subject => {
      const subjectLogs = logs.filter(l => l.subject === subject);
      const accuracy = subjectLogs.filter(l => l.isCorrect).length / subjectLogs.length;
      return {
        subject,
        A: Math.floor(accuracy * 100),
        fullMark: 100
      };
    });
  }, [logs]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brutal-black text-white brutal-border">
            <Brain size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-display uppercase">메타인지 & 빌런 대시보드</h2>
            <p className="text-sm font-bold text-gray-500 uppercase">데이터로 분석한 당신의 학습 실체</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 brutal-border bg-white brutal-shadow-sm">
            <div className="text-[10px] font-black uppercase text-gray-400">MCI Index</div>
            <div className="text-2xl font-display text-neon-pink">{Math.floor(report.mci * 100)}%</div>
          </div>
          <div className="px-4 py-2 brutal-border bg-white brutal-shadow-sm">
            <div className="text-[10px] font-black uppercase text-gray-400">Vulnerability</div>
            <div className="text-2xl font-display text-yellow-400">{Math.floor(report.vulnerabilityScore)}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Analysis & Radar */}
        <div className="lg:col-span-1 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xl font-display flex items-center gap-2">
              <Target className="text-neon-pink" size={20} /> 취약점 레이더
            </h3>
            <VulnerabilityRadar data={radarData} />
          </section>

          <section className="p-6 brutal-border bg-brutal-black text-white brutal-shadow space-y-4">
            <h3 className="text-xl font-display flex items-center gap-2 text-neon-green">
              <Zap size={20} /> 메타인지 진단 리포트
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-900 border border-gray-700">
                <div className="text-[10px] font-black uppercase text-gray-500 mb-1">상태 요약</div>
                <p className="text-sm font-medium">
                  {report.mci > 0.7 ? "자신의 실력을 매우 객관적으로 파악하고 있습니다." : "주관적 자신감과 실제 성취도 사이에 괴리가 발견되었습니다."}
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase text-gray-500">개선 전략</div>
                {report.improvementStrategies.map((s, i) => (
                  <div key={i} className="flex gap-2 text-xs font-bold">
                    <div className="w-1 h-1 rounded-full bg-neon-green mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Center Column: Knowledge Graph */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-xl font-display flex items-center gap-2">
                <BookOpen className="text-blue-500" size={20} /> 지식 구조 & 빌런 매핑
              </h3>
              <div className="flex gap-4 text-[10px] font-black uppercase">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#3A86FF]" /> Mastered</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#FFBE0B]" /> Vulnerable</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#FF006E]" /> Villain</div>
              </div>
            </div>
            <KnowledgeGraph data={graphData} />
          </section>

          {/* Villain Encyclopedia (Dogam) */}
          <section className="space-y-4">
            <h3 className="text-xl font-display flex items-center gap-2">
              <Skull className="text-red-600" size={20} /> 식별된 빌런 도감
            </h3>
            {villains.length === 0 ? (
              <div className="p-12 brutal-border bg-brutal-gray text-center">
                <p className="font-display text-2xl text-gray-400">식별된 빌런이 없습니다. <br/> 데이터 수집을 위해 더 많은 문제를 풀어보세요!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {villains.map((v) => (
                  <motion.div
                    key={v.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 brutal-border bg-white brutal-shadow flex gap-4 items-center group"
                  >
                    <div className="w-16 h-16 brutal-border bg-brutal-gray flex items-center justify-center text-3xl">
                      {v.type === 'CONCEPT_CONFUSION' ? '👹' : '👻'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-display text-lg">{v.name}</h4>
                        <span className={cn(
                          "px-2 py-0.5 text-[8px] font-black uppercase brutal-border",
                          v.riskLevel === 'CRITICAL' ? "bg-red-600 text-white" : "bg-yellow-400"
                        )}>
                          {v.riskLevel}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 mb-2">{v.description}</p>
                      <button
                        onClick={() => onStartMission(v.id)}
                        className="w-full py-2 bg-neon-green text-brutal-black brutal-border brutal-shadow-sm font-black text-[10px] uppercase hover:bg-brutal-black hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        소탕 미션 시작 <ChevronRight size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
