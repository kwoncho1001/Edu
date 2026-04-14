import { 
  KnowledgeItem, 
  RecallQuiz, 
  RecallLog, 
  RecallSession 
} from "@/types/recall";

/**
 * Logic: 지능형 문답 자동 생성 엔진
 */
export function generateRecallQuiz(item: KnowledgeItem): RecallQuiz {
  const keywords = item.tags.length > 0 ? item.tags : ['핵심 개념'];
  const mainKeyword = keywords[0];
  
  // 단순화를 위한 템플릿 기반 생성
  const question = `다음 설명이 가리키는 '${item.category}' 관련 핵심 개념은 무엇입니까?\n\n"${item.content.substring(0, 100)}..."`;
  
  return {
    id: `quiz-${item.id}-${Date.now()}`,
    knowledgeId: item.id,
    question,
    answer: mainKeyword,
    options: [mainKeyword, '유사 개념 A', '유사 개념 B', '반대 개념 C'],
    hints: [
      `첫 글자는 '${mainKeyword[0]}'입니다.`,
      `이 개념은 ${item.category}의 기초가 됩니다.`,
      `정답은 '${mainKeyword}'입니다.`
    ],
    type: item.content.length > 200 ? 'summary' : 'subjective',
    difficulty: item.fixationLevel > 80 ? 3 : 1
  };
}

/**
 * Logic: 간격 반복 기반 망각 곡선 최적화
 */
export function calculateNextReview(
  item: KnowledgeItem, 
  isCorrect: boolean, 
  difficultyRating: 'easy' | 'hard' | 'forgot'
): Partial<KnowledgeItem> {
  let newInterval = item.intervalDays;

  if (difficultyRating === 'easy') {
    newInterval = item.intervalDays * 2;
  } else if (difficultyRating === 'hard') {
    newInterval = Math.max(1, Math.floor(item.intervalDays * 1.2));
  } else {
    newInterval = 1; // 리셋
  }

  // 최대 180일 제한
  newInterval = Math.min(newInterval, 180);

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    intervalDays: newInterval,
    nextReviewAt: nextDate.toISOString(),
    lastReviewedAt: new Date().toISOString(),
    fixationLevel: isCorrect ? Math.min(100, item.fixationLevel + 10) : Math.max(0, item.fixationLevel - 20)
  };
}

/**
 * Logic: 인출 촉진 타이머 및 피드백 루프
 */
export function evaluateRecallPerformance(
  responseTime: number,
  isCorrect: boolean,
  hintCount: number
): number {
  let score = isCorrect ? 100 : 0;
  
  // 시간 압박 페널티 (30초 기준)
  if (responseTime > 30000) {
    score -= 20;
  }
  
  // 힌트 사용 페널티
  score -= hintCount * 15;
  
  return Math.max(0, score);
}

export const MOCK_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'k1',
    content: '가상 메모리는 물리 메모리 크기의 한계를 극복하기 위해 보조 기억 장치를 메모리처럼 사용하는 기술입니다. 페이징과 세그먼테이션 기법이 주로 사용됩니다.',
    category: '운영체제',
    tags: ['가상 메모리', '페이징', '세그먼테이션'],
    fixationLevel: 45,
    nextReviewAt: new Date().toISOString(),
    intervalDays: 1
  },
  {
    id: 'k2',
    content: '데드락(Deadlock)은 두 개 이상의 프로세스가 서로 상대방이 가진 자원을 기다리며 무한 대기에 빠지는 상태를 말합니다. 발생 조건으로는 상호 배제, 점유 대기, 비선점, 순환 대기가 있습니다.',
    category: '운영체제',
    tags: ['데드락', '교착 상태'],
    fixationLevel: 70,
    nextReviewAt: new Date().toISOString(),
    intervalDays: 3
  }
];
