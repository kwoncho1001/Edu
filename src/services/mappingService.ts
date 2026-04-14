import { ConceptPost } from "@/types/gallery";

export interface ExamQuestion {
  id: string;
  type: string;
  content: string;
  options?: string[];
  answer: string;
  explanation: string;
  conceptId: string;
  difficulty: string;
  frequency: number;
  accuracy?: number;
  tags: string[];
  year?: number;
}

export interface ConceptNode {
  id: string;
  title: string;
  summary: string;
  parentId?: string;
  level: number;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  relation: 'Is-A' | 'Mapped-To' | 'Prerequisite';
  weight: number;
}

export interface KnowledgeGraph {
  nodes: (ConceptNode | ExamQuestion)[];
  edges: KnowledgeEdge[];
}

export interface UserStudyLog {
  userId: string;
  problemId: string;
  isCorrect: boolean;
  timestamp: string;
  timeSpent: number;
}

/**
 * Logic: 지능형 개념 태깅 엔진
 * 문제 본문을 분석하여 개념을 자동 매핑합니다.
 */
export function autoTagConcept(
  questionText: string, 
  conceptOntology: ConceptNode[]
): { primaryId: string; secondaryIds: string[]; confidence: number } {
  const tokens = questionText.toLowerCase().split(/\s+/);
  const scores = conceptOntology.map(concept => {
    const keywords = concept.title.toLowerCase().split(/\s+/);
    const matchCount = keywords.filter(k => tokens.includes(k)).length;
    const confidence = matchCount / keywords.length;
    return { id: concept.id, confidence };
  });

  const sorted = scores.sort((a, b) => b.confidence - a.confidence);
  const primary = sorted[0];
  
  // Business Rule: 80% 이상 일치 시 강제 매핑
  return {
    primaryId: primary.confidence >= 0.8 ? primary.id : 'unclassified',
    secondaryIds: sorted.slice(1, 4).filter(s => s.confidence > 0.5).map(s => s.id),
    confidence: primary.confidence
  };
}

/**
 * Logic: 기출 데이터 관계 매핑 및 구조화
 * 문제와 개념을 지식 그래프 구조로 변환합니다.
 */
export function structureKnowledgeGraph(
  questions: ExamQuestion[],
  concepts: ConceptNode[]
): KnowledgeGraph {
  const nodes: (ConceptNode | ExamQuestion)[] = [...concepts, ...questions];
  const edges: KnowledgeEdge[] = [];

  questions.forEach(q => {
    // Mapped-To 관계 생성
    edges.push({
      source: q.id,
      target: q.conceptId,
      relation: 'Mapped-To',
      weight: 0.85 // 기본 가중치
    });
  });

  concepts.forEach(c => {
    // Is-A 관계 (계층 구조)
    if (c.parentId) {
      edges.push({
        source: c.id,
        target: c.parentId,
        relation: 'Is-A',
        weight: 1.0
      });
    }
  });

  return { nodes, edges };
}

/**
 * Logic: 사용자 맞춤형 문제 도출 로직
 * 취약점과 이력을 기반으로 최적의 문제를 추천합니다.
 */
export function deriveCustomizedProblems(
  userId: string,
  questions: ExamQuestion[],
  studyLogs: UserStudyLog[],
  weakConceptTags: string[]
): { recommendedIds: string[]; reasons: string[] } {
  const recommendedIds: string[] = [];
  const reasons: string[] = [];

  // Business Rule: 오답률 60% 초과 개념 하위 문제 우선
  weakConceptTags.forEach(tag => {
    const tagLogs = studyLogs.filter(l => {
      const q = questions.find(question => question.id === l.problemId);
      return q?.tags.includes(tag);
    });
    
    const wrongCount = tagLogs.filter(l => !l.isCorrect).length;
    const errorRate = tagLogs.length > 0 ? wrongCount / tagLogs.length : 0;

    if (errorRate > 0.6) {
      const relatedQuestions = questions
        .filter(q => q.tags.includes(tag) && !studyLogs.some(l => l.problemId === q.id))
        .slice(0, 3);
      
      relatedQuestions.forEach(q => {
        recommendedIds.push(q.id);
        reasons.push(`${tag} 영역 오답률(${Math.round(errorRate * 100)}%) 기반 취약점 보완`);
      });
    }
  });

  // Business Rule: 최근 7일 내 학습하지 않은 영역 20% 무작위 배분
  const allTags = Array.from(new Set(questions.flatMap(q => q.tags)));
  const recentTags = new Set(studyLogs.map(l => {
    const q = questions.find(question => question.id === l.problemId);
    return q?.tags[0];
  }));

  const neglectedTags = allTags.filter(t => !recentTags.has(t));
  if (neglectedTags.length > 0 && recommendedIds.length < 5) {
    const randomTag = neglectedTags[Math.floor(Math.random() * neglectedTags.length)];
    const randomQ = questions.find(q => q.tags.includes(randomTag));
    if (randomQ) {
      recommendedIds.push(randomQ.id);
      reasons.push(`학습 편향 방지를 위한 ${randomTag} 영역 추천`);
    }
  }

  return { recommendedIds: Array.from(new Set(recommendedIds)).slice(0, 5), reasons };
}

/**
 * Logic: 개념 적중률 기반 우선순위 산정 (Legacy Support)
 */
export function calculateStudyPriority(
  concepts: any[],
  questions: ExamQuestion[],
  userData: any
) {
  return concepts
    .map(concept => {
      const relatedQuestions = questions.filter(q => q.conceptId === concept.id);
      const avgFrequency = relatedQuestions.reduce((acc, q) => acc + q.frequency, 0) / (relatedQuestions.length || 1);
      const wrongCount = relatedQuestions.filter(q => userData.wrongHistory.includes(q.id)).length;
      const errorRate = relatedQuestions.length > 0 ? wrongCount / relatedQuestions.length : 0;
      const score = (avgFrequency * 0.6) + (errorRate * 0.4 * 100);

      return {
        ...concept,
        priorityScore: score,
        reason: `출제 빈도(${avgFrequency.toFixed(1)}) 및 취약도(${(errorRate * 100).toFixed(0)}%) 기반`
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 5);
}

/**
 * Logic: 개념 확장 경로 추적 및 시각화 (Legacy Support)
 */
export function generateKnowledgeGraph(
  targetConceptId: string,
  concepts: any[],
  mappings: any[]
) {
  const nodes = concepts.map(c => ({
    id: c.id,
    label: c.title,
    type: 'concept',
    val: c.id === targetConceptId ? 2 : 1
  }));

  const edges = mappings.map(m => ({
    source: m.conceptId,
    target: m.questionId,
    weight: m.contributionWeight || 0.5
  }));

  return { nodes, edges };
}
