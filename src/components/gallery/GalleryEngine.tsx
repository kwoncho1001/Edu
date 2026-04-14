import { useState } from "react";
import { LayoutGrid, List, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Gallery, ConceptPost } from "@/types/gallery";
import { cn } from "@/lib/utils";

interface Props {
  gallery: Gallery;
  onPostClick: (post: ConceptPost) => void;
}

export default function GalleryEngine({ gallery, onPostClick }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const posts = gallery.posts || [];
  const completedCount = posts.filter(p => p.isCompleted).length;
  const progressPercent = posts.length > 0 
    ? Math.round((completedCount / posts.length) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="p-6 brutal-border bg-white brutal-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{gallery.domain}</div>
          <h2 className="text-4xl font-display">{gallery.title}</h2>
          <p className="font-medium text-gray-600">{gallery.description}</p>
        </div>
        
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span>학습 진행률</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-6 brutal-border bg-brutal-gray relative overflow-hidden">
            <div 
              className="h-full bg-neon-green transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs font-bold text-right">
            {completedCount} / {posts.length} 개념글 완료
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => setViewMode('grid')}
          className={cn("p-2 brutal-border", viewMode === 'grid' ? "bg-neon-pink text-white" : "bg-white")}
        >
          <LayoutGrid size={20} />
        </button>
        <button 
          onClick={() => setViewMode('list')}
          className={cn("p-2 brutal-border", viewMode === 'list' ? "bg-neon-pink text-white" : "bg-white")}
        >
          <List size={20} />
        </button>
      </div>

      {/* Content Area */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => onPostClick(post)}
              className={cn(
                "group text-left p-6 brutal-border brutal-shadow transition-all hover:-translate-y-1",
                post.isCompleted ? "bg-brutal-gray" : "bg-white"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={cn(
                  "px-2 py-1 text-xs font-bold brutal-border",
                  post.difficulty === '입문' ? "bg-green-200" :
                  post.difficulty === '초급' ? "bg-blue-200" :
                  post.difficulty === '중급' ? "bg-yellow-200" :
                  post.difficulty === '고급' ? "bg-orange-200" : "bg-red-200"
                )}>
                  {post.difficulty}
                </span>
                {post.isCompleted ? <CheckCircle2 className="text-neon-green" /> : <Circle className="text-gray-300" />}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-neon-pink">{post.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.content}</p>
              <div className="flex items-center gap-1 text-xs font-black uppercase tracking-tighter">
                View Concept <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {gallery.posts.map((post, idx) => (
            <button
              key={post.id}
              onClick={() => onPostClick(post)}
              className={cn(
                "w-full flex items-center gap-4 p-4 brutal-border brutal-shadow transition-all hover:translate-x-1",
                post.isCompleted ? "bg-brutal-gray" : "bg-white"
              )}
            >
              <div className="font-display text-2xl opacity-30">{(idx + 1).toString().padStart(2, '0')}</div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-lg">{post.title}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs font-bold text-gray-500 uppercase">{post.difficulty}</span>
                  {(post.dependencies || []).length > 0 && (
                    <span className="text-xs font-bold text-neon-pink uppercase">선행 필요: {(post.dependencies || []).length}</span>
                  )}
                </div>
              </div>
              {post.isCompleted ? <CheckCircle2 className="text-neon-green" /> : <Circle className="text-gray-300" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
