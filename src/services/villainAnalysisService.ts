import { 
  Villain, 
  VillainType, 
  KnowledgeGraphData, 
  KnowledgeNode, 
  KnowledgeLink 
} from "@/types/villain";
import { LearningLog, MetacognitiveReport } from "@/types/metacognition";

/**
 * Logic: 학습 취약점 기반 빌런 식별 로직
 * 오답 패턴을 분석하여 빌런을 식별합니다.
 */
export function identifyVillainsFromLogs(logs: LearningLog[]): Villain[] {
  if (logs.length < 5) return [];

  const conceptStats: Record<string, { total: number, incorrect: number, consecutiveIncorrect: number, errorTypes: string[] }> = {};

  logs.forEach(log => {
    if (!conceptStats[log.subject]) {
      conceptStats[log.subject] = { total: 0, incorrect: 0, consecutiveIncorrect: 0, errorTypes: [] };
    }
    const stats = conceptStats[log.subject];
    stats.total++;
    
    if (!log.isCorrect) {
      stats.incorrect++;
      stats.consecutiveIncorrect++;
      if (log.errorType) stats.errorTypes.push(log.errorType);
    } else {
      stats.consecutiveIncorrect = 0;
    }
  });

  const identifiedVillains: Villain[] = [];

  Object.entries(conceptStats).forEach(([subject, stats]) => {
    const errorRate = stats.incorrect / stats.total;
    
    // Business Rule: 오답률 60% 이상 연속 3회 발생 시 빌런 후보
    if (errorRate >= 0.6 || stats.consecutiveIncorrect >= 3) {
      const mostFrequentError = getMostFrequent(stats.errorTypes);
      const type: VillainType = mostFrequentError === 'Concept' ? 'CONCEPT_CONFUSION' : 'LAZY_READING';
      
      identifiedVillains.push({
        id: `v-${subject}`,
        name: type === 'CONCEPT_CONFUSION' ? `${subject} 파괴자` : `${subject}의 망령`,
        type,
        weaknessTags: [subject, mostFrequentError || 'Unknown'],
        hp: Math.floor(errorRate * 100),
        maxHp: 100,
        description: `${subject} 영역에서 치명적인 취약점이 발견되었습니다.`,
        riskLevel: errorRate > 0.8 ? 'CRITICAL' : 'HIGH'
      });
    }
  });

  return identifiedVillains;
}

/**
 * Logic: 학습 데이터 시각화 매핑 로직
 * 지식 그래프 데이터를 생성합니다.
 */
export function mapToKnowledgeGraph(logs: LearningLog[], villains: Villain[]): KnowledgeGraphData {
  const nodes: KnowledgeNode[] = [];
  const links: KnowledgeLink[] = [];
  const subjects = Array.from(new Set(logs.map(l => l.subject)));

  subjects.forEach(subject => {
    const subjectLogs = logs.filter(l => l.subject === subject);
    const accuracy = subjectLogs.filter(l => l.isCorrect).length / subjectLogs.length;
    const isVillain = villains.some(v => v.weaknessTags.includes(subject));

    nodes.push({
      id: subject,
      label: subject,
      type: 'Concept',
      status: accuracy > 0.8 ? 'Mastered' : isVillain ? 'Vulnerable' : 'Locked',
      score: Math.floor(accuracy * 100)
    });
  });

  // 빌런 노드 추가
  villains.forEach(v => {
    nodes.push({
      id: v.id,
      label: v.name,
      type: 'Villain',
      status: 'Vulnerable',
      score: v.hp
    });

    // 빌런과 해당 개념 연결
    v.weaknessTags.forEach(tag => {
      if (subjects.includes(tag)) {
        links.push({
          source: v.id,
          target: tag,
          strength: 1
        });
      }
    });
  });

  return { nodes, links };
}

/**
 * Logic: 메타인지 지수 산출 로직
 */
export function generateMetacognitionReport(logs: LearningLog[]): MetacognitiveReport {
  const mci = calculateMCI(logs);
  const vulnerabilityScore = calculateVulnerabilityScore(logs);
  
  return {
    mci,
    vulnerabilityScore,
    feedback: [],
    planExecutionGap: 0,
    suggestedDifficulty: mci > 0.7 ? 'Higher' : mci < 0.3 ? 'Lower' : 'Maintain',
    improvementStrategies: [
      "오답 노트를 통해 개념의 뿌리를 다시 확인하세요.",
      "예측 점수와 실제 점수의 차이를 줄이는 연습이 필요합니다."
    ]
  };
}

// Helpers
function getMostFrequent(arr: string[]) {
  if (arr.length === 0) return null;
  const counts: Record<string, number> = {};
  arr.forEach(x => counts[x] = (counts[x] || 0) + 1);
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

function calculateMCI(logs: LearningLog[]): number {
  // MCI: 주관적 자신감과 실제 정답률의 일치도
  const matches = logs.filter(l => {
    const isConfident = l.confidenceLevel >= 4;
    return isConfident === l.isCorrect;
  }).length;
  return matches / logs.length;
}

function calculateVulnerabilityScore(logs: LearningLog[]): number {
  const incorrect = logs.filter(l => !l.isCorrect).length;
  return (incorrect / logs.length) * 100;
}
