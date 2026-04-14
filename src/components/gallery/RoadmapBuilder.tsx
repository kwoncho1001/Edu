import { useState } from "react";
import { Plus, Trash2, GripVertical, Save, Eye, EyeOff, Sparkles, FileText, Wand2 } from "lucide-react";
import { ConceptPost, Difficulty } from "@/types/gallery";
import { cn } from "@/lib/utils";
import { restructureText, fragmentAndPrioritize } from "@/services/galleryService";

interface Props {
  posts: ConceptPost[];
  onUpdate: (posts: ConceptPost[]) => void;
}

export default function RoadmapBuilder({ posts, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [bulkText, setBulkText] = useState("");
  const [showBulkImport, setShowBulkImport] = useState(false);

  const addPost = () => {
    const newPost: ConceptPost = {
      id: Math.random().toString(36).substr(2, 9),
      title: "새로운 개념글",
      content: "내용을 입력하세요.",
      difficulty: "입문",
      dependencies: [],
      isCompleted: false,
      order: posts.length,
    };
    onUpdate([...posts, newPost]);
    setIsEditing(newPost.id);
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;
    const newFragments = fragmentAndPrioritize(bulkText) as ConceptPost[];
    onUpdate([...posts, ...newFragments]);
    setBulkText("");
    setShowBulkImport(false);
  };

  const optimizePost = (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      updatePost(id, { content: restructureText(post.content) });
    }
  };

  const removePost = (id: string) => {
    onUpdate(posts.filter((p) => p.id !== id));
  };

  const updatePost = (id: string, updates: Partial<ConceptPost>) => {
    onUpdate(posts.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const movePost = (id: string, direction: 'up' | 'down') => {
    const index = posts.findIndex(p => p.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === posts.length - 1) return;

    const newPosts = [...posts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newPosts[index], newPosts[targetIndex]] = [newPosts[targetIndex], newPosts[index]];
    
    const orderedPosts = newPosts.map((p, i) => ({ ...p, order: i }));
    onUpdate(orderedPosts);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-display">개념글 로드맵 빌더</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowBulkImport(!showBulkImport)}
            className="flex items-center gap-2 px-4 py-2 bg-brutal-black text-white brutal-border brutal-shadow font-bold hover:translate-x-1 transition-all"
          >
            <FileText size={20} /> 대량 파편화
          </button>
          <button 
            onClick={addPost}
            className="flex items-center gap-2 px-4 py-2 bg-neon-green brutal-border brutal-shadow font-bold hover:translate-x-1 transition-all"
          >
            <Plus size={20} /> 개념글 추가
          </button>
        </div>
      </div>

      {showBulkImport && (
        <div className="p-6 brutal-border bg-brutal-gray space-y-4 animate-in zoom-in-95">
          <div className="flex items-center gap-2 text-sm font-black uppercase">
            <Sparkles className="text-neon-pink" size={16} /> 방대한 텍스트를 한 입 크기로 쪼개기
          </div>
          <textarea 
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="w-full h-48 p-4 brutal-border bg-white font-medium focus:ring-4 focus:ring-neon-pink outline-none"
            placeholder="전공 서적이나 긴 학술 텍스트를 여기에 붙여넣으세요..."
          />
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setShowBulkImport(false)}
              className="px-4 py-2 brutal-border bg-white font-bold"
            >
              취소
            </button>
            <button 
              onClick={handleBulkImport}
              className="px-6 py-2 bg-neon-pink text-white brutal-border brutal-shadow font-bold"
            >
              파편화 실행
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.sort((a, b) => a.order - b.order).map((post, index) => (
          <div key={post.id} className="brutal-border bg-white overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b-3 border-brutal-black bg-brutal-gray">
              <div className="flex flex-col gap-1">
                <button onClick={() => movePost(post.id, 'up')} className="hover:text-neon-pink">▲</button>
                <button onClick={() => movePost(post.id, 'down')} className="hover:text-neon-pink">▼</button>
              </div>
              <div className="font-display text-xl">STEP {index + 1}</div>
              <input 
                value={post.title}
                onChange={(e) => updatePost(post.id, { title: e.target.value })}
                className="flex-1 bg-transparent border-none font-bold text-lg focus:ring-0"
                placeholder="개념글 제목"
              />
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => optimizePost(post.id)}
                  title="인지 부하 완화 최적화"
                  className="p-2 hover:bg-neon-green brutal-border"
                >
                  <Wand2 size={18} />
                </button>
                <button 
                  onClick={() => setIsEditing(isEditing === post.id ? null : post.id)}
                  className="p-2 hover:bg-white brutal-border"
                >
                  {isEditing === post.id ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button 
                  onClick={() => removePost(post.id)}
                  className="p-2 hover:bg-red-500 hover:text-white brutal-border"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {isEditing === post.id && (
              <div className="p-6 space-y-4 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase">난이도 설정</label>
                    <select 
                      value={post.difficulty}
                      onChange={(e) => updatePost(post.id, { difficulty: e.target.value as Difficulty })}
                      className="w-full p-2 brutal-border bg-white font-bold"
                    >
                      {['입문', '초급', '중급', '고급', '심화'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase">미디어 링크 (이미지/영상)</label>
                    <input 
                      value={post.mediaUrl || ""}
                      onChange={(e) => updatePost(post.id, { mediaUrl: e.target.value })}
                      className="w-full p-2 brutal-border bg-white"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase">핵심 내용 (개념글 본문)</label>
                    <button 
                      onClick={() => optimizePost(post.id)}
                      className="text-[10px] font-black uppercase text-neon-pink hover:underline flex items-center gap-1"
                    >
                      <Sparkles size={10} /> 인지 부하 완화 최적화
                    </button>
                  </div>
                  <textarea 
                    value={post.content}
                    onChange={(e) => updatePost(post.id, { content: e.target.value })}
                    className="w-full min-h-[150px] p-4 brutal-border bg-white resize-none font-medium leading-relaxed"
                    placeholder="학습자가 한 입에 삼킬 수 있게 설명해봐..."
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={() => setIsEditing(null)}
                    className="px-6 py-2 bg-brutal-black text-white font-bold brutal-border brutal-shadow"
                  >
                    저장하기
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="p-12 brutal-border border-dashed bg-brutal-gray text-center">
          <p className="font-bold text-gray-500">아직 등록된 개념글이 없습니다. 첫 번째 발걸음을 떼보세요!</p>
        </div>
      )}
    </div>
  );
}
