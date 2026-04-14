import { 
  LearningCard, 
  MasteryLevel, 
  ForgettingCurveConfig 
} from "@/types/scheduler";

const CONFIG: ForgettingCurveConfig = {
  initialInterval: 24, // 24 hours
  maxInterval: 365 * 24, // 1 year in hours
  masteryThreshold: 3
};

/**
 * Logic: 학습 콘텐츠 피드백 기반 숙련도 조정 및 망각 곡선 스케줄링
 */
export function calculateNextInterval(
  currentInterval: number, 
  feedback: MasteryLevel,
  masteryCount: number
): { nextInterval: number; nextMasteryCount: number; status: LearningCard['status'] } {
  let multiplier = 1.2;
  let nextMasteryCount = 0;

  switch (feedback) {
    case 'Easy':
      multiplier = 2.0;
      nextMasteryCount = masteryCount + 1;
      break;
    case 'Normal':
      multiplier = 1.2;
      nextMasteryCount = 0;
      break;
    case 'Hard':
      multiplier = 0.5;
      nextMasteryCount = 0;
      break;
  }

  let nextInterval = Math.floor(currentInterval * multiplier);
  
  // Constraints: Min 1 hour, Max 1 year
  nextInterval = Math.max(1, Math.min(nextInterval, CONFIG.maxInterval));

  // Business Rule: Consecutive 'Easy' leads to 'Mastered'
  const status: LearningCard['status'] = nextMasteryCount >= CONFIG.masteryThreshold ? 'Mastered' : 'Reviewing';

  return { nextInterval, nextMasteryCount, status };
}

/**
 * Logic: 동적 우선순위 정렬 로직
 */
export function calculatePriority(card: LearningCard): number {
  const now = new Date().getTime();
  const nextReview = new Date(card.nextReviewAt).getTime();
  const lastReview = card.lastReviewedAt ? new Date(card.lastReviewedAt).getTime() : new Date(card.createdAt).getTime();
  
  const elapsedSinceLast = now - lastReview;
  const totalInterval = nextReview - lastReview;
  
  // 망각 임계치 도달 비율 (0.0 ~ 1.0+)
  const thresholdRatio = elapsedSinceLast / totalInterval;
  
  let priority = 0;

  // Rule: 80% 초과 시 가중치 +10
  if (thresholdRatio > 0.8) {
    priority += 10;
  }

  // Rule: 임계치 초과 시 'Critical' 등급 (높은 가중치)
  if (thresholdRatio >= 1.0) {
    priority += 50;
  }

  // Rule: 'Hard' 피드백 이력 가중치 (masteryCount가 0이면 최근에 어려웠을 가능성 높음)
  if (card.masteryCount === 0) {
    priority *= 1.5;
  }

  return priority;
}

export function sortCardsByPriority(cards: LearningCard[]): LearningCard[] {
  return [...cards]
    .map(card => ({ ...card, priority: calculatePriority(card) }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 50); // 일일 50개 제한
}

export const MOCK_CARDS: LearningCard[] = [
  {
    id: 'c1',
    title: '가상 메모리 (Virtual Memory)',
    content: '물리 메모리보다 큰 프로세스를 실행하기 위해 보조 기억 장치를 메모리처럼 사용하는 기술.',
    tags: ['OS', 'Memory'],
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    nextReviewAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2시간 전 (임계치 초과)
    intervalHours: 24,
    masteryCount: 0,
    status: 'Reviewing',
    priority: 0
  },
  {
    id: 'c2',
    title: '데드락 (Deadlock)',
    content: '프로세스들이 서로 자원을 점유한 채 무한정 대기하는 상태.',
    tags: ['OS', 'Concurrency'],
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    nextReviewAt: new Date(Date.now() + 12 * 3600000).toISOString(), // 12시간 후
    intervalHours: 24,
    masteryCount: 1,
    status: 'Learning',
    priority: 0
  }
];
