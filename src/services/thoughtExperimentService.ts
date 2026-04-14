import { 
  ThoughtScenario, 
  ThoughtVariable, 
  ThoughtOutcome, 
  ThoughtExperimentLog,
  MasteryProfile
} from "@/types/thoughtExperiment";

/**
 * Logic: 변수 동적 조작 엔진
 */
export function calculateOutcome(scenario: ThoughtScenario, variables: ThoughtVariable[]): ThoughtOutcome {
  // 시나리오별 정의된 로직 모델 실행
  return scenario.logicModel(variables);
}

/**
 * Logic: 반례 자동 생성 분석기
 */
export function findCounterExample(
  scenario: ThoughtScenario, 
  currentVariables: ThoughtVariable[],
  userHypothesisId: string
): { counterVariables: ThoughtVariable[], reason: string } | null {
  
  // 단순화를 위해 임의의 변수 조합을 탐색하여 가설과 다른 결과가 나오는 지점 탐색
  // 실제로는 경계값 분석(Boundary Value Analysis) 수행
  for (const variable of currentVariables) {
    const testValues = [variable.min, variable.max, (variable.min + variable.max) / 2];
    
    for (const val of testValues) {
      const testVars = currentVariables.map(v => v.id === variable.id ? { ...v, value: val } : v);
      const outcome = scenario.logicModel(testVars);
      
      if (outcome.id !== userHypothesisId) {
        return {
          counterVariables: testVars,
          reason: `변수 '${variable.name}'의 값이 ${val}${variable.unit}일 때, 당신의 가설과 반대되는 결과(${outcome.title})가 도출됩니다.`
        };
      }
    }
  }
  
  return null;
}

/**
 * Logic: 시나리오 기반 숙달도 평가기
 */
export function evaluateMastery(logs: ThoughtExperimentLog[]): MasteryProfile {
  if (logs.length < 5) {
    return {
      score: 0,
      consistency: 0,
      applicationPower: 0,
      responseTime: 0,
      radarData: [],
      recommendedPath: ["더 많은 시뮬레이션 데이터가 필요합니다."]
    };
  }

  const correctPredictions = logs.filter(l => l.predictedOutcomeId === l.actualOutcomeId).length;
  const accuracy = correctPredictions / logs.length;
  const counterExampleSuccess = logs.filter(l => !l.isCounterExample).length / logs.length;

  return {
    score: Math.floor(accuracy * 100),
    consistency: Math.floor(counterExampleSuccess * 100),
    applicationPower: Math.floor((accuracy * 0.7 + counterExampleSuccess * 0.3) * 100),
    responseTime: 2.5, // Mock avg response time
    radarData: [
      { subject: '논리적 추론', value: accuracy * 100 },
      { subject: '변수 통제', value: 85 },
      { subject: '반례 대응', value: counterExampleSuccess * 100 },
      { subject: '일관성', value: 70 },
      { subject: '응용력', value: 90 },
    ],
    recommendedPath: [
      "복합 변수 시나리오에 도전하여 인과관계의 깊이를 더하세요.",
      "반례 분석 리포트를 통해 논리적 허점을 보완하세요."
    ]
  };
}

// Mock Scenarios
export const MOCK_SCENARIOS: ThoughtScenario[] = [
  {
    id: 's1',
    conceptId: 'os-scheduling',
    title: 'CPU 스케줄링 효율성 실험',
    description: '프로세스 도착 시간과 실행 시간을 조절하여 평균 대기 시간의 변화를 관찰하세요.',
    initialVariables: [
      { id: 'v1', name: '프로세스 수', value: 5, min: 1, max: 20, unit: '개', description: '동시 실행 대기 중인 프로세스' },
      { id: 'v2', name: '평균 실행 시간', value: 10, min: 1, max: 50, unit: 'ms', description: '각 프로세스의 소요 시간' },
      { id: 'v3', name: '타임 퀀텀', value: 4, min: 1, max: 20, unit: 'ms', description: 'RR 방식의 시간 할당량' },
    ],
    possibleOutcomes: [
      { id: 'o1', title: '오버헤드 과다', description: '컨텍스트 스위칭이 너무 빈번하여 시스템 성능이 저하됩니다.', causalPath: ['v3'], logicBasis: '타임 퀀텀이 너무 작음' },
      { id: 'o2', title: '응답성 저하', description: '특정 프로세스가 CPU를 독점하여 다른 프로세스의 대기 시간이 길어집니다.', causalPath: ['v3', 'v2'], logicBasis: '타임 퀀텀이 너무 큼' },
      { id: 'o3', title: '최적 균형', description: '적절한 응답성과 처리량을 유지합니다.', causalPath: ['v3'], logicBasis: '적절한 타임 퀀텀 설정' },
    ],
    logicModel: (vars) => {
      const quantum = vars.find(v => v.id === 'v3')?.value || 0;
      if (quantum < 2) return MOCK_SCENARIOS[0].possibleOutcomes[0];
      if (quantum > 15) return MOCK_SCENARIOS[0].possibleOutcomes[1];
      return MOCK_SCENARIOS[0].possibleOutcomes[2];
    }
  }
];
