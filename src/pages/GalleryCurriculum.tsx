import { useState, useEffect } from "react";
import { ChevronRight, Lock, Unlock, Settings, Play, BarChart3, X, Sparkles, Info, Activity, Trophy, Zap, Compass, FileText, Link as LinkIcon, Microscope, Database, Languages, Brain, Skull, FlaskConical, MessageSquare, Target, BrainCircuit, Calendar, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Gallery, ConceptPost } from "@/types/gallery";
import RoadmapBuilder from "@/components/gallery/RoadmapBuilder";
import GalleryEngine from "@/components/gallery/GalleryEngine";
import HierarchyManager from "@/components/gallery/HierarchyManager";
import MappingEngine from "@/components/gallery/MappingEngine";
import VariantAnalyzer from "@/components/gallery/VariantAnalyzer";
import ExamDatabaseManager from "@/components/gallery/ExamDatabaseManager";
import EmotionManager from "@/components/gallery/EmotionManager";
import DopamineToneGenerator from "@/components/gallery/DopamineToneGenerator";
import AcademicTranslator from "@/components/gallery/AcademicTranslator";
import MetacognitiveFeedbackLoop from "@/components/gallery/MetacognitiveFeedbackLoop";
import VillainMissionModule from "@/components/gallery/VillainMissionModule";
import VillainDashboard from "@/components/gallery/VillainDashboard";
import ThoughtExperimentSimulator from "@/components/gallery/ThoughtExperimentSimulator";
import DeepQuizEngine from "@/components/gallery/DeepQuizEngine";
import EvaluationCenter from "@/components/gallery/EvaluationCenter";
import KnowledgeCurator from "@/components/gallery/KnowledgeCurator";
import IntervalScheduler from "@/components/gallery/IntervalScheduler";
import FileUploadModule from "@/components/gallery/FileUploadModule";
import { getVisualizationMeta, calculateRewards, designPersonalizedPath, segmentContentToGalleries } from "@/services/galleryService";
import { generateContent } from "@/services/geminiService";
import { ExamQuestion, ConceptNode } from "@/services/mappingService";
import { LearningLog, LearningPlan } from "@/types/metacognition";
import { MissionResult } from "@/types/villain";

const INITIAL_GALLERY: Gallery = {
  id: "os-101",
  title: "운영체제 갤러리",
  description: "컴퓨터의 뇌, OS의 핵심 원리를 파헤친다.",
  domain: "Computer Science",
  status: "published",
  progress: 0,
  posts: Array.from({ length: 10 }).map((_, i) => ({
    id: `p${i + 1}`,
    title: i === 0 ? "프로세스와 스레드, 3분만에 뇌에 꽂아줌" : i === 1 ? "데드락(교착상태) 안 걸리는 법" : `OS 핵심 개념 ${i + 1}`,
    content: i === 0 ? "**프로세스는 실행 중인 프로그램이고, 스레드는 그 안의 실행 단위다.**\n롤 클라이언트가 프로세스라면, 인게임 사운드 재생과 그래픽 렌더링은 각각의 스레드라고 보면 됨." : `내용 ${i + 1}`,
    difficulty: i < 3 ? "입문" : i < 7 ? "중급" : "고급",
    hierarchyLevel: i < 4 ? 'Core' : i < 8 ? 'Advanced' : 'Supplementary',
    dependencies: i > 0 ? [`p${i}`] : [],
    isCompleted: i === 0,
    order: i
  }))
};

const MOCK_QUESTIONS: ExamQuestion[] = [
  {
    id: "q1",
    type: "객관식",
    content: "다음 중 프로세스와 스레드에 대한 설명으로 옳지 않은 것은?",
    answer: "3",
    explanation: "스레드는 프로세스 내의 자원을 공유하지만, 프로세스는 독립적인 메모리 공간을 갖습니다.",
    conceptId: "p1",
    difficulty: "중급",
    frequency: 85,
    tags: ["OS", "Process"],
    year: 2023
  },
  {
    id: "q2",
    type: "객관식",
    content: "데드락의 4가지 발생 조건이 아닌 것은?",
    answer: "4",
    explanation: "상호 배제, 점유 대기, 비선점, 순환 대기가 데드락의 4대 조건입니다.",
    conceptId: "p2",
    difficulty: "초급",
    frequency: 92,
    tags: ["OS", "Deadlock"],
    year: 2022
  }
];

const MOCK_CONCEPT_NODES: ConceptNode[] = [
  { id: 'p1', title: '프로세스와 스레드', summary: '실행 중인 프로그램과 실행 단위', level: 1 },
  { id: 'p2', title: '데드락', summary: '교착 상태의 원인과 방지', level: 1 },
];

