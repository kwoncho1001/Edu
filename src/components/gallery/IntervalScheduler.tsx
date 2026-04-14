import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Brain, 
  ArrowRight,
  Plus,
  Tag,
  BarChart3,
  Zap,
  ChevronRight,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  LearningCard, 
  MasteryLevel 
} from '@/types/scheduler';
import { 
  calculateNextInterval, 
  sortCardsByPriority,
  MOCK_CARDS 
} from '@/services/schedulerService';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntervalScheduler() {
  const [cards, setCards] = useState<LearningCard[]>(MOCK_CARDS);
  const [isAdding, setIsAdding] = useState(false);
  const [newCard, setNewCard] = useState({ title: '', content: '', tags: '' });

  const sortedCards = useMemo(() => sortCardsByPriority(cards), [cards]);
  const reviewCount = sortedCards.filter(c => new Date(c.nextReviewAt) <= new Date()).length;

  const handleReview = (cardId: string, feedback: MasteryLevel) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId) {
        const { nextInterval, nextMasteryCount, status } = calculateNextInterval(card.intervalHours, feedback, card.masteryCount);
        const nextDate = new Date();
        nextDate.setHours(nextDate.getHours() + nextInterval);
        
        return {
          ...card,
          lastReviewedAt: new Date().toISOString(),
          nextReviewAt: nextDate.toISOString(),
          intervalHours: nextInterval,
          masteryCount: nextMasteryCount,
          status
        };
      }
      return card;
    }));
  };

  const handleAddCard = () => {
    if (!newCard.title || !newCard.content) return;
    
    const card: LearningCard = {
      id: `c-${Date.now()}`,
      title: newCard.title,
      content: newCard.content,
      tags: newCard.tags.split(',').map(t => t.trim()),
      createdAt: new Date().toISOString(),
      nextReviewAt: new Date(Date.now() + 24 * 3600000).toISOString(),
      intervalHours: 24,
      masteryCount: 0,
      status: 'Learning',
      priority: 0
    };

    setCards(prev => [card, ...prev]);
    setNewCard({ title: '', content: '', tags: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brutal-black text-white brutal-border">
            <Calendar size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-display uppercase">지식 휘발 방지 스케줄러</h2>
            <p className="text-sm font-bold text-gray-500 uppercase">에빙하우스 망각 곡선 기반 자동 복습 관리</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 brutal-border bg-white brutal-shadow-sm flex items-center gap-3">
            <AlertTriangle size={20} className="text-neon-pink" />
            <div>
              <div className="text-[10px] font-black uppercase text-gray-400">Due Today</div>
              <div className="text-xl font-display">{reviewCount} Items</div>
            </div>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="px-6 py-2 bg-neon-green text-brutal-black brutal-border brutal-shadow font-display uppercase flex items-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Plus size={20} /> 지식 추가
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {sortedCards.map((card) => {
              const isDue = new Date(card.nextReviewAt) <= new Date();
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "p-6 brutal-border bg-white brutal-shadow transition-all relative overflow-hidden",
                    isDue ? "border-neon-pink" : "border-brutal-black"
                  )}
                >
                  {isDue && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-neon-pink text-white text-[10px] font-black uppercase">
                      Recall Required
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-display uppercase">{card.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {card.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                            <Tag size={10} /> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase text-gray-400">Interval</div>
                      <div className="text-lg font-display">{card.intervalHours}h</div>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-gray-600 mb-6 leading-relaxed">
                    {card.content}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400">
                        <Clock size={12} /> Next: {new Date(card.nextReviewAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400">
                        <Flame size={12} className="text-neon-pink" /> Mastery: {card.masteryCount}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {(['Hard', 'Normal', 'Easy'] as MasteryLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => handleReview(card.id, level)}
                          className={cn(
                            "px-3 py-1 text-[10px] font-black uppercase brutal-border transition-all",
                            level === 'Easy' ? "bg-neon-green hover:bg-neon-green/80" :
                            level === 'Normal' ? "bg-neon-blue hover:bg-neon-blue/80 text-white" :
                            "bg-neon-pink hover:bg-neon-pink/80 text-white"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <section className="p-6 brutal-border bg-brutal-black text-white brutal-shadow space-y-4">
            <h3 className="text-xl font-display flex items-center gap-2 text-neon-yellow">
              <BarChart3 size={20} /> 학습 통계
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Total Cards</span>
                <span className="text-2xl font-display">{cards.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Mastered</span>
                <span className="text-2xl font-display text-neon-green">
                  {cards.filter(c => c.status === 'Mastered').length}
                </span>
              </div>
            </div>
          </section>

          <section className="p-6 brutal-border bg-neon-blue brutal-shadow space-y-4">
            <h3 className="text-xl font-display flex items-center gap-2">
              <Zap size={20} /> Forgetting Curve Tip
            </h3>
            <p className="text-xs font-bold leading-relaxed">
              망각은 학습 직후 가장 빠르게 일어납니다. 첫 24시간 이내의 복습이 장기 기억 형성의 80%를 결정합니다. 알림을 놓치지 마세요!
            </p>
          </section>

          <section className="p-6 brutal-border bg-white brutal-shadow space-y-4">
            <h3 className="text-xl font-display flex items-center gap-2">
              <Brain size={20} /> 최근 마스터한 지식
            </h3>
            <div className="space-y-2">
              {cards.filter(c => c.status === 'Mastered').slice(0, 3).map(c => (
                <div key={c.id} className="flex items-center gap-2 p-2 bg-gray-50 brutal-border">
                  <CheckCircle2 size={16} className="text-neon-green" />
                  <span className="text-xs font-bold truncate">{c.title}</span>
                </div>
              ))}
              {cards.filter(c => c.status === 'Mastered').length === 0 && (
                <p className="text-xs text-gray-400 font-bold italic text-center py-4">아직 마스터한 지식이 없습니다.</p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brutal-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg p-8 brutal-border bg-white brutal-shadow-lg space-y-6"
            >
              <h3 className="text-2xl font-display uppercase">새로운 지식 등록</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Title</label>
                  <input 
                    type="text" 
                    value={newCard.title}
                    onChange={e => setNewCard(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 brutal-border bg-gray-50 font-bold"
                    placeholder="핵심 개념 명칭"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Content</label>
                  <textarea 
                    value={newCard.content}
                    onChange={e => setNewCard(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full h-32 p-3 brutal-border bg-gray-50 font-bold"
                    placeholder="상세 설명 및 원리"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    value={newCard.tags}
                    onChange={e => setNewCard(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full p-3 brutal-border bg-gray-50 font-bold"
                    placeholder="OS, Memory, CS"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 brutal-border font-display uppercase hover:bg-gray-50 transition-all"
                >
                  취소
                </button>
                <button 
                  onClick={handleAddCard}
                  className="flex-1 py-3 bg-brutal-black text-white brutal-border brutal-shadow font-display uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  저장 및 스케줄링
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
