import { 
  Villain, 
  Mission, 
  VulnerabilityDiagnosis, 
  MissionResult, 
  MissionReward,
  VillainGrade
} from "@/types/villain";
import { LearningLog } from "@/types/metacognition";

/**
 * Logic: 취약점 정밀 진단 및 식별
 * 최근 학습 데이터를 분석하여 취약 영역과 우선순위를 도출합니다.
 */
export function diagnoseVulnerabilities(logs: LearningLog[]): VulnerabilityDiagnosis[] {
  if (logs.length < 5) return [];

  // 가상 데이터: 실제로는 logs에서 과목/태그별 정답률을 계산함
  const diagnosis: VulnerabilityDiagnosis[] = [
    { area: "메모리 관리", accuracy: 45, priority: 1, errorType: 'Concept' },
    { area: "가상 메모리", accuracy: 55, priority: 2, errorType: 'Concept' },
    { area: "페이지 교체 알고리즘", accuracy: 30, priority: 1, errorType: 'Calculation' }
  ];

  return diagnosis.sort((a, b) => a.priority - b.priority);
}

/**
 * Logic: 빌런 등급 기반 맞춤형 미션 생성
 * 취약점을 기반으로 빌런을 생성하고 미션을 할당합니다.
 */
export function createVillainMission(diagnosis: VulnerabilityDiagnosis): { villain: Villain, mission: Mission } {
  const grade: VillainGrade = diagnosis.accuracy < 40 ? 5 : diagnosis.accuracy < 60 ? 3 : 1;
  
  const villain: Villain = {
    id: `v-${Date.now()}`,
    name: grade === 5 ? "페이지 폴트 대마왕" : "메모리 누수 유령",
    grade,
    type: grade === 5 ? 'CONCEPT_CONFUSION' : 'TIME_WASTER',
    weaknessTags: [diagnosis.area],
    hp: grade * 100,
    maxHp: grade * 100,
    appearance: grade === 5 ? "👹" : "👻",
    description: `${diagnosis.area} 영역이 매우 취약합니다. 이 빌런을 소탕하여 개념을 완성하세요!`,
    riskLevel: grade === 5 ? 'CRITICAL' : 'HIGH'
  };

  const mission: Mission = {
    id: `m-${Date.now()}`,
    villainId: villain.id,
    title: `[소탕 미션] ${diagnosis.area} 정복`,
    problemIds: Array.from({ length: 10 }).map((_, i) => `p-${diagnosis.area}-${i}`),
    timeLimit: 600, // 10분
    status: 'InProgress',
    startTime: new Date().toISOString()
  };

  return { villain, mission };
}

/**
 * Logic: 미션 수행 및 보상 트리거
 * 문제 풀이 결과를 바탕으로 빌런에게 데미지를 입히고 보상을 계산합니다.
 */
export function processMissionResult(
  villain: Villain, 
  accuracy: number, 
  streakCount: number = 0
): MissionResult {
  const isSuccess = accuracy >= 0.8;
  const damageDealt = Math.floor(villain.maxHp * accuracy);
  const remainingHp = Math.max(0, villain.hp - damageDealt);

  let rewards: MissionReward | undefined;
  if (isSuccess) {
    rewards = {
      exp: villain.grade * 50,
      currency: villain.grade * 10,
      streakBonus: streakCount > 2 ? 20 : 0
    };
  }

  return {
    isSuccess,
    accuracy,
    damageDealt,
    rewards,
    remainingHp
  };
}