const MOCK_LOGS: LearningLog[] = [
  { id: 'l1', timestamp: new Date().toISOString(), subject: '운영체제', questionId: 'q1', isCorrect: false, responseTime: 3000, hintUsed: false, confidenceLevel: 5, errorType: 'Concept' },
  { id: 'l2', timestamp: new Date().toISOString(), subject: '운영체제', questionId: 'q1', isCorrect: false, responseTime: 2500, hintUsed: false, confidenceLevel: 4, errorType: 'Concept' },
  { id: 'l3', timestamp: new Date().toISOString(), subject: '운영체제', questionId: 'q1', isCorrect: true, responseTime: 12000, hintUsed: true, confidenceLevel: 2 },
  { id: 'l4', timestamp: new Date().toISOString(), subject: '자료구조', questionId: 'q2', isCorrect: false, responseTime: 4000, hintUsed: false, confidenceLevel: 5, errorType: 'Calculation' },
  { id: 'l5', timestamp: new Date().toISOString(), subject: '자료구조', questionId: 'q2', isCorrect: true, responseTime: 8000, hintUsed: false, confidenceLevel: 3 },
  { id: 'l6', timestamp: new Date().toISOString(), subject: '운영체제', questionId: 'q1', isCorrect: false, responseTime: 3000, hintUsed: false, confidenceLevel: 5, errorType: 'Concept' },
  { id: 'l7', timestamp: new Date().toISOString(), subject: '네트워크', questionId: 'q3', isCorrect: true, responseTime: 5000, hintUsed: false, confidenceLevel: 4 },
  { id: 'l8', timestamp: new Date().toISOString(), subject: '네트워크', questionId: 'q3', isCorrect: false, responseTime: 15000, hintUsed: true, confidenceLevel: 2, errorType: 'Concept' },
  { id: 'l9', timestamp: new Date().toISOString(), subject: '데이터베이스', questionId: 'q4', isCorrect: true, responseTime: 6000, hintUsed: false, confidenceLevel: 5 },
  { id: 'l10', timestamp: new Date().toISOString(), subject: '데이터베이스', questionId: 'q4', isCorrect: false, responseTime: 4000, hintUsed: false, confidenceLevel: 4, errorType: 'Calculation' },
];

const MOCK_PLAN: LearningPlan = {
  id: 'plan-1',
  subject: '운영체제',
  plannedQuantity: 20,
  actualQuantity: 12,
  plannedTime: 60,
  actualTime: 45,
  status: 'InProgress'
};

type ViewMode = 'upload' | 'learn' | 'build' | 'manage' | 'recommend' | 'mapping' | 'variant' | 'database' | 'tone' | 'translate' | 'metacognition' | 'mission' | 'dashboard' | 'thought' | 'quiz' | 'evaluation' | 'curator' | 'scheduler';

