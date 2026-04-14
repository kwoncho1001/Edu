import React, { useState } from "react";
import { Calendar, Plus, Clock, Tag, ChevronRight, Zap } from "lucide-react";
import { KnowledgeCard, ReviewInterval } from "@/types/bankrun";
import { cn } from "@/lib/utils";

interface Props {
  cards: KnowledgeCard[];
  onAddCard: (card: Omit<KnowledgeCard, "id" | "createdAt" | "nextReviewAt" | "masteryLevel" | "reviewCount">) => void;
}

export default function IntervalScheduler({ cards, onAddCard }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    onAddCard({
      title: newTitle,
      content: newContent,
      tags: newTags.split(",").map(t => t.trim()).filter(t => t)
    });
    setNewTitle("");
    setNewContent("");
    setNewTags("");
    setIsAdding(false);
  };

  const upcomingReviews = cards
    .filter(c => c.nextReviewAt > Date.now())
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Add Knowledge Section */}
      <div className="p-6 brutal-border bg-white brutal-shadow">
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-brutal-black hover:bg-brutal-gray transition-colors flex items-center justify-center gap-2 font-display text-xl"
          >
            <Plus size={24} /> 새로운 지식 앵커링 (Add Knowledge)
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <input 
              autoFocus
              className="w-full p-4 brutal-border bg-brutal-gray font-bold text-lg focus:bg-white outline-none"
              placeholder="핵심 개념 타이틀"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea 
              className="w-full h-32 p-4 brutal-border bg-brutal-gray font-medium focus:bg-white outline-none resize-none"
              placeholder="휘발되기 쉬운 핵심 내용을 요약하라..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div className="flex gap-4">
              <input 
                className="flex-1 p-3 brutal-border bg-brutal-gray text-sm focus:bg-white outline-none"
                placeholder="태그 (쉼표로 구분)"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
              />
              <button 
                type="submit"
                className="px-8 py-3 bg-brutal-black text-white brutal-border brutal-shadow font-display text-lg hover:bg-neon-pink transition-all"
              >
                저장
              </button>
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-8 py-3 brutal-border bg-white hover:bg-brutal-gray transition-colors font-display text-lg"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Upcoming Schedule */}
      <div className="space-y-4">
        <h3 className="text-2xl font-display flex items-center gap-2">
          <Calendar className="text-neon-pink" /> 지식 소환 스케줄 (Upcoming)
        </h3>
        <div className="space-y-3">
          {upcomingReviews.length === 0 && (
            <div className="p-8 brutal-border bg-brutal-gray text-center text-gray-400 italic">
              예정된 복습 일정이 없습니다. 새로운 지식을 추가하세요.
            </div>
          )}
          {upcomingReviews.map(card => (
            <div key={card.id} className="p-4 brutal-border bg-white brutal-shadow flex items-center justify-between group hover:bg-brutal-gray transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 brutal-border bg-brutal-black text-neon-green flex flex-col items-center justify-center text-[10px] font-black leading-none">
                  <Clock size={14} />
                  <span className="mt-1">D-{Math.ceil((card.nextReviewAt - Date.now()) / (1000 * 60 * 60 * 24))}</span>
                </div>
                <div>
                  <div className="font-bold text-lg group-hover:text-neon-pink transition-colors">{card.title}</div>
                  <div className="flex gap-2 mt-1">
                    {card.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-gray-400 flex items-center gap-0.5">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-gray-400">Mastery</div>
                  <div className="font-display text-xl">{card.masteryLevel}%</div>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-brutal-black group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spaced Repetition Logic Info */}
      <div className="p-6 brutal-border bg-brutal-black text-white brutal-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap size={80} />
        </div>
        <h4 className="text-neon-green font-display text-xl mb-2">Ebbinghaus Algorithm Active</h4>
        <p className="text-sm font-medium opacity-80 leading-relaxed">
          시스템이 당신의 망각 곡선을 추적 중입니다. <br/>
          <span className="text-neon-pink font-bold">24시간, 3일, 7일</span> 주기로 지식을 강제 소환하여 장기 기억으로 고정합니다.
        </p>
      </div>
    </div>
  );
}
