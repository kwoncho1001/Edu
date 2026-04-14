import { useState } from "react";
import { Search, Filter, Tag, BarChart2, BookOpen, ChevronRight } from "lucide-react";
import { ExamQuestion, Concept } from "@/types/exam";
import { cn } from "@/lib/utils";

interface Props {
  questions: ExamQuestion[];
  concepts: Concept[];
  onSelectQuestion: (q: ExamQuestion) => void;
}

export default function ExamDatabase({ questions, concepts, onSelectQuestion }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         q.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = filterDifficulty === "all" || q.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="개념 키워드 또는 문제 태그 검색..."
            className="w-full pl-10 pr-4 py-3 brutal-border bg-white font-bold focus:ring-4 focus:ring-neon-green outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="p-3 brutal-border bg-white font-bold outline-none"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="all">모든 난이도</option>
            <option value="하">난이도: 하</option>
            <option value="중">난이도: 중</option>
            <option value="상">난이도: 상</option>
            <option value="최상">난이도: 최상</option>
          </select>
          <button className="p-3 brutal-border bg-brutal-black text-white hover:bg-neon-green hover:text-black transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuestions.map((q) => {
          const concept = concepts.find(c => c.id === q.conceptId);
          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(q)}
              className="group text-left p-5 brutal-border bg-white brutal-shadow hover:-translate-y-1 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-black uppercase brutal-border",
                    q.difficulty === '최상' ? "bg-red-500 text-white" :
                    q.difficulty === '상' ? "bg-orange-400" :
                    q.difficulty === '중' ? "bg-yellow-300" : "bg-green-300"
                  )}>
                    난이도 {q.difficulty}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase brutal-border bg-purple-200">
                    적중률 {q.hitRate}%
                  </span>
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">ID: {q.id}</div>
              </div>
              
              <p className="font-bold text-lg line-clamp-2 mb-4 group-hover:text-purple-600">
                {q.text}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {q.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <BookOpen size={14} /> {concept?.name}
                </div>
                <div className="flex items-center gap-1 text-xs font-black uppercase text-purple-500">
                  Analyze <ChevronRight size={14} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="p-12 brutal-border border-dashed bg-brutal-gray text-center">
          <p className="font-bold text-gray-500 italic">검색 결과가 없습니다. 데이터베이스를 더 학살해보세요.</p>
        </div>
      )}
    </div>
  );
}
