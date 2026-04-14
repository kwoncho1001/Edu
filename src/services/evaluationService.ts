import { 
  ReasoningStep, 
  ComplexQuestion, 
  EvaluationSession, 
  CompetencyReport 
} from "@/types/evaluation";

/**
 * Logic: 논리적 추론 경로 분석기
 */
export function analyzeReasoningPath(
  selectedPath: string[], 
  idealPath: string[],
  timePerStep: Record<string, number>
): { 
  isGuessing: boolean; 
  defects: string[]; 
  stagnationPoints: string[] 
} {
  const defects: string[] = [];
  const stagnationPoints: string[] = [];
  const TIME_THRESHOLD = 30000; // 30 seconds

  // 1. 논리 결함 체크
  selectedPath.forEach((stepId, index) => {
    if (stepId !== idealPath[index]) {
      defects.push(`단계 ${index + 1}: 핵심 논리 경로에서 이탈함`);
    }
    
    // 2. 사고 정체 체크
    if (timePerStep[stepId] > TIME_THRESHOLD) {
      stagnationPoints.push(`단계 ${index + 1}: 사고 정체 발생 (${Math.floor(timePerStep[stepId]/1000)}초 소요)`);
    }
  });

  // 3. 요행(Guessing) 판별: 정답은 맞혔으나 경로가 짧거나 시간이 너무 짧은 경우 등
  const isCorrect = JSON.stringify(selectedPath) === JSON.stringify(idealPath);
  const totalTime = Object.values(timePerStep).reduce((a, b) => a + b, 0);
  const isGuessing = isCorrect && totalTime < 5000; // 5초 미만으로 정답 도출 시 요행 의심

  return { isGuessing, defects, stagnationPoints };
}

/**
 * Logic: 다중 개념 결합 문제 생성기
 */
export function generateComplexQuestion(
  masteredConcepts: string[],
  difficulty: number
): ComplexQuestion {
  // Mock: 실제로는 지식 그래프에서 교집합 원리를 추출
  return {
    id: 'cq-1',
    title: '시스템 자원 경합 및 데드락 해결',
    scenario: '멀티코어 환경에서 다수의 프로세스가 한정된 뮤텍스(Mutex)를 두고 경쟁하고 있습니다. 현재 시스템은 낮은 응답성을 보이고 있으며, 특정 조건에서 프로세스들이 멈추는 현상이 발생합니다.',
    combinedConcepts: ['Process Scheduling', 'Deadlock Prevention', 'Resource Allocation'],
    difficulty,
    options: [
      { id: 's1', description: '현재 자원 할당 상태를 그래프로 가시화하여 순환 대기 존재 여부 확인', isKeyPath: true, order: 1 },
      { id: 's2', description: '모든 프로세스에 강제 종료 신호를 보내 자원 회수', isKeyPath: false, order: 2 },
      { id: 's3', description: '은행원 알고리즘을 적용하여 안정 상태(Safe State) 여부 검사', isKeyPath: true, order: 2 },
      { id: 's4', description: '타임 퀀텀을 늘려 컨텍스트 스위칭 빈도 감소', isKeyPath: false, order: 3 },
      { id: 's5', description: '자원 할당 순서를 정적(Static)으로 고정하여 순환 대기 조건 제거', isKeyPath: true, order: 3 },
    ],
    idealPath: ['s1', 's3', 's5']
  };
}

/**
 * Logic: 개념 유기적 구조화 평가 엔진
 */
export function calculateConnectivityIndex(
  session: EvaluationSession,
  questions: ComplexQuestion[]
): number {
  let totalConnectivity = 0;
  
  session.responses.forEach(resp => {
    const q = questions.find(question => question.id === resp.questionId);
    if (!q) return;

    // 상위 원리를 정답으로 제시했는지 확인 (가중치 부여)
    const correctSteps = resp.selectedPath.filter(id => q.idealPath.includes(id)).length;
    const accuracy = correctSteps / q.idealPath.length;
    
    totalConnectivity += accuracy;
  });

  return Math.min(1.0, totalConnectivity / session.responses.length);
}

export function generateAchievementReport(
  session: EvaluationSession,
  questions: ComplexQuestion[]
): CompetencyReport {
  const connectivityIndex = calculateConnectivityIndex(session, questions);
  
  // Mock calculation
  return {
    overallScore: 85,
    principleUnderstanding: 90,
    applicationPower: 75,
    logicalConsistency: 80,
    connectivityIndex,
    areaScores: [
      { area: '자원 관리', score: 95 },
      { area: '동기화', score: 70 },
      { area: '스케줄링', score: 85 },
    ],
    feedback: [
      { type: 'Principle', message: '시스템의 교착 상태 예방 원리에 대한 이해가 매우 깊습니다.' },
      { type: 'Application', message: '복합적인 자원 경합 상황에서 우선순위를 결정하는 응용력이 다소 부족합니다.' }
    ],
    bottlenecks: ['단계 2: 안정 상태 검사 로직에서 사고 정체 발생']
  };
}
