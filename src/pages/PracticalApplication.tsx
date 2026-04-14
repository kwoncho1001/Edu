import { useState } from "react";
import { Zap, Brain, Target, ShieldCheck, ChevronRight, Activity, MessageSquare, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import ThoughtSimulator from "@/components/application/ThoughtSimulator";
import QuizEngine from "@/components/application/QuizEngine";
import EvaluationCenter from "@/components/application/EvaluationCenter";

type ViewMode = 'simulator' | 'quiz' | 'evaluation';

export default function PracticalApplication() {
  const [viewMode, setViewMode] = useState<ViewMode>('simulator');

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 brutal-border bg-neon-green text-brutal-black">
            <Zap size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-brutal-black">실전 응용 강화</h1>
        </div>
        <p className="text-xl font-medium max-w-2xl leading-relaxed">
          단순 암기를 넘어 사고실험과 심화 퀴즈로 지식을 체화한다. <br/>
          <span className="text-neon-green font-black uppercase">어떤 킬러 문항도 비웃을 수 있는 실전력을 배양하라.</span>
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4">
        {[
          { id: 'simulator', label: '사고실험 시뮬레이터', icon: Activity },
          { id: 'quiz', label: '심화 주관식 퀴즈', icon: MessageSquare },
          { id: 'evaluation', label: '응용 평가 센터', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id as ViewMode)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 brutal-border brutal-shadow font-display text-lg transition-all",
              viewMode === tab.id 
                ? "bg-brutal-black text-white -translate-y-1" 
                : "bg-white text-brutal-black hover:bg-brutal-gray"
            )}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {viewMode === 'simulator' && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-display flex items-center gap-2">
                <Activity className="text-neon-pink" /> 사고실험 시뮬레이터
              </h2>
              <div className="px-3 py-1 bg-neon-green brutal-border text-[10px] font-black uppercase">
                Interactive Scenario Loaded
              </div>
            </div>
            <ThoughtSimulator />
          </section>
        )}

        {viewMode === 'quiz' && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-display flex items-center gap-2">
                <MessageSquare className="text-neon-pink" /> 심화 주관식 퀴즈 엔진
              </h2>
              <div className="px-3 py-1 bg-neon-green brutal-border text-[10px] font-black uppercase">
                AI Evaluation Active
              </div>
            </div>
            <QuizEngine />
          </section>
        )}

        {viewMode === 'evaluation' && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-display flex items-center gap-2">
                <BarChart3 className="text-neon-pink" /> 원리 기반 응용 평가 센터
              </h2>
              <div className="px-3 py-1 bg-neon-green brutal-border text-[10px] font-black uppercase">
                Competency Report Ready
              </div>
            </div>
            <EvaluationCenter />
          </section>
        )}
      </div>

      {/* Footer Stats */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t-4 border-brutal-black">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 brutal-border bg-white flex items-center justify-center font-display text-2xl">
            85
          </div>
          <div className="text-xs font-black uppercase">
            <div className="text-gray-400">Avg. Application Score</div>
            <div className="text-neon-green">+5.2% this session</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 brutal-border bg-white flex items-center justify-center font-display text-2xl">
            12
          </div>
          <div className="text-xs font-black uppercase">
            <div className="text-gray-400">Thought Experiments</div>
            <div className="text-neon-pink">Mastery Level: High</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 brutal-border bg-white flex items-center justify-center font-display text-2xl">
            04
          </div>
          <div className="text-xs font-black uppercase">
            <div className="text-gray-400">Killer Questions Solved</div>
            <div className="text-brutal-black">Keep it up!</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
