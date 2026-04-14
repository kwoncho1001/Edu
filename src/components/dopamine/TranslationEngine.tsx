import { useState } from "react";
import { Zap, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { DopamineConfig, TranslationMapping } from "@/types/dopamine";
import { cn } from "@/lib/utils";

const TERM_DB: TranslationMapping[] = [
  { academicTerm: "객체 지향 프로그래밍", slangTerm: "레고 놀이", metaphor: "현실 세계 물건들을 레고 블록처럼 만들어서 조립하는 방식임. 하나 고장 나도 그 블록만 갈아 끼우면 됨." },
  { academicTerm: "재귀 함수", slangTerm: "거울 속의 거울", metaphor: "함수가 지 스스로를 또 부르는 건데, 멈추는 조건 없으면 무한 루프 타다가 뇌 정지(Stack Overflow) 옴." },
  { academicTerm: "비동기 처리", slangTerm: "멀티태스킹 배달", metaphor: "음식 주문하고 나올 때까지 멍 때리는 게 아니라, 그 사이에 유튜브도 보고 롤도 한 판 때리는 효율 극대화 기법임." },
  { academicTerm: "가상 메모리", slangTerm: "책상 확장술", metaphor: "실제 책상은 좁은데 옆에 박스 하나 갖다 놓고 안 쓰는 책은 거기 던져놨다가 필요할 때만 꺼내 쓰는 꼼수임." }
];

interface Props {
  onTranslate: (source: string, config: DopamineConfig) => void;
  isTranslating: boolean;
}

export default function TranslationEngine({ onTranslate, isTranslating }: Props) {
  const [text, setText] = useState("");
  const [config, setConfig] = useState<DopamineConfig>({
    intensity: 50,
    style: 'humorous',
    useSlang: true
  });

  const handleTranslate = () => {
    if (!text.trim()) return;
    onTranslate(text, config);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <textarea
          className="w-full h-48 p-6 brutal-border bg-white font-bold text-lg focus:ring-4 focus:ring-neon-pink outline-none resize-none"
          placeholder="교수님이 하신 외계어를 여기다 박아넣어라..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute bottom-4 right-4 text-xs font-black text-gray-400 uppercase">
          Academic Source Input
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 brutal-border bg-white space-y-3">
          <label className="text-xs font-black uppercase flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" /> 도파민 강도: {config.intensity}%
          </label>
          <input 
            type="range" 
            min="0" max="100" 
            className="w-full accent-neon-pink"
            value={config.intensity}
            onChange={(e) => setConfig({...config, intensity: parseInt(e.target.value)})}
          />
        </div>

        <div className="p-4 brutal-border bg-white space-y-3">
          <label className="text-xs font-black uppercase">번역 스타일</label>
          <div className="flex gap-2">
            {(['friendly', 'aggressive', 'humorous'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setConfig({...config, style: s})}
                className={cn(
                  "flex-1 py-1 text-[10px] font-black uppercase brutal-border transition-all",
                  config.style === s ? "bg-brutal-black text-white" : "bg-white hover:bg-brutal-gray"
                )}
              >
                {s === 'friendly' ? '친근' : s === 'aggressive' ? '팩폭' : '유머'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className={cn(
            "brutal-border brutal-shadow font-display text-2xl flex items-center justify-center gap-2 transition-all active:translate-y-1",
            isTranslating ? "bg-gray-200 cursor-not-allowed" : "bg-neon-pink text-white hover:bg-brutal-black"
          )}
        >
          {isTranslating ? "뇌 풀가동 중..." : "도파민 변환"} <ArrowRight />
        </button>
      </div>

      <div className="p-4 brutal-border bg-yellow-50 flex items-start gap-3">
        <AlertCircle className="text-yellow-600 shrink-0" size={20} />
        <p className="text-xs font-bold text-yellow-800 leading-relaxed">
          [경고] 강도를 80% 이상으로 올리면 교수님에 대한 존경심이 사라질 수 있음. 팩트 폭격 주의.
        </p>
      </div>
    </div>
  );
}
