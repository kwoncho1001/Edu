import { ConceptPost, Difficulty, HierarchyLevel } from "@/types/gallery";
import { GitBranch, AlertCircle, TrendingUp, RefreshCw, Sparkles, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { autoClassifyHierarchy, syncKnowledgeHierarchy } from "@/services/galleryService";

interface Props {
  posts: ConceptPost[];
  onUpdatePosts: (posts: ConceptPost[]) => void;
  onUpdateDependency: (postId: string, dependencyIds: string[]) => void;
}

export default function HierarchyManager({ posts, onUpdatePosts, onUpdateDependency }: Props) {
  const difficulties: Difficulty[] = ['입문', '초급', '중급', '고급', '심화'];
  const hierarchyLevels: HierarchyLevel[] = ['Core', 'Advanced', 'Supplementary'];

  const handleAutoClassify = () => {
    const updatedPosts = posts.map(post => ({
      ...post,
      hierarchyLevel: autoClassifyHierarchy(post)
    }));
    onUpdatePosts(updatedPosts);
  };

  const handleSync = () => {
    // Simulated sync with frequency scores
    const postsWithScores = posts.map(p => ({
      ...p,
      frequencyScore: Math.floor(Math.random() * 100)
    }));
    const syncedPosts = syncKnowledgeHierarchy(postsWithScores);
    onUpdatePosts(syncedPosts);
  };

  const updateHierarchyLevel = (postId: string, level: HierarchyLevel) => {
    onUpdatePosts(posts.map(p => p.id === postId ? { ...p, hierarchyLevel: level } : p));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-display">콘텐츠 계층화 관리기</h3>
          <p className="text-sm font-medium text-gray-500">지식의 깊이와 중요도에 따라 학습 위계를 설계합니다.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAutoClassify}
            className="flex items-center gap-2 px-4 py-2 bg-neon-pink text-white brutal-border brutal-shadow font-bold hover:translate-x-1 transition-all"
          >
            <Sparkles size={18} /> 자동 분류
          </button>
          <button 
            onClick={handleSync}
            className="flex items-center gap-2 px-4 py-2 bg-white brutal-border brutal-shadow font-bold hover:translate-x-1 transition-all"
          >
            <RefreshCw size={18} /> 위계 동기화
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hierarchyLevels.map((hLevel) => {
          const levelPosts = posts.filter(p => p.hierarchyLevel === hLevel);
          return (
            <div key={hLevel} className="space-y-4">
              <div className={cn(
                "p-3 brutal-border flex items-center justify-between font-display",
                hLevel === 'Core' ? "bg-neon-green" :
                hLevel === 'Advanced' ? "bg-blue-400 text-white" : "bg-brutal-gray"
              )}>
                <div className="flex items-center gap-2">
                  <Layers size={18} />
                  <span>{hLevel}</span>
                </div>
                <span className="text-xs font-black">{levelPosts.length}</span>
              </div>
              
              <div className="min-h-[400px] p-4 brutal-border border-dashed bg-white space-y-4">
                {levelPosts.map(post => (
                  <div key={post.id} className="p-4 brutal-border bg-white group relative space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm leading-tight pr-4">{post.title}</div>
                      <span className="text-[10px] font-black uppercase px-1 brutal-border bg-brutal-gray">
                        {post.difficulty}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] text-gray-400 uppercase font-black">계층 변경</div>
                      <div className="flex gap-1">
                        {hierarchyLevels.map(l => (
                          <button
                            key={l}
                            onClick={() => updateHierarchyLevel(post.id, l)}
                            className={cn(
                              "px-2 py-1 text-[10px] font-bold brutal-border transition-all",
                              post.hierarchyLevel === l ? "bg-brutal-black text-white" : "bg-white hover:bg-brutal-gray"
                            )}
                          >
                            {l[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-[10px] text-gray-400 uppercase font-black">선행 조건 설정</div>
                      <div className="flex flex-wrap gap-1">
                        {posts
                          .filter(p => p.id !== post.id)
                          .slice(0, 4)
                          .map(p => (
                            <button
                              key={p.id}
                              onClick={() => {
                                const newDeps = post.dependencies.includes(p.id)
                                  ? post.dependencies.filter(id => id !== p.id)
                                  : [...post.dependencies, p.id];
                                onUpdateDependency(post.id, newDeps);
                              }}
                              className={cn(
                                "px-1 text-[9px] font-bold brutal-border transition-colors",
                                post.dependencies.includes(p.id) 
                                  ? "bg-neon-pink text-white" 
                                  : "bg-white border-gray-200"
                              )}
                            >
                              {p.title.slice(0, 5)}..
                            </button>
                          ))}
                      </div>
                    </div>

                    {post.dependencies.length > 0 && (
                      <div className="absolute -top-2 -right-2 bg-neon-pink text-white p-1 brutal-border">
                        <GitBranch size={10} />
                      </div>
                    )}
                  </div>
                ))}
                {levelPosts.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                    <AlertCircle size={32} />
                    <p className="text-xs font-bold mt-2">콘텐츠 없음</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 brutal-border bg-yellow-400 brutal-shadow flex items-start gap-4">
        <div className="p-3 bg-white brutal-border">
          <TrendingUp className="text-brutal-black" size={24} />
        </div>
        <div className="space-y-1">
          <p className="font-display text-xl uppercase">시스템 최적화 제언</p>
          <p className="font-medium text-brutal-black/80">
            'Core' 계층의 학습 완료율이 92%에 도달했습니다. 학습자들이 'Advanced' 단계로 넘어갈 준비가 되었으니, 
            심화 개념 간의 의존성 그래프를 재점검하고 'Supplementary' 콘텐츠를 보강하여 학습 몰입도를 유지하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
