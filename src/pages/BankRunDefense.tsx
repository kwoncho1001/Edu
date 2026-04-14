import { useState, useEffect } from "react";
import { Shield, Zap, Brain, History, AlertCircle, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { KnowledgeCard, ReviewInterval } from "@/types/bankrun";
import IntervalScheduler from "@/components/bankrun/IntervalScheduler";
import RecallCurator from "@/components/bankrun/RecallCurator";

const INITIAL_CARDS: KnowledgeCard[] = [
  {
    id: "c1",
    title: "CAP 이론 (CAP Theorem)",
    content: "분산 시스템에서 일관성(C), 가용성(A), 파티션 허용성(P) 세 가지를 동시에 만족할 수 없다는 이론.",
    tags: ["분산시스템", "CS"],
    createdAt: Date.now() - 86400000 * 2,
    nextReviewAt: Date.now() - 1000, // Due now
    masteryLevel: 45,
    reviewCount: 1
  },
  {
    id: "c2",
    title: "데드락(Deadlock) 4조건",
    content: "상호 배제, 점유 및 대기, 비선점, 환형 대기. 이 네 가지가 모두 충족되어야 데드락이 발생함.",
    tags: ["OS", "운영체제"],
    createdAt: Date.now() - 86400000 * 5,
    nextReviewAt: Date.now() + 86400000, // Due tomorrow
    masteryLevel: 72,
    reviewCount: 3
  }
];

export default function BankRunDefense() {
  const [cards, setCards] = useState<KnowledgeCard[]>(INITIAL_CARDS);
  const [viewMode, setViewMode] = useState<'scheduler' | 'recall'>('scheduler');

  const handleAddCard = (newCard: Omit<KnowledgeCard, "id" | "createdAt" | "nextReviewAt" | "masteryLevel" | "reviewCount">) => {
    const card: KnowledgeCard = {
      ...newCard,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      nextReviewAt: Date.now() + 86400000, // First review in 24h
      masteryLevel: 0,
      reviewCount: 0
    };
    setCards(prev => [card, ...prev]);
  };

  const handleReviewComplete = (cardId: string, isSuccess: boolean) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId) {
        const nextInterval: ReviewInterval = isSuccess 
          ? (card.reviewCount === 0 ? 3 : card.reviewCount === 1 ? 7 : card.reviewCount === 2 ? 14 : 30)
          : 1;
        
        return {
          ...card,
          lastReviewedAt: Date.now(),
          nextReviewAt: Date.now() + 86400000 * nextInterval,
          masteryLevel: isSuccess ? Math.min(100, card.masteryLevel + 15) : Math.max(0, card.masteryLevel - 10),
          reviewCount: isSuccess ? card.reviewCount + 1 : 0
        };
      }
      return card;
    }));
  };

  const dueCount = cards.filter(c => c.nextReviewAt <= Date.now()).length;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 brutal-border bg-brutal-black text-neon-green">
            <Shield size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-brutal-black">지식 뱅크런 방어</h1>
        </div>
        <p className="text-xl font-medium max-w-2xl leading-relaxed">
          공부한 지식이 휘발되지 않게 고정하라. <br/>
          <span className="text-neon-pink font-black uppercase text-2xl">망각 곡선을 역이용하여 인출력을 최대화하라.</span>
        </p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 brutal-border bg-white brutal-shadow">
          <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Recall Rate</div>
          <div className="text-4xl font-display">92%</div>
          <div className="mt-2 text-[10px] font-bold text-neon-green uppercase">Safe Zone</div>
        </div>
        <div className="p-6 brutal-border bg-white brutal-shadow">
          <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Anchors</div>
          <div className="text-4xl font-display">{cards.length}</div>
          <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase">Knowledge Units</div>
        </div>
        <div className="p-6 brutal-border bg-brutal-black text-white brutal-shadow">
          <div className="text-[10px] font-black uppercase text-neon-green mb-1">Due for Recall</div>
          <div className="text-4xl font-display text-neon-pink">{dueCount}</div>
          <div className="mt-2 text-[10px] font-bold text-neon-pink uppercase animate-pulse">Action Required</div>
        </div>
        <div className="p-6 brutal-border bg-white brutal-shadow">
          <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Retention Period</div>
          <div className="text-4xl font-display">18.5d</div>
          <div className="mt-2 text-[10px] font-bold text-neon-green uppercase">Avg. Life</div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex gap-4">
        <button 
          onClick={() => setViewMode('scheduler')}
          className={cn(
            "flex-1 py-4 brutal-border brutal-shadow font-display text-xl flex items-center justify-center gap-2 transition-all",
            viewMode === 'scheduler' ? "bg-brutal-black text-white -translate-y-1" : "bg-white text-brutal-black hover:bg-brutal-gray"
          )}
        >
          <Clock size={24} /> 인터벌 스케줄러
        </button>
        <button 
          onClick={() => setViewMode('recall')}
          className={cn(
            "flex-1 py-4 brutal-border brutal-shadow font-display text-xl flex items-center justify-center gap-2 transition-all relative",
            viewMode === 'recall' ? "bg-brutal-black text-white -translate-y-1" : "bg-white text-brutal-black hover:bg-brutal-gray"
          )}
        >
          <Brain size={24} /> 지식 소환 큐레이터
          {dueCount > 0 && (
            <span className="absolute -top-2 -right-2 w-8 h-8 bg-neon-pink text-white brutal-border flex items-center justify-center text-xs font-black">
              {dueCount}
            </span>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {viewMode === 'scheduler' ? (
          <IntervalScheduler cards={cards} onAddCard={handleAddCard} />
        ) : (
          <RecallCurator cards={cards} onReviewComplete={handleReviewComplete} />
        )}
      </div>

      {/* Footer Info */}
      <footer className="p-8 brutal-border bg-brutal-gray flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 brutal-border bg-white flex items-center justify-center text-3xl">
            📉
          </div>
          <div>
            <h4 className="text-xl font-display">망각 방어 리포트</h4>
            <p className="text-sm font-medium text-gray-500">최근 7일간 지식 뱅크런 발생 확률 4.2% 감소</p>
          </div>
        </div>
        <button className="px-8 py-4 bg-white brutal-border brutal-shadow font-display text-lg flex items-center gap-2 hover:bg-brutal-black hover:text-white transition-all">
          <BarChart3 size={20} /> 상세 분석 데이터 보기
        </button>
      </footer>
    </div>
  );
}
