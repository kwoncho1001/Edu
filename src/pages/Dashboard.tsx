import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="space-y-6">
        <div className="inline-block px-4 py-1 brutal-border bg-neon-green text-sm font-bold uppercase tracking-widest">
          System Online
        </div>
        <h1 className="text-6xl md:text-8xl font-display leading-none">
          공부의 악순환을<br />
          <span className="text-neon-pink">박살내다</span>
        </h1>
        <p className="text-xl md:text-2xl font-medium max-w-2xl">
          방대한 전공 서적 앞에서 무력감을 느끼는 당신을 위한 강제 몰입형 학습 플랫폼.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/gallery" className="group block p-6 brutal-border brutal-shadow bg-brutal-white hover:bg-neon-green transition-colors">
          <h2 className="text-3xl font-display mb-2 flex items-center justify-between">
            01. 갤러리 커리큘럼 <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </h2>
          <p className="font-medium">방대한 학습 범위를 10개 이상의 갤러리로 쪼개고, 개념글로 로드맵을 제공합니다.</p>
        </Link>
        
        <Link to="/practical" className="group block p-6 brutal-border brutal-shadow bg-brutal-white hover:bg-neon-pink transition-colors">
          <h2 className="text-3xl font-display mb-2 flex items-center justify-between">
            02. 실전 응용 강화 <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </h2>
          <p className="font-medium">사고실험과 심화 퀴즈를 통해 지식을 체화하고 신유형에 대비합니다.</p>
        </Link>

        <Link to="/dopamine" className="group block p-6 brutal-border brutal-shadow bg-brutal-white hover:bg-yellow-400 transition-colors">
          <h2 className="text-3xl font-display mb-2 flex items-center justify-between">
            03. 도파민 번역기 <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </h2>
          <p className="font-medium">어려운 학술 용어를 야생의 은어와 비속어로 번역하여 몰입도를 극대화합니다.</p>
        </Link>

        <Link to="/villain" className="group block p-6 brutal-border brutal-shadow bg-brutal-white hover:bg-red-500 transition-colors">
          <h2 className="text-3xl font-display mb-2 flex items-center justify-between">
            04. 빌런 소탕 <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </h2>
          <p className="font-medium">잘못된 학습 습관과 메타인지 오류를 저격하여 제거합니다.</p>
        </Link>

        <Link to="/bankrun" className="group block p-6 brutal-border brutal-shadow bg-brutal-white hover:bg-blue-400 transition-colors">
          <h2 className="text-3xl font-display mb-2 flex items-center justify-between">
            05. 뱅크런 방어 <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </h2>
          <p className="font-medium">망각 곡선을 역이용하여 시험 직전 지식 인출력을 최대화합니다.</p>
        </Link>

        <Link to="/exam" className="group block p-6 brutal-border brutal-shadow bg-brutal-white hover:bg-purple-400 transition-colors">
          <h2 className="text-3xl font-display mb-2 flex items-center justify-between">
            06. 기출 학살 <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </h2>
          <p className="font-medium">강의 자료와 기출문제를 1:1로 대응시켜 실전 효율성을 극대화합니다.</p>
        </Link>
      </div>
      
      <div className="overflow-hidden brutal-border py-4 bg-brutal-black text-neon-green">
        <div className="marquee-track space-x-8 text-2xl font-display whitespace-nowrap">
          <span>KILL THE EXAM</span>
          <span>•</span>
          <span>DOPAMINE DRIVEN LEARNING</span>
          <span>•</span>
          <span>NO MORE BRAIN FREEZE</span>
          <span>•</span>
          <span>KILL THE EXAM</span>
          <span>•</span>
          <span>DOPAMINE DRIVEN LEARNING</span>
          <span>•</span>
          <span>NO MORE BRAIN FREEZE</span>
          <span>•</span>
        </div>
      </div>
    </div>
  );
}
