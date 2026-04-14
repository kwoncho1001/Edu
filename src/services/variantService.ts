import { ProblemDNA, VariantProblem, UserErrorLog, VulnerabilityReport, LogicStep } from "@/types/variant";
import { ExamQuestion } from "./mappingService";

/**
 * Logic: 기출 문제 DNA 추출 및 구조화 로직
 * 문제의 표면 정보를 제거하고 핵심 논리 구조(DNA)를 추출합니다.
 */
export function extractProblemDNA(question: ExamQuestion): ProblemDNA {
  // 실제로는 NLP와 규칙 기반 엔진이 작동하겠지만, 여기서는 시뮬레이션
  const logicSteps: LogicStep[] = [
    { id: 'step-1', description: '핵심 변수 식별', order: 1 },
    { id: 'step-2', description: '관련 공식/원리 적용', order: 2 },
    { id: 'step-3', description: '최종 결과 도출', order: 3 }
  ];

  return {
    id: `dna-${question.id}`,
    originalProblemId: question.id,
    coreConceptId: question.conceptId,
    logicSteps,
    difficultyCoefficient: question.difficulty === '고급' ? 1.5 : 1.0,
    parameters: {
      subject: question.content.includes('프로세스') ? 'Process' : 'Deadlock',
      complexity: 5
    }
  };
}

/**
 * Logic: 변형 문제 대응 시뮬레이션 및 응용 로직
 * DNA를 기반으로 수치나 조건을 변경하여 신유형 변형 문제를 생성합니다.
 */
export function simulateVariant(dna: ProblemDNA, targetDifficultyCoeff: number): VariantProblem {
  const isProcess = dna.parameters.subject === 'Process';
  
  // 수치 및 조건 변형 시뮬레이션
  const complexity = Math.floor(dna.parameters.complexity * targetDifficultyCoeff);
  
  const content = isProcess 
    ? `[신유형] ${complexity}개의 스레드가 공유 자원을 사용하는 환경에서, 컨텍스트 스위칭 오버헤드를 최소화하기 위한 전략은?`
    : `[신유형] ${complexity}개의 자원 유형이 존재하는 시스템에서 데드락을 방지하기 위한 은행원 알고리즘의 최소 필요 자원량은?`;

  return {
    id: `var-${Math.random().toString(36).substr(2, 9)}`,
    dnaId: dna.id,
    content,
    options: ["전략 A", "전략 B", "전략 C", "전략 D"],
    answer: "전략 B",
    explanation: "DNA 구조 내 논리적 정합성 검증 완료: 변형된 파라미터가 기존 원리와 충돌하지 않음.",
    difficulty: targetDifficultyCoeff > 1.2 ? '고급' : '중급',
    logicPath: dna.logicSteps.map(s => s.id)
  };
}

/**
 * Logic: 학습자 취약점 매핑 및 개인화 전략 로직
 * 오답 패턴을 분석하여 어느 논리 단계(DNA)에서 결함이 있는지 파악합니다.
 */
export function mapVulnerability(logs: UserErrorLog[], dna: ProblemDNA): VulnerabilityReport {
  const wrongLogs = logs.filter(l => !l.isCorrect);
  
  // 3회 이상 오답 발생 시 집중 보완 대상
  const isWeak = wrongLogs.length >= 3;
  
  // 풀이 시간과 선택지 데이터를 결합하여 오류 유형 식별
  const avgTime = logs.reduce((acc, l) => acc + l.timeSpent, 0) / logs.length;
  const errorType = avgTime < 10 ? 'Calculation' : (isWeak ? 'Concept' : 'Logic');

  return {
    weakDNAIds: isWeak ? [dna.id] : [],
    errorType,
    feedback: errorType === 'Concept' 
      ? "핵심 원리 이해가 부족합니다. 하위 선수 개념 DNA를 먼저 학습하세요."
      : "논리적 전개 과정에서 비약이 발견되었습니다. 단계별 시뮬레이션을 반복하세요.",
    recommendedDNAIds: [dna.id]
  };
}
