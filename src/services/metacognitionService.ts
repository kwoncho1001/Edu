import { 
  LearningLog, 
  MetacognitiveType, 
  MetacognitiveReport, 
  MetacognitiveFeedback,
  LearningPlan,
  VillainPattern
} from "@/types/metacognition";

/**
 * Logic: 학습 성취도 vs 체감 난이도 대조
 * 주관적 자신감과 실제 정답률을 대조하여 메타인지 유형을 분류합니다.
 */
export function analyzeMetacognitiveGap(logs: LearningLog[]): MetacognitiveReport {
  if (logs.length < 5) {
    return {
      mci: 0,
      feedback: [],
      planExecutionGap: 0,
      suggestedDifficulty: 'Maintain',
      vulnerabilityScore: 0,
      improvementStrategies: []
    };
  }

  const correctCount = logs.filter(l => l.isCorrect).length;
  const accuracy = correctCount / logs.length;
  const avgConfidence = logs.reduce((acc, l) => acc + l.confidenceLevel, 0) / (logs.length * 5);

  let type: MetacognitiveType;
  let feedback: MetacognitiveFeedback;
  let suggestedDifficulty: 'Lower' | 'Maintain' | 'Higher' = 'Maintain';

  // MCI (Metacognitive Inconsistency Index) calculation
  const mci = Math.abs(accuracy - avgConfidence);

  if (avgConfidence > 0.7 && accuracy < 0.4) {
    type = 'Overestimated';
    feedback = {
      type: 'Overestimated',
      title: '착각의 늪 빌런 출현!',
      message: '자신감은 높지만 실제 정답률이 낮습니다. "안다"는 느낌에 속고 있을 가능성이 커요.',
      actionGuide: '핵심 개념을 백지에 직접 써보며 빈틈을 확인하세요.',
      severity: 'High'
    };
    suggestedDifficulty = 'Lower';
  } else if (avgConfidence < 0.4 && accuracy > 0.8) {
    type = 'Underestimated';
    feedback = {
      type: 'Underestimated',
      title: '자신감 위축 빌런 소탕 필요',
      message: '실력은 충분한데 너무 신중합니다. 불필요한 고민이 시간을 뺏고 있어요.',
      actionGuide: '조금 더 과감하게 문제를 풀고, 고난도 문제에 도전해보세요.',
      severity: 'Medium'
    };
    suggestedDifficulty = 'Higher';
  } else if (accuracy < 0.4) {
    type = 'SkillDeficient';
    feedback = {
      type: 'SkillDeficient',
      title: '기초 부족 빌런 경고',
      message: '현재 난이도가 너무 높습니다. 기초가 흔들리면 모래성 쌓기일 뿐이에요.',
      actionGuide: '이전 단계의 갤러리로 돌아가 핵심 개념을 다시 다지세요.',
      severity: 'High'
    };
    suggestedDifficulty = 'Lower';
  } else {
    type = 'Mastery';
    feedback = {
      type: 'Mastery',
      title: '완전 학습 달성 중!',
      message: '자신감과 실력이 일치합니다. 아주 이상적인 메타인지 상태예요.',
      actionGuide: '지금의 페이스를 유지하며 심화 학습으로 확장하세요.',
      severity: 'Low'
    };
    suggestedDifficulty = 'Higher';
  }

  return {
    mci,
    feedback: [feedback],
    planExecutionGap: 0, // Will be calculated separately
    suggestedDifficulty,
    vulnerabilityScore: (1 - accuracy) * 100,
    improvementStrategies: [
      feedback.actionGuide,
      "주기적인 인출 연습(Active Recall)을 통해 장기 기억으로 전환하세요."
    ]
  };
}

/**
 * Logic: 행동 패턴 기반 학습 교정 피드백
 * 학습 로그를 분석하여 나쁜 습관(빌런)을 감지합니다.
 */
export const VILLAIN_PATTERNS: VillainPattern[] = [
  {
    id: 'speed-demon',
    name: '스피드 데몬',
    description: '너무 빨리 풀어서 실수 연발',
    triggerCondition: (logs) => {
      const avgTime = logs.reduce((acc, l) => acc + l.responseTime, 0) / logs.length;
      const errorRate = logs.filter(l => !l.isCorrect).length / logs.length;
      return avgTime < 5000 && errorRate > 0.4; // 5초 미만 응답 & 오답률 40% 초과
    },
    feedbackMessage: '너무 급하게 풀고 있어요! 뇌가 정보를 처리할 시간을 주세요.'
  },
  {
    id: 'hint-addict',
    name: '힌트 중독자',
    description: '고민 없이 바로 힌트 사용',
    triggerCondition: (logs) => {
      const hintRate = logs.filter(l => l.hintUsed).length / logs.length;
      return hintRate > 0.6;
    },
    feedbackMessage: '힌트에 너무 의존하고 있습니다. 스스로 생각하는 근육이 퇴화 중이에요!'
  }
];

export function detectVillains(logs: LearningLog[]): MetacognitiveFeedback[] {
  return VILLAIN_PATTERNS
    .filter(v => v.triggerCondition(logs))
    .map(v => ({
      type: 'VillainAlert',
      title: `${v.name} 빌런 감지!`,
      message: v.description,
      actionGuide: v.feedbackMessage,
      severity: 'Medium'
    }));
}

/**
 * Logic: 학습 계획 및 실행 일치도 분석
 * 계획 대비 실제 수행 데이터를 정량적으로 분석합니다.
 */
export function analyzePlanExecution(plan: LearningPlan): { 
  executionRate: number; 
  gapIndex: number; 
  feedback: string;
} {
  const executionRate = (plan.actualQuantity / plan.plannedQuantity) * 100;
  const timeGap = Math.abs(plan.actualTime - plan.plannedTime) / plan.plannedTime;
  const gapIndex = (100 - executionRate) + (timeGap * 100);

  let feedback = '';
  if (executionRate < 70) {
    feedback = '계획이 너무 과도합니다. 학습량을 30% 줄여서 성공 경험을 쌓으세요.';
  } else if (executionRate > 95 && timeGap < 0.1) {
    feedback = '계획과 실행이 완벽하게 일치합니다! 목표를 조금 더 높여보세요.';
  } else if (timeGap > 0.3) {
    feedback = '시간 배분 오류가 큽니다. 각 항목별 소요 시간을 다시 측정해보세요.';
  } else {
    feedback = '안정적인 실행력을 보여주고 있습니다.';
  }

  return { executionRate, gapIndex, feedback };
}
