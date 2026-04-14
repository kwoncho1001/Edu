import { useState } from "react";
import { Sparkles, MessageSquare, History, Zap, Brain, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DopamineConfig, TranslationHistory } from "@/types/dopamine";
import TranslationEngine from "@/components/dopamine/TranslationEngine";
import ToneGenerator from "@/components/dopamine/ToneGenerator";
import ImmersionManager from "@/components/dopamine/ImmersionManager";

const MOCK_HISTORY: TranslationHistory[] = [
  { id: "1", source: "객체 지향 프로그래밍", output: "레고 블록 조립하듯이 코드 짜는 거임. 하나 고장 나도 그 블록만 갈아 끼우면 됨.", timestamp: Date.now() - 100000 },
  { id: "2", source: "재귀 함수", output: "함수가 지 스스로를 또 부르는 건데, 멈추는 조건 없으면 무한 루프 타다가 뇌 정지 옴.", timestamp: Date.now() - 500000 }
];

export default function DopamineTranslator() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [output, setOutput] = useState("");
  const [currentConfig, setCurrentConfig] = useState<DopamineConfig | null>(null);
  const [history, setHistory] = useState<TranslationHistory[]>(MOCK_HISTORY);

  const handleTranslate = (source: string, config: DopamineConfig) => {
    setIsTranslating(true);
    setCurrentConfig(config);
    
    // Simulate API call
    setTimeout(() => {
      let translated = "";
      if (source.includes("객체")) {
        translated = "레고 블록 조립하듯이 코드 짜는 거임. 하나 고장 나도 그 블록만 갈아 끼우면 됨. 캡슐화니 뭐니 하는 건 그냥 니 방 더러운 거 옷장에 다 쑤셔 박는 거랑 똑같음.";
      } else if (source.includes("재귀")) {
        translated = "함수가 지 스스로를 또 부르는 건데, 멈추는 조건 없으면 무한 루프 타다가 뇌 정지(Stack Overflow) 옴. 거울 속에 거울 있는 거랑 똑같다고 보면 됨.";
      } else {
        translated = `[도파민 번역 완료] ${source}? 그거 그냥 대충 말하자면 친구들끼리 롤 할 때 포지션 나누는 거랑 비슷함. 너무 어렵게 생각하지 마라. 뇌에 힘 빼고 봐라.`;
      }

      setOutput(translated);
      setIsTranslating(false);
      setHistory(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        source,
        output: translated,
        timestamp: Date.now()
      }, ...prev]);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 brutal-border bg-neon-pink text-white">
            <Brain size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-brutal-black">도파민 번역기</h1>
        </div>
        <p className="text-xl font-medium max-w-2xl leading-relaxed">
          교수님의 지루한 학술 용어를 야생의 은어로 번역한다. <br/>
          <span className="text-neon-pink font-black uppercase">뇌에 지식을 직접 꽂아 넣어라.</span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-display flex items-center gap-2">
                <MessageSquare className="text-neon-pink" /> 학술 원문 입력
              </h2>
              <div className="px-3 py-1 bg-neon-green brutal-border text-[10px] font-black uppercase">
                NLP Engine Ready
              </div>
            </div>
            <TranslationEngine onTranslate={handleTranslate} isTranslating={isTranslating} />
          </section>

          {output && currentConfig && (
            <section>
              <ToneGenerator 
                output={output} 
                config={currentConfig} 
                onRegenerate={() => handleTranslate(history[0].source, currentConfig)} 
              />
            </section>
          )}
        </div>

        <aside className="space-y-8">
          <section className="brutal-border bg-white p-6 brutal-shadow">
            <h3 className="text-xl font-display mb-6 flex items-center gap-2">
              <History size={20} /> 최근 번역 히스토리
            </h3>
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="p-4 bg-brutal-gray brutal-border hover:bg-white transition-colors cursor-pointer group">
                  <div className="text-[10px] font-black uppercase text-gray-400 mb-1">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="font-bold text-sm mb-2 group-hover:text-neon-pink transition-colors">{item.source}</div>
                  <p className="text-xs text-gray-500 line-clamp-2 italic">"{item.output}"</p>
                </div>
              ))}
            </div>
          </section>

          <section className="brutal-border bg-brutal-black text-white p-6 brutal-shadow">
            <h3 className="text-xl font-display mb-4 flex items-center gap-2 text-neon-green">
              <Zap size={20} /> 도파민 트리거 팁
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex gap-2">
                <span className="text-neon-pink">01.</span>
                <span>어려운 용어는 무조건 '게임'이나 '음식'에 비유해라. 뇌가 바로 반응한다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neon-pink">02.</span>
                <span>반말 모드를 켜라. 뇌가 정보를 '공부'가 아닌 '대화'로 인식한다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neon-pink">03.</span>
                <span>팩트 폭격 강도를 높여라. 자극이 강할수록 기억은 오래간다.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <ImmersionManager />
    </div>
  );
}
