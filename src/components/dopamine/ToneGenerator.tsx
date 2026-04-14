import { Sparkles, Copy, Share2, RefreshCw, MessageSquare } from "lucide-react";
import { DopamineConfig } from "@/types/dopamine";
import { cn } from "@/lib/utils";

interface Props {
  output: string;
  config: DopamineConfig;
  onRegenerate: () => void;
}

export default function ToneGenerator({ output, config, onRegenerate }: Props) {
  if (!output) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-display flex items-center gap-2">
          <Sparkles className="text-neon-pink" /> 도파민 뇌피셜 번역 결과
        </h3>
        <div className="flex gap-2">
          <button className="p-2 brutal-border bg-white hover:bg-brutal-gray transition-colors">
            <Copy size={18} />
          </button>
          <button className="p-2 brutal-border bg-white hover:bg-brutal-gray transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-2 bg-neon-pink/10 brutal-border border-dashed -z-10 group-hover:bg-neon-pink/20 transition-colors" />
        <div className="p-8 brutal-border bg-white brutal-shadow-lg relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-2 bg-brutal-black text-neon-green text-[10px] font-black uppercase tracking-tighter rotate-12 translate-x-4 -translate-y-2">
            100% Dopamine
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="shrink-0 w-12 h-12 brutal-border bg-neon-pink flex items-center justify-center text-white font-display text-2xl">
              <MessageSquare />
            </div>
            <div className="space-y-4">
              <p className={cn(
                "text-xl font-bold leading-relaxed",
                config.style === 'aggressive' ? "text-red-600" : "text-brutal-black"
              )}>
                {output}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-brutal-gray brutal-border text-[10px] font-black uppercase">
                  어조: {config.style}
                </span>
                <span className="px-2 py-1 bg-brutal-gray brutal-border text-[10px] font-black uppercase">
                  강도: {config.intensity}%
                </span>
                {config.intensity > 70 && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 brutal-border border-red-200 text-[10px] font-black uppercase">
                    High Stimulation
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={onRegenerate}
          className="flex items-center gap-2 px-8 py-3 brutal-border bg-brutal-black text-white font-display text-xl hover:bg-neon-pink hover:text-white transition-all active:scale-95"
        >
          <RefreshCw size={20} /> 다른 밈으로 다시 번역
        </button>
      </div>

      <div className="p-6 brutal-border bg-brutal-gray">
        <h4 className="text-sm font-black uppercase mb-4 text-gray-500">이해를 돕는 뇌피셜 비유</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white brutal-border">
            <p className="text-sm font-bold italic">"이거 마치 롤에서 한타 때 궁극기 아끼다가 똥 되는 거랑 똑같은 원리임. 제때제때 메모리 비워줘야 됨."</p>
          </div>
          <div className="p-4 bg-white brutal-border">
            <p className="text-sm font-bold italic">"어려운 말로 '캡슐화'라고 하는데, 그냥 니 방 더러운 거 손님 오기 전에 옷장에 다 쑤셔 박고 문 닫는 거임."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
