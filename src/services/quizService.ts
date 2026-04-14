import { 
  DeepQuiz, 
  QuizEvaluation, 
  LearnerKnowledgeVector,
  ConceptRelation 
} from "@/types/quiz";

/**
 * Logic: 지식 맥락 추출 및 변환 엔진
 */
export function generateDeepQuiz(
  conceptId: string, 
  knowledgeGraph: { nodes: any[], links: ConceptRelation[] }
): DeepQuiz {
  const relations = knowledgeGraph.links.filter(l => l.id === conceptId || l.targetId === conceptId);
  
  // 2단계 사고 질문 템플릿 적용
  const question = `해당 개념의 핵심 원리를 인접 개념들과의 연관성을 고려하여 서술하고, 왜 이 개념이 시스템 전체에서 중요한지 논리적으로 설명하세요.`;
  
  return {
    id: `quiz-${conceptId}-${Date.now()}`,
    subject: '운영체제',
    question,
    relatedConcepts: relations.map(r => r.targetId),
    expectedKeywords: ['인과관계', '상호작용', '최적화', '메커니즘'],
    modelAnswer: "이 개념은 시스템의 안정성과 효율성을 보장하는 핵심 메커니즘으로, 인접한 자원 관리 개념들과 상호작용하며 전체적인 최적화를 달성합니다.",
    complexity: relations.length > 3 ? 8 : 5,
    rubric: {
      logicWeight: 0.4,
      keywordWeight: 0.3,
      causalityWeight: 0.3
    }
  };
}

/**
 * Logic: 서술형 답안 정성 평가 엔진
 */
export function evaluateSubjectiveAnswer(
  answer: string, 
  quiz: DeepQuiz
): QuizEvaluation {
  if (answer.length < 20) {
    return {
      score: 0,
      feedback: "답안이 지나치게 짧아 논리 구조 파악이 불가능합니다. 더 구체적으로 서술해주세요.",
      missingKeywords: quiz.expectedKeywords,
      logicAnalysis: "분석 불가",
      causalityScore: 0,
      isSufficient: false
    };
  }

  const foundKeywords = quiz.expectedKeywords.filter(k => answer.includes(k));
  const missingKeywords = quiz.expectedKeywords.filter(k => !answer.includes(k));
  
  // 단순화를 위한 모의 논리 분석 (실제로는 NLP/LLM 연동)
  const hasCausalConnectors = /때문에|하므로|따라서|결과적으로/.test(answer);
  const causalityScore = hasCausalConnectors ? 90 : 40;
  
  const keywordScore = (foundKeywords.length / quiz.expectedKeywords.length) * 100;
  const logicScore = answer.length > 100 ? 85 : 60;

  const totalScore = Math.floor(
    (logicScore * quiz.rubric.logicWeight) + 
    (keywordScore * quiz.rubric.keywordWeight) + 
    (causalityScore * quiz.rubric.causalityWeight)
  );

  return {
    score: totalScore,
    feedback: totalScore > 70 
      ? "개념 간의 인과관계를 잘 파악하고 있으며 논리적 흐름이 매끄럽습니다." 
      : "핵심 키워드는 포함되었으나 문장 간의 논리적 연결이 다소 부족합니다.",
    missingKeywords,
    logicAnalysis: answer.length > 100 ? "서론-본론-결론의 구조를 갖춤" : "단문 위주의 나열",
    causalityScore,
    isSufficient: totalScore >= 60
  };
}

/**
 * Logic: 다차원 난이도 산정 로직
 */
export function calculateOptimalDifficulty(
  learner: LearnerKnowledgeVector,
  quizzes: DeepQuiz[]
): DeepQuiz {
  // 최근 5회차 평균 정답률 기반
  const avgScore = learner.history.length > 0 
    ? learner.history.reduce((acc, h) => acc + h.score, 0) / learner.history.length 
    : 50;

  let targetComplexity = 5;
  if (avgScore >= 80) targetComplexity = 8;
  else if (avgScore < 40) targetComplexity = 3;

  // 가장 가까운 복잡도를 가진 퀴즈 반환
  return quizzes.reduce((prev, curr) => 
    Math.abs(curr.complexity - targetComplexity) < Math.abs(prev.complexity - targetComplexity) ? curr : prev
  );
}

export const MOCK_QUIZZES: DeepQuiz[] = [
  {
    id: 'q1',
    subject: '운영체제',
    question: '프로세스와 스레드의 차이점을 메모리 공유 관점에서 서술하고, 왜 멀티스레딩이 멀티프로세싱보다 자원 효율적인지 인과관계를 설명하세요.',
    relatedConcepts: ['Memory', 'Context Switching', 'Resource Sharing'],
    expectedKeywords: ['공유', '독립', '오버헤드', '효율'],
    modelAnswer: '프로세스는 독립된 메모리 공간을 가지는 반면 스레드는 프로세스 내의 자원을 공유합니다. 따라서 컨텍스트 스위칭 시 발생하는 오버헤드가 적어 자원 효율적입니다.',
    complexity: 6,
    rubric: { logicWeight: 0.4, keywordWeight: 0.3, causalityWeight: 0.3 }
  },
  {
    id: 'q2',
    subject: '운영체제',
    question: '데드락(Deadlock)의 4가지 발생 조건이 상호 어떻게 결합되어 시스템 마비를 초래하는지, 그리고 이를 예방하기 위한 은행원 알고리즘의 논리 구조를 설명하세요.',
    relatedConcepts: ['Deadlock', 'Banker Algorithm', 'Resource Allocation'],
    expectedKeywords: ['상호배제', '점유대기', '비선점', '순환대기', '안정상태'],
    modelAnswer: '데드락은 4가지 조건이 동시에 충족될 때 발생하며, 은행원 알고리즘은 자원 할당 전 안정 상태 여부를 검사하여 이를 예방합니다.',
    complexity: 9,
    rubric: { logicWeight: 0.5, keywordWeight: 0.2, causalityWeight: 0.3 }
  }
];