export default function GalleryCurriculum() {
  const [gallery, setGallery] = useState<Gallery>(INITIAL_GALLERY);
  const [viewMode, setViewMode] = useState<ViewMode>('upload');
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDataExtracted = async (text: string) => {
    setExtractedText(text);
    setIsGenerating(true);
    
    try {
      const prompt = `
        Analyze the provided educational text and generate a structured gallery curriculum.
        Return a JSON object matching the 'Gallery' interface:
        {
          "id": "string",
          "title": "Main Title of the Content",
          "description": "Brief overview",
          "domain": "Subject Domain",
          "status": "published",
          "progress": 0,
          "posts": [
            {
              "id": "string",
              "title": "Concept Title",
              "content": "Detailed explanation",
              "difficulty": "입문" | "초급" | "중급" | "고급" | "심화",
              "dependencies": [],
              "isCompleted": false,
              "order": 1
            }
          ]
        }
        Generate at least 5-8 distinct concept posts based on the text. Ensure 'dependencies' is an array of strings (or empty array).
      `;

      const generatedGallery = await generateContent<Gallery>(prompt, text, 'gallery');
      
      setGallery(generatedGallery);
      setIsGenerating(false);
      setViewMode('learn');
    } catch (error) {
      console.error("Failed to generate content:", error);
      setIsGenerating(false);
      // Fallback to mock if API fails for now, but show error in production
      alert("AI 콘텐츠 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };
  const [selectedPost, setSelectedPost] = useState<ConceptPost | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestion | null>(MOCK_QUESTIONS[0]);
  const [streak, setStreak] = useState(5);
  const [points, setPoints] = useState(1250);
  const [diagnosisScore, setDiagnosisScore] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  const updatePosts = (newPosts: ConceptPost[]) => {
    setGallery({ ...gallery, posts: newPosts });
  };

  const updateDependency = (postId: string, dependencyIds: string[]) => {
    setGallery({
      ...gallery,
      posts: gallery.posts.map(p => p.id === postId ? { ...p, dependencies: dependencyIds } : p)
    });
  };

  const togglePostCompletion = (postId: string) => {
    const newPosts = gallery.posts.map(p => p.id === postId ? { ...p, isCompleted: !p.isCompleted } : p);
    const updatedGallery = { ...gallery, posts: newPosts };
    setGallery(updatedGallery);

    const rewards = calculateRewards(updatedGallery, streak);
    if (rewards.isFullyCompleted) {
      setPoints(prev => prev + rewards.points);
    }
  };

  const handleDiagnosis = (score: number) => {
    setDiagnosisScore(score);
    const path = designPersonalizedPath(score, [gallery]);
    setRecommendation(path);
    setViewMode('recommend');
  };

  const visualMeta = selectedPost ? getVisualizationMeta(selectedPost) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Emotion Manager Overlay */}
      <EmotionManager userId="user-1" onPointsUpdate={(p) => setPoints(prev => prev + p)} />

      {/* Gamification Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 brutal-border bg-brutal-black text-white">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} />
            <span className="font-display text-xl">{points} PTS</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="text-neon-pink" size={20} />
            <span className="font-display text-xl">{streak} DAY STREAK</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-black uppercase text-gray-400">Current Rank</div>
          <div className="px-3 py-1 bg-neon-green text-brutal-black font-black text-xs brutal-border border-white">
            GALLERY EXPLORER
          </div>
        </div>
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-display mb-4">갤러리 커리큘럼</h1>
          <p className="text-xl font-medium max-w-3xl">
            방대한 학습 범위를 갤러리 구조로 쪼개고, 계단식 로드맵을 통해 지식을 체화한다.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setViewMode('upload')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'upload' ? "bg-brutal-black text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Upload size={18} /> 자료 업로드
          </button>
          <button 
            onClick={() => setViewMode('learn')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'learn' ? "bg-neon-green brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Play size={18} /> 학습하기
          </button>
          <button 
            onClick={() => setViewMode('dashboard')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'dashboard' ? "bg-brutal-black text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <BarChart3 size={18} /> 데이터 대시보드
          </button>
          <button 
            onClick={() => setViewMode('thought')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'thought' ? "bg-brutal-black text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <FlaskConical size={18} /> 사고실험
          </button>
          <button 
            onClick={() => setViewMode('quiz')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'quiz' ? "bg-brutal-black text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <MessageSquare size={18} /> 심화 퀴즈
          </button>
          <button 
            onClick={() => setViewMode('evaluation')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'evaluation' ? "bg-brutal-black text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Target size={18} /> 응용 평가
          </button>
          <button 
            onClick={() => setViewMode('curator')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'curator' ? "bg-brutal-black text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <BrainCircuit size={18} /> 지식 소환
          </button>
          <button 
            onClick={() => setViewMode('scheduler')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'scheduler' ? "bg-brutal-black text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Calendar size={18} /> 복습 일정
          </button>
          <button 
            onClick={() => setViewMode('mission')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'mission' ? "bg-brutal-black text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Skull size={18} /> 빌런 소탕
          </button>
          <button 
            onClick={() => setViewMode('metacognition')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'metacognition' ? "bg-neon-pink text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Brain size={18} /> 메타인지
          </button>
          <button 
            onClick={() => setViewMode('translate')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'translate' ? "bg-brutal-black text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Languages size={18} /> 학술 번역
          </button>
          <button 
            onClick={() => setViewMode('tone')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'tone' ? "bg-neon-pink text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Zap size={18} /> 도파민 변환
          </button>
          <button 
            onClick={() => setViewMode('database')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'database' ? "bg-brutal-black text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Database size={18} /> 기출 DB
          </button>
          <button 
            onClick={() => setViewMode('mapping')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'mapping' ? "bg-neon-pink text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <LinkIcon size={18} /> 기출 매핑
          </button>
          <button 
            onClick={() => setViewMode('variant')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'variant' ? "bg-yellow-400 brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Microscope size={18} /> 신유형 분석
          </button>
          <button 
            onClick={() => setViewMode('recommend')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 brutal-border font-bold transition-all",
              viewMode === 'recommend' ? "bg-blue-400 text-white brutal-shadow" : "bg-white hover:bg-brutal-gray"
            )}
          >
            <Compass size={18} /> 경로 추천
          </button>
        </div>
      </header>

      <div className="min-h-[600px]">
        {isGenerating && (
          <div className="flex flex-col items-center justify-center p-20 space-y-6 animate-in zoom-in duration-500">
            <Loader2 size={64} className="animate-spin text-neon-blue" />
            <div className="text-2xl font-display uppercase">AI 튜터가 커리큘럼을 설계 중입니다...</div>
            <p className="text-sm font-bold text-gray-500">텍스트를 분석하여 지식 노드와 상호작용 시나리오를 생성하고 있습니다.</p>
          </div>
        )}

        {!isGenerating && viewMode === 'upload' && (
          <FileUploadModule onDataExtracted={handleDataExtracted} />
        )}

        {!isGenerating && viewMode === 'learn' && (
          <GalleryEngine 
            gallery={gallery} 
            onPostClick={(post) => setSelectedPost(post)} 
          />
        )}

        {viewMode === 'dashboard' && (
          <VillainDashboard 
            logs={MOCK_LOGS}
            onStartMission={(id) => setViewMode('mission')}
          />
        )}

        {viewMode === 'thought' && (
          <ThoughtExperimentSimulator />
        )}

        {viewMode === 'quiz' && (
          <DeepQuizEngine />
        )}

        {viewMode === 'evaluation' && (
          <EvaluationCenter />
        )}

        {viewMode === 'curator' && (
          <KnowledgeCurator />
        )}

        {viewMode === 'scheduler' && (
          <IntervalScheduler />
        )}

        {viewMode === 'mission' && (
          <VillainMissionModule 
            logs={MOCK_LOGS}
            onMissionComplete={(res: MissionResult) => {
              if (res.isSuccess) setPoints(prev => prev + (res.rewards?.exp || 0));
            }}
          />
        )}

        {viewMode === 'metacognition' && (
          <MetacognitiveFeedbackLoop 
            logs={MOCK_LOGS}
            currentPlan={MOCK_PLAN}
          />
        )}

        {viewMode === 'translate' && (
          <AcademicTranslator />
        )}

        {viewMode === 'tone' && (
          <DopamineToneGenerator 
            sourceText={gallery.posts[0].content}
            keywords={["프로세스", "스레드"]}
            onComplete={(res) => console.log("Tone Transformed:", res)}
          />
        )}

        {viewMode === 'database' && (
          <ExamDatabaseManager 
            questions={MOCK_QUESTIONS}
            concepts={MOCK_CONCEPT_NODES}
            onSelectQuestion={(q) => {
              setSelectedQuestion(q);
              setViewMode('variant');
            }}
          />
        )}

        {viewMode === 'mapping' && (
          <MappingEngine 
            concepts={gallery.posts} 
            questions={MOCK_QUESTIONS}
            onRedirectToConcept={(id) => {
              const post = gallery.posts.find(p => p.id === id);
              if (post) {
                setSelectedPost(post);
                setViewMode('learn');
              }
            }}
          />
        )}

        {viewMode === 'variant' && (
          <VariantAnalyzer 
            selectedQuestion={selectedQuestion}
          />
        )}
        
        {viewMode === 'recommend' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-8 brutal-border bg-white brutal-shadow space-y-6">
              <h2 className="text-3xl font-display flex items-center gap-3">
                <Compass className="text-neon-pink" size={32} /> 개인화된 학습 경로 설계
              </h2>
              {!diagnosisScore ? (
                <div className="space-y-4">
                  <p className="font-medium">현재 지식 수준을 진단하여 최적의 경로를 추천해 드립니다.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[30, 60, 90].map(score => (
                      <button 
                        key={score}
                        onClick={() => handleDiagnosis(score)}
                        className="p-6 brutal-border hover:bg-brutal-gray transition-all text-center"
                      >
                        <div className="text-xs font-black text-gray-400 uppercase mb-2">예시 점수</div>
                        <div className="text-4xl font-display">{score}점</div>
                        <div className="mt-2 text-sm font-bold">진단 시작</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-neon-green/20 brutal-border">
                    <div className="text-5xl font-display">{diagnosisScore}점</div>
                    <div>
                      <div className="text-sm font-black uppercase">추천 경로 타입</div>
                      <div className="text-2xl font-display text-neon-pink">{recommendation.pathType}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <ArrowRight size={20} /> 추천 학습 갤러리
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendation.recommendedIds.map((id: string) => (
                        <div key={id} className="p-4 brutal-border bg-white flex justify-between items-center">
                          <span className="font-bold">{gallery.title}</span>
                          <button onClick={() => setViewMode('learn')} className="text-xs font-black uppercase text-neon-pink hover:underline">
                            바로가기
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {recommendation.supplementaryIds.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-blue-500">
                        <Info size={20} /> 보충 학습 권장
                      </h3>
                      <div className="p-4 brutal-border bg-blue-50 border-blue-500">
                        <p className="text-sm font-medium">취약 영역 보충을 위해 다음 갤러리 학습을 병행하세요.</p>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => setDiagnosisScore(null)}
                    className="px-6 py-2 brutal-border bg-brutal-black text-white font-bold"
                  >
                    다시 진단하기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {viewMode === 'build' && (
          <RoadmapBuilder 
            posts={gallery.posts} 
            onUpdate={updatePosts} 
          />
        )}

        {viewMode === 'manage' && (
          <HierarchyManager 
            posts={gallery.posts} 
            onUpdatePosts={updatePosts}
            onUpdateDependency={updateDependency} 
          />
        )}
      </div>

      {/* Concept Post Modal */}
      {selectedPost && visualMeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brutal-black/50 backdrop-blur-sm">
          <div className={cn(
            "w-full max-w-4xl bg-white brutal-border brutal-shadow max-h-[90vh] overflow-y-auto",
            visualMeta.theme === 'highlight' ? "border-neon-pink" : "border-brutal-black"
          )}>
            <div className={cn(
              "sticky top-0 p-4 border-b-3 border-brutal-black flex justify-between items-center",
              visualMeta.theme === 'highlight' ? "bg-neon-pink text-white" : "bg-brutal-gray"
            )}>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-2 py-1 brutal-border text-xs font-bold uppercase",
                  visualMeta.theme === 'highlight' ? "bg-white text-brutal-black" : "bg-neon-green"
                )}>
                  {selectedPost.difficulty}
                </span>
                <h2 className="text-2xl font-display">{selectedPost.title}</h2>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-white hover:text-brutal-black brutal-border">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {visualMeta.showIcon && (
                <div className="flex justify-center">
                  <div className="p-6 brutal-border bg-brutal-gray">
                    <Sparkles className="text-neon-pink" size={48} />
                  </div>
                </div>
              )}

              <div className={cn(
                "prose prose-lg max-w-none font-medium leading-relaxed",
                visualMeta.layout === 'two-column' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "block"
              )}>
                <div className="space-y-4">
                  {selectedPost.content.split('\n').map((para, i) => (
                    para.startsWith('•') ? (
                      <div key={i} className="flex items-start gap-2 p-3 bg-brutal-gray brutal-border">
                        <Activity className="text-neon-pink mt-1 shrink-0" size={16} />
                        <span className="font-bold">{para.slice(1).trim()}</span>
                      </div>
                    ) : (
                      <p key={i} className={cn(para.startsWith('**') && "text-xl font-black text-brutal-black")}>
                        {para.replace(/\*\*/g, '')}
                      </p>
                    )
                  ))}
                </div>
                {visualMeta.layout === 'two-column' && (
                  <div className="p-6 brutal-border bg-brutal-gray flex flex-col justify-center items-center text-center space-y-4">
                    <Info className="text-neon-pink" size={32} />
                    <p className="font-black uppercase text-sm">핵심 요약 및 시각화</p>
                    <div className="w-full h-32 brutal-border bg-white flex items-center justify-center">
                      <p className="text-xs font-bold text-gray-400">인포그래픽 영역</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedPost.mediaUrl && (
                <div className="brutal-border bg-brutal-gray aspect-video flex items-center justify-center">
                  <p className="font-bold text-gray-500">Media Content: {selectedPost.mediaUrl}</p>
                </div>
              )}

              <div className="pt-8 border-t-3 border-brutal-black flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-sm font-bold text-gray-500">
                  {selectedPost.dependencies.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Lock size={14} />
                      <span>선행 학습: {selectedPost.dependencies.join(', ')}</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => {
                    togglePostCompletion(selectedPost.id);
                    setSelectedPost(null);
                  }}
                  className={cn(
                    "w-full md:w-auto px-12 py-4 font-display text-2xl brutal-border brutal-shadow transition-all",
                    selectedPost.isCompleted ? "bg-brutal-gray" : "bg-neon-green hover:bg-neon-pink"
                  )}
                >
                  {selectedPost.isCompleted ? "학습 취소" : "학습 완료!"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ArrowRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
